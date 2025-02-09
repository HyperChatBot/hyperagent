'use client'

import hljs from 'highlight.js'
import '@/assets/css/markdown-code.css'
import { Marked, Renderer, Tokens } from 'marked'
import markedKatex from 'marked-katex-extension'
import { FC, memo, useCallback } from 'react'

interface Props {
  src: string
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

      return `<pre class="hljs my-4 p-4 rounded-md border border-border overflow-x-scroll text-xs last:my-0"><code class="${language}">${highlighted}</code></pre>`
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
