'use server'

import { NewPostParams, insertPostSchema, posts } from '@/lib/db/schema/posts'
import { MarkdownTextSplitter } from '@langchain/textsplitters'
import { embed, embedMany } from 'ai'
import { cosineDistance, desc, gt, sql } from 'drizzle-orm'
import { openai } from '../clients/openai'
import { db } from '../db'
import {
  embeddings,
  embeddings as embeddingsTable
} from '../db/schema/embeddings'

const model = openai.embedding('text-embedding-ada-002')

const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ')
  const { embedding } = await embed({
    model,
    value: input
  })
  return embedding
}

const generateChunks = async (input: string): Promise<string[]> => {
  const splitter = new MarkdownTextSplitter({
    chunkSize: 1024,
    chunkOverlap: 128
  })
  const output = await splitter.splitText(input)
  return output
}

const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = await generateChunks(value)
  const { embeddings } = await embedMany({
    model,
    values: chunks
  })
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }))
}

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery)
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded
  )})`
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4)
  return similarGuides
}

export const createPost = async (input: NewPostParams) => {
  try {
    const { content, tags, posterUrl, title, summary } =
      insertPostSchema.parse(input)

    const [post] = await db
      .insert(posts)
      .values({ content, tags, posterUrl, title, summary })
      .returning()

    const embeddings = await generateEmbeddings(content)
    await db.insert(embeddingsTable).values(
      embeddings.map((embedding) => ({
        postId: post.id,
        ...embedding
      }))
    )

    return 'Post successfully created and embedded.'
  } catch (error) {
    return error instanceof Error && error.message.length > 0
      ? error.message
      : 'Error, please try again.'
  }
}
