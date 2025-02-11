import {
  generateChunksByRecursiveCharacterTextSplitter,
  generateEmbeddings,
  loadPDF,
  storeEmbeddingsToDb
} from '@/lib/document-to-embeddings'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const pdfFile = formData.get('pdf') as Blob
  const docs = await loadPDF(pdfFile)
  const chunks = await generateChunksByRecursiveCharacterTextSplitter(docs)
  const embeddings = await generateEmbeddings(
    chunks.map((chunk) => chunk.pageContent)
  )
  await storeEmbeddingsToDb(embeddings)

  return NextResponse.json({
    success: true
  })
}
