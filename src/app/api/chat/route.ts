import { callingToolsFns } from '@/lib/calling-tools'
import { openai } from '@/lib/clients/openai'
import { CoreMessage, streamText } from 'ai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You are a helpful assistant. Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    if no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
    messages,
    tools: callingToolsFns
  })

  return result.toDataStreamResponse({
    getErrorMessage: (error) => {
      if (error == null) {
        return 'unknown error'
      }

      if (typeof error === 'string') {
        return error
      }

      if (error instanceof Error) {
        return error.message
      }

      return JSON.stringify(error)
    }
  })
}
