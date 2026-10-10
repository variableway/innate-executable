import * as React from 'react'
import { createFileRoute, Link, useSearch } from '@tanstack/react-router'
import { getLessons, getPhases, pickLocalized } from '@aej/content'
import { useI18n } from '@/i18n'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type CatalogSearch = { phase?: string }

export const Route = createFileRoute('/catalog')({
  validateSearch: (s): CatalogSearch => ({
    phase: typeof s.phase === 'string' ? s.phase : undefined,
  }),
  component: CatalogPage,
})

function CatalogPage() {
  const { t, locale } = useI18n()
  const search = useSearch({ from: '/catalog' })
  const phases = getPhases(locale)
  const [phaseFilter, setPhaseFilter] = React.useState(search.phase ?? '')
  const lessons = getLessons(phaseFilter || undefined)

  return (
    <div className="container-page space-y-6 py-10">
      <header>
        <h1 className="font-display text-4xl">{t('catalog')}</h1>
        <p className="text-ink-soft">{t('lessons')}</p>
      </header>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={phaseFilter === '' ? 'default' : 'outline'}
          onClick={() => setPhaseFilter('')}
        >
          {t('allPhases')}
        </Button>
        {phases.map((p) => (
          <Button
            key={p.id}
            size="sm"
            variant={phaseFilter === p.id ? 'default' : 'outline'}
            onClick={() => setPhaseFilter(p.id)}
            className={cn('font-mono text-[10px]')}
          >
            {p.id.split('-').slice(0, 2).join('-')}
          </Button>
        ))}
      </div>

      <div className="grid gap-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="shadow-none">
            <CardHeader className="py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-lg">
                  <Link
                    to="/lesson/$phase/$lesson"
                    params={{ phase: lesson.phase, lesson: lesson.slug }}
                    className="text-ink no-underline hover:text-[var(--blueprint)]"
                  >
                    {pickLocalized(lesson.title, locale) || lesson.slug}
                  </Link>
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{lesson.type}</Badge>
                  {lesson.needsTranslation && <Badge variant="warn">{t('needsTranslation')}</Badge>}
                </div>
              </div>
              <CardDescription className="font-mono text-xs">
                {lesson.phase}
                {lesson.timeMinutes ? ` · ${lesson.timeMinutes}${t('minutes')}` : ''}
              </CardDescription>
            </CardHeader>
            {lesson.hook && (
              <CardContent className="pt-0 text-sm text-ink-soft">{lesson.hook}</CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
