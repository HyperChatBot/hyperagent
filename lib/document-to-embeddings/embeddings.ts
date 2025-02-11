import { embed, embedMany } from 'ai'
import { model } from './models'

export interface Embedding {
  embedding: number[]
  content: string
}

// transform user's prompt to embedding vector
export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ')
  const { embedding } = await embed({
    model,
    value: input
  })
  return embedding
}

// bath transform knowledge bases to embedding vector
export const generateEmbeddings = async (
  chunks: string[]
): Promise<Embedding[]> => {
  const { embeddings } = await embedMany({
    model,
    values: chunks
  })

  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }))
}
