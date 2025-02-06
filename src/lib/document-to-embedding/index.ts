'use server'

import { findRelevantContent, storeEmbeddings } from './db-io'
import { Embedding, generateEmbedding, generateEmbeddings } from './embeddings'
import { loadPDF } from './loaders'
import {
  generateChunksByMarkdownTextSplitter,
  generateChunksByRecursiveCharacterTextSplitter
} from './splitters'

export {
  findRelevantContent,
  generateChunksByMarkdownTextSplitter,
  generateChunksByRecursiveCharacterTextSplitter,
  generateEmbedding,
  generateEmbeddings,
  loadPDF,
  storeEmbeddings
}

export type { Embedding }
