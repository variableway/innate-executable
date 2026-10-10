import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { extractHeadings, getLessonNeighbours, pickLocalized, type LessonDetail, type Locale, type PhaseSummary, type LessonMeta } from '@aej/content'
import { useI18n } from '@/i18n'
import { Markdown } from '@/components/lesson/Markdown'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn, slugify } from '@/lib/utils'

export function LessonSidebar({
  phases,
  lessons,
  currentId,
  locale,
}: {
  phases: PhaseSummary[]
  lessons: LessonMeta[]
  currentId: string
  locale: Locale
}) {
  const { t } = useI18n()
  return (
    <aside className="hidden w-60 shrink-0 overflow-y-auto border-r border-border bg-bg px-2 py-4 lg:block">
      <p className="mono-label px-3 pb-2">{t('lessonNav')}</p>
      {phases.map((phase) => {
        const phaseLessons = lessons.filter((l) => l.phase === phase.id)
        if (!phaseLessons.length) return null
        return (
          <div key={phase.id} className="mb-4">
            <p className="px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-mute">
              {pickLocalized(phase.title, locale) || phase.id}
            </p>
            <ul className="space-y-0.5">
              {phaseLessons.map((lesson) => (
                <li key={lesson.id}>
                  <Link
                    to="/lesson/$phase/$lesson"
                    params={{ phase: lesson.phase, lesson: lesson.slug }}
                    className={cn(
                      'block rounded-[var(--radius)] px-3 py-1.5 text-sm no-underline',
                      lesson.id === currentId
                        ? 'bg-[var(--blueprint-tint-strong)] font-medium text-ink'
                        : 'text-ink-soft hover:bg-bg-surface-hover hover:text-ink',
                    )}
                  >
                    {pickLocalized(lesson.title, locale) || lesson.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </aside>
  )
}

export function LessonToc({ markdown }: { markdown: string }) {
  const { t } = useI18n()
  const headings = React.useMemo(() => extractHeadings(markdown).filter((h) => h.level <= 3), [markdown])
  return (
    <aside className="hidden w-52 shrink-0 overflow-y-auto border-l border-border px-3 py-6 xl:block">
      <p className="mono-label mb-2">{t('onThisPage')}</p>
      <ul className="space-y-1">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
            <a
              href={`#${slugify(h.title)}`}
              className="block text-xs text-ink-soft no-underline hover:text-[var(--blueprint)]"
            >
              {h.title}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export function ClassicLessonView({ detail }: { detail: LessonDetail }) {
  const { t, locale } = useI18n()
  const { prev, next } = getLessonNeighbours(detail.meta.id)
  const title = pickLocalized(detail.meta.title, locale) || detail.meta.title.en

  return (
    <article className="flex flex-col gap-4">
      <header className="space-y-2 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{detail.meta.type}</Badge>
          {detail.meta.timeMinutes != null && (
            <Badge variant="secondary">
              {detail.meta.timeMinutes} {t('minutes')}
            </Badge>
          )}
          {detail.needsTranslation && <Badge variant="warn">{t('needsTranslation')}</Badge>}
        </div>
        <h1 className="font-display text-4xl">{title}</h1>
        {detail.meta.hook && <p className="text-lg italic text-ink-soft">{detail.meta.hook}</p>}
        <p className="mono-label">
          {t('languages')}: {detail.meta.languages.join(', ') || '—'}
          {detail.meta.prerequisites.length > 0 && (
            <> · {t('prerequisites')}: {detail.meta.prerequisites.join(', ')}</>
          )}
        </p>
      </header>

      <Markdown>{detail.markdown}</Markdown>

      <Separator className="my-4" />
      <div className="flex items-center justify-between gap-3">
        {prev ? (
          <Button asChild variant="outline">
            <Link to="/lesson/$phase/$lesson" params={{ phase: prev.phase, lesson: prev.slug }}>
              ← {t('previous')}
            </Link>
          </Button>
        ) : (
          <span />
        )}
        {next ? (
          <Button asChild variant="outline">
            <Link to="/lesson/$phase/$lesson" params={{ phase: next.phase, lesson: next.slug }}>
              {t('next')} →
            </Link>
          </Button>
        ) : (
          <span />
        )}
      </div>
    </article>
  )
}
