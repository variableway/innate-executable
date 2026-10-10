import { createFileRoute, Link } from '@tanstack/react-router'
import { getLessons, getPhases, pickLocalized } from '@aej/content'
import { useI18n } from '@/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { t, locale } = useI18n()
  const phases = getPhases(locale)
  const lessons = getLessons()
  const first = lessons[0]

  return (
    <div className="container-page space-y-12 py-12">
      <section className="space-y-4 border-b border-border pb-10">
        <p className="mono-label">AI ENGINEERING JOURNEY</p>
        <h1 className="font-display text-5xl md:text-6xl">{t('heroTitle')}</h1>
        <p className="max-w-2xl text-lg text-ink-soft">{t('heroSub')}</p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild>
            <Link to="/lesson/$phase/$lesson" params={first ? { phase: first.phase, lesson: first.slug } : { phase: '00-setup-and-tooling', lesson: '01-dev-environment' }}>
              {t('openLesson')} →
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/catalog">{t('browseCatalog')}</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-4">{t('phases')}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {phases.map((phase) => (
            <Card key={phase.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{pickLocalized(phase.title, locale)}</CardTitle>
                  <Badge variant="outline">
                    {phase.lessonCount} {t('lessonCount')}
                  </Badge>
                </div>
                <CardDescription>{phase.blurb}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  to="/catalog"
                  search={{ phase: phase.id }}
                  className="font-mono text-xs text-[var(--blueprint)] uppercase tracking-wider"
                >
                  {t('catalog')} →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
