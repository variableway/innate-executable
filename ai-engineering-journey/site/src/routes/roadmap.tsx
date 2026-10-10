import { createFileRoute, Link } from '@tanstack/react-router'
import { getLessons, getPhases, pickLocalized } from '@aej/content'
import { useI18n } from '@/i18n'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/roadmap')({
  component: RoadmapPage,
})

function RoadmapPage() {
  const { t, locale } = useI18n()
  const phases = getPhases(locale)
  const lessons = getLessons()

  return (
    <div className="container-page space-y-8 py-10">
      <header>
        <h1 className="font-display text-4xl">{t('roadmap')}</h1>
        <p className="text-ink-soft">{t('phases')}</p>
      </header>

      <ol className="space-y-4">
        {phases.map((phase) => {
          const phaseLessons = lessons.filter((l) => l.phase === phase.id)
          return (
            <li key={phase.id}>
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <CardTitle>
                      <span className="mono-label mr-2">{String(phase.order).padStart(2, '0')}</span>
                      {pickLocalized(phase.title, locale)}
                    </CardTitle>
                    <Badge variant="secondary">
                      {phase.lessonCount} {t('lessonCount')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="flex flex-wrap gap-2">
                    {phaseLessons.map((lesson, i) => (
                      <li key={lesson.id}>
                        <Link
                          to="/lesson/$phase/$lesson"
                          params={{ phase: lesson.phase, lesson: lesson.slug }}
                          className="inline-block rounded-full border border-border px-3 py-1 font-mono text-xs text-ink-soft no-underline hover:border-[var(--blueprint)] hover:text-[var(--blueprint)]"
                        >
                          {String(i + 1).padStart(2, '0')} {pickLocalized(lesson.title, locale) || lesson.slug}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
