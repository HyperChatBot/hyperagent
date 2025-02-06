'use client'

import Markdown from '@/components/markdown'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { callingToolsRenders } from '@/lib/calling-tools'
import { ToolInvocation } from 'ai'
import { useChat } from 'ai/react'

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    addToolResult,
    error,
    reload,
    isLoading
  } = useChat({ maxSteps: 3 })

  return (
    <div className="stretch mx-auto flex w-full max-w-5xl flex-col py-24">
      {messages.map((message) => {
        if (message.role === 'user')
          return (
            <Card key={message.id} className="mb-4 p-4">
              <p className="font-bold">User: </p>
              <div>{message.content}</div>
            </Card>
          )

        if (message.role === 'assistant')
          return (
            <Card key={message.id} className="mb-4 p-4">
              <>
                <p className="font-bold">AI: </p>
                <Markdown src={message.content} />
              </>

              {Array.isArray(message.toolInvocations) &&
              message.toolInvocations.length > 0 ? (
                <>
                  {message.toolInvocations.map(
                    (toolInvocation: ToolInvocation) => {
                      const toolCallId = toolInvocation.toolCallId
                      const addResult = (result: string) =>
                        addToolResult({ toolCallId, result })
                      const CallingTool =
                        callingToolsRenders[toolInvocation.toolName]

                      const Render = () => (
                        <>
                          <p className="font-bold">
                            Calling Tool - {toolInvocation.toolName}:
                          </p>
                          <CallingTool
                            key={toolCallId}
                            toolInvocation={toolInvocation}
                          />
                        </>
                      )

                      return (
                        <Card key={message.id} className="my-4 p-4">
                          <p className="font-bold">
                            Calling Tool - {toolInvocation.toolName}:
                          </p>
                          <CallingTool
                            key={toolCallId}
                            toolInvocation={toolInvocation}
                          />
                        </Card>
                      )
                    }
                  )}
                </>
              ) : null}
            </Card>
          )
      })}

      {error && (
        <>
          <div>An error occurred.</div>
          <Button type="button" onClick={() => reload()}>
            Retry
          </Button>
        </>
      )}

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 flex w-full justify-center bg-[hsl(var(--background))] py-4 dark:bg-[hsl(var(--background))]"
      >
        <Input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          className="w-1/2"
          disabled={error != null || isLoading}
        />
      </form>
    </div>
  )
}
