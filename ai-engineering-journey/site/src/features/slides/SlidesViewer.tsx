import * as React from 'react'
import { Check, Copy } from 'lucide-react'
import type { Slide } from '@aej/content'
import { useI18n } from '@/i18n'
import { Markdown } from '@/components/lesson/Markdown'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function SlidesViewer({
  slides,
  title,
}: {
  slides: Slide[]
  title: string
}) {
  const { t } = useI18n()
  const [index, setIndex] = React.useState(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    const m = hash.match(/s=(\d+)/)
    return m ? Math.min(Number(m[1]) - 1, Math.max(slides.length - 1, 0)) : 0
  })

  React.useEffect(() => {
    window.location.hash = `s=${index + 1}`
  }, [index])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(i + 1, slides.length - 1))
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slides.length])

  if (!slides.length) {
    return <p className="text-ink-soft">{t('noKeyPoints')}</p>
  }

  const slide = slides[Math.min(index, slides.length - 1)]

  return (
    <div className="flex h-full min-h-[70vh] flex-col gap-0">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            aria-label="Previous slide"
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
          >
            ←
          </Button>
          <span className="mono-label">
            {t('slideOf', { n: index + 1, total: slides.length })}
          </span>
          <Button
            variant="outline"
            size="sm"
            aria-label="Next slide"
            disabled={index >= slides.length - 1}
            onClick={() => setIndex((i) => Math.min(slides.length - 1, i + 1))}
          >
            →
          </Button>
        </div>
        <div className="min-w-0 flex-1 truncate text-right font-display text-lg text-ink">
          {slide.title}
        </div>
      </div>

      {/* upper: section body */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <p className="mono-label mb-2">{title}</p>
        <Markdown>{slide.bodyMarkdown}</Markdown>
      </div>

      {/* lower: key points + commands */}
      <div className="grid gap-0 border-t-2 border-border bg-bg-surface md:grid-cols-2">
        <section className="border-border p-4 md:border-r">
          <h3 className="mono-label mb-2 text-[var(--blueprint)]">{t('keyPoints')}</h3>
          {slide.keyPoints.length ? (
            <ul className="space-y-1.5">
              {slide.keyPoints.map((p, i) => (
                <li key={i} className="ml-4 list-disc text-sm text-ink">
                  {p}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-mute">{t('noKeyPoints')}</p>
          )}
        </section>
        <section className="p-4">
          <h3 className="mono-label mb-2 text-[var(--blueprint)]">{t('commands')}</h3>
          {slide.commands.length ? (
            <div className="space-y-3">
              {slide.commands.map((c, i) => (
                <CommandBlock key={i} lang={c.lang} code={c.code} caption={c.caption} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-mute">{t('noCommands')}</p>
          )}
        </section>
      </div>
    </div>
  )
}

function CommandBlock({
  lang,
  code,
  caption,
}: {
  lang: string
  code: string
  caption?: string
}) {
  const { t } = useI18n()
  const [copied, setCopied] = React.useState(false)

  return (
    <div className="rounded-[var(--radius)] border border-border bg-code-bg">
      <div className="flex items-center justify-between border-b border-border px-2 py-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px]">
            {lang}
          </Badge>
          {caption && <span className="text-xs text-ink-mute">{caption}</span>}
        </div>
        <Button
          variant="ghost"
          size="sm"
          aria-label={t('copy')}
          onClick={() => {
            navigator.clipboard.writeText(code).then(() => {
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            })
          }}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" aria-hidden /> {t('copied')}
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden /> {t('copy')}
            </>
          )}
        </Button>
      </div>
      <pre className={cn('m-0 border-0 bg-transparent text-xs')}>{code}</pre>
    </div>
  )
}
