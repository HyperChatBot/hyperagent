'use client'

import Markdown from '@/components/markdown'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { callingToolsRenders } from '@/lib/calling-tools'
import { UploadIcon } from '@radix-ui/react-icons'
import { ToolInvocation } from 'ai'
import { useChat } from 'ai/react'
import { ChangeEvent } from 'react'

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

  const uploadPDF = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const formData = new FormData()
    formData.append('pdf', e.target.files[0])

    fetch('/api/upload-pdf', {
      body: formData,
      method: 'post'
    })
  }

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
        className="fixed bottom-0 left-0 flex w-full items-center justify-center gap-4 bg-[hsl(var(--background))] py-4 dark:bg-[hsl(var(--background))]"
      >
        <div className="relative h-5 w-5">
          <input
            type="file"
            accept="application/pdf"
            className="absolute left-0 top-0 h-5 w-5 opacity-0"
            onChange={uploadPDF}
          />
          <UploadIcon width={20} height={20} />
        </div>

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
