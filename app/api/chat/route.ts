import { CoreMessage, streamText } from 'ai'
import { callingToolsFns } from '../../../lib/calling-tools'
import { openai } from '../../../lib/clients/openai'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You are a helpful assistant. Check your knowledge base and use tool calls before answering any questions.
    if no relevant information is found in the tool calls, search on your trained data."`,
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
