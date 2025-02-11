'use client'

import '@/assets/css/markdown-code.css'
import hljs from 'highlight.js'
import { Check, Copy } from 'lucide-react'
import { Marked, Renderer, Tokens } from 'marked'
import markedKatex from 'marked-katex-extension'
import { FC, memo, useCallback, useState } from 'react'
import { renderToString } from 'react-dom/server'

interface Props {
  src: string
}

const CodeBlockHeader: FC<{ language: string; code: string }> = ({
  language,
  code
}) => {
  const [isCopied, setIsCopied] = useState(false)

  const copyToClipboard = () => {
    if (isCopied) return

    window.navigator.clipboard
      .writeText(code)
      .then(() => {
        setIsCopied(true)

        setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      })
      .catch((err) => {
        console.error('Error copying code: ', err)
      })
  }

  return (
    <div className="hljs mb-px mt-4 flex select-none items-center justify-between rounded-t-md px-4 py-2 text-xs">
      <span>{language}</span>
      <div className="cursor-pointer">
        <div>
          <div
            className="flex items-center gap-1"
            onClick={() => copyToClipboard()}
          >
            {isCopied ? (
              <Check height={12} width={12} />
            ) : (
              <Copy height={12} width={12} />
            )}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const Markdown: FC<Props> = ({ src }) => {
  const parseMarkdown = useCallback(() => {
    const renderer = new Renderer()

    renderer.code = ({ text, lang }: Tokens.Code) => {
      const language = (lang && lang.split(/\s/)[0]) ?? 'javascript'

      const highlighted =
        language && hljs.getLanguage(language)
          ? hljs.highlight(text, { language: language }).value
          : hljs.highlightAuto(text).value

      return `${renderToString(<CodeBlockHeader language={language} code={text} />)} <pre class="hljs mb-4 p-4 rounded-b-md overflow-x-scroll text-xs last:my-0"><code class="${language}">${highlighted}</code></pre>`
    }

    renderer.codespan = ({ text }: Tokens.Codespan) =>
      `<code class="px-0.5 py-[0.0625rem] bg-border rounded-md ">${text}</code>`

    renderer.image = ({ text, href }: Tokens.Image) => {
      return `<img src="${href}" alt="${text}" class="mb-3" loading="lazy" />`
    }

    renderer.link = ({ href, text }: Tokens.Link) => {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="font-bold underline">${text}</a>`
    }

    const marked = new Marked({
      renderer: {
        ...renderer,
        table(...args) {
          return `<div class="overflow-x-scroll">${renderer.table.apply(this, args)}</div>`
        }
      }
    })

    marked.use(markedKatex())

    return marked.parse(src)
  }, [src])

  return (
    <section
      className="markdown"
      dangerouslySetInnerHTML={{ __html: parseMarkdown() }}
    />
  )
}

export default memo(Markdown)
