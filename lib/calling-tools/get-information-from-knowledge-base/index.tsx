import { tool } from 'ai'
import { FC } from 'react'
import { z } from 'zod'
import Markdown from '../../../components/markdown'
import { CallingToolProps } from '../../../types'
import { findRelevantContent } from '../../document-to-embedding'

const callingToolName = 'getInformationFormKnowledgeBase'

const toolFn = {
  [callingToolName]: tool({
    description: `get information from your knowledge base to answer questions.`,
    parameters: z.object({
      question: z.string().describe('the users question')
    }),
    execute: async ({ question }) => findRelevantContent(question)
  })
}

const Render: FC<CallingToolProps> = ({ toolInvocation }) => {
  return (
    <>
      {'result' in toolInvocation ? (
        <Markdown src={toolInvocation.result?.[0]?.name} />
      ) : null}
    </>
  )
}

const callingTool = {
  callingToolName,
  toolFn,
  Render
}

export default callingTool
