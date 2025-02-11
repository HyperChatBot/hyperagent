import { openai } from '../clients/openai'

export const model = openai.embedding('text-embedding-ada-002')
