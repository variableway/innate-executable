import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn, slugify } from '@/lib/utils'

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn('lesson-markdown space-y-4', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="font-display text-4xl" {...props} />,
          h2: (props) => <h2 id={slugify(String(props.children ?? ''))} className="font-display text-2xl border-b border-border pb-2 pt-4" {...props} />,
          h3: (props) => <h3 id={slugify(String(props.children ?? ''))} className="font-display text-xl pt-3" {...props} />,
          p: (props) => <p className="text-ink" {...props} />,
          li: (props) => <li className="ml-5 list-disc" {...props} />,
          code: ({ className: cls, children, ...props }) => {
            const isBlock = /language-/.test(cls || '')
            if (isBlock) {
              return (
                <code className={cn(cls, 'block whitespace-pre-wrap')} {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className={cls} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

export { slugify } from '@/lib/utils'
