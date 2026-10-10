import { createFileRoute } from '@tanstack/react-router'
import { getGlossary } from '@aej/content'
import { useI18n } from '@/i18n'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/glossary')({
  component: GlossaryPage,
})

function GlossaryPage() {
  const { t, locale } = useI18n()
  const terms = getGlossary(locale)

  return (
    <div className="container-page space-y-6 py-10">
      <header>
        <h1 className="font-display text-4xl">{t('glossary')}</h1>
        <p className="text-ink-soft">{terms.length} terms</p>
      </header>
      <div className="grid gap-3">
        {terms.map((term) => (
          <Card key={term.term} className="shadow-none">
            <CardHeader className="py-4">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-lg">{term.term}</CardTitle>
                {term.category && <Badge variant="outline">{term.category}</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm">
              <p className="text-ink">{term.meaning}</p>
              {term.why && <p className="text-ink-soft">{term.why}</p>}
              {term.related?.length > 0 && (
                <p className="mono-label">
                  related: {term.related.join(' · ')}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
