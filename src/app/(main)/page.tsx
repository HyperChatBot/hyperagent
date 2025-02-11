'use client'

import Markdown from '@/components/markdown'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { callingToolsRenders } from '@/lib/calling-tools'
import { ToolInvocation } from 'ai'
import { useChat } from 'ai/react'
import { UploadIcon } from 'lucide-react'
import { ChangeEvent, useEffect, useRef } from 'react'

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
  const ref = useRef<HTMLDivElement | null>(null)

  const uploadPDF = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const formData = new FormData()
    formData.append('pdf', e.target.files[0])

    fetch('/api/upload-pdf', {
      body: formData,
      method: 'post'
    })
  }

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ left: 0, top: ref.current.scrollHeight })
    }
  }, [messages])

  return (
    <section className="flex h-[calc(100vh-4rem)] flex-col overflow-auto transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-[calc(100vh-3rem)]">
      <div className="flex flex-1 justify-center overflow-scroll" ref={ref}>
        <div className="h-full">
          <div className="flex w-screen flex-col px-4 md:w-[48rem] lg:w-[48rem]">
            {messages.map((message) => {
              if (message.role === 'user')
                return (
                  <div key={message.id} className="mb-8 flex justify-end">
                    <div className="max-w-md rounded-3xl bg-secondary p-4">
                      {message.content}
                    </div>
                  </div>
                )

              if (message.role === 'assistant')
                return (
                  <div key={message.id} className="my-4">
                    <Markdown src={message.content} />

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
                              <Card
                                key={message.id}
                                className="my-4 overflow-x-scroll p-4"
                              >
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
                  </div>
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
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex w-full justify-center bg-background py-4 dark:bg-background"
      >
        <div className="flex w-screen items-center gap-4 px-4 md:w-[48rem] lg:w-[48rem]">
          <div className="relative h-5 w-5">
            <input
              type="file"
              accept="application/pdf"
              className="absolute left-0 top-0 h-5 w-5 opacity-0"
              onChange={uploadPDF}
            />
            <UploadIcon width={16} height={16} />
          </div>
          <Input
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
            className="w-full"
            disabled={error != null || isLoading}
          />
        </div>
      </form>
    </section>
  )
}
