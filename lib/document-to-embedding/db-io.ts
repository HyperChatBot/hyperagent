import { cosineDistance, desc, gt, sql } from 'drizzle-orm'
import { db } from '../db'
import { embeddings as embeddingsTable } from '../db/schema/embeddings'
import { Embedding, generateEmbedding } from './embeddings'

export const storeEmbeddings = async (embeddings: Embedding[]) => {
  await db.insert(embeddingsTable).values(embeddings)
}

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery)

  const similarity = sql<number>`1 - (${cosineDistance(
    embeddingsTable.embedding,
    userQueryEmbedded
  )})`

  const similarGuides = await db
    .select({ name: embeddingsTable.content, similarity })
    .from(embeddingsTable)
    .where(gt(similarity, 0.5))
    .orderBy((t) => desc(t.similarity))
    .limit(4)

  return similarGuides
}
