import { CallingToolProps } from '@/types'
import { addDays, format } from 'date-fns'
import { FC } from 'react'
import { z } from 'zod'

const callingToolName = 'getDate'

const toolFn = {
  [callingToolName]: {
    description:
      'Display date to the user. You should give the offset as a parameter to today.',
    parameters: z.object({ offset: z.number() }),
    execute: async ({ offset }: { offset: number }) => {
      return format(addDays(new Date(), offset), 'PPPP')
    }
  }
}

const Render: FC<CallingToolProps> = ({ toolInvocation }) => {
  return (
    <>{'result' in toolInvocation ? <p>{toolInvocation.result}</p> : null}</>
  )
}

const callingTool = {
  callingToolName,
  toolFn,
  Render
}

export default callingTool
