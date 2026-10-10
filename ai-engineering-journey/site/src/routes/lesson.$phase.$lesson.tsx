import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { getLesson, getLessons, getPhases, pickLocalized } from '@aej/content'
import type { LessonDetail } from '@aej/content'
import { useI18n } from '@/i18n'
import { ClassicLessonView, LessonSidebar, LessonToc } from '@/components/lesson/LessonChrome'
import { SlidesViewer } from '@/features/slides/SlidesViewer'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import type { ViewMode } from '@/theme/types'

type LessonParams = { phase: string; lesson: string }
type LessonSearch = { mode?: ViewMode }

export const Route = createFileRoute('/lesson/$phase/$lesson')({
  validateSearch: (s): LessonSearch => ({
    mode: s.mode === 'slides' ? 'slides' : s.mode === 'classic' ? 'classic' : undefined,
  }),
  loader: async ({ params, deps }) => {
    const locale = (deps as { locale?: 'zh' | 'en' })?.locale ?? 'zh'
    return getLesson(`${params.phase}/${params.lesson}`, locale)
  },
  component: LessonPage,
})

function LessonPage() {
  const detail = Route.useLoaderData() as LessonDetail
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const { locale, t } = useI18n()
  const phases = getPhases(locale)
  const lessons = getLessons()
  const title = pickLocalized(detail.meta.title, locale) || detail.meta.title.en
  const [mode, setMode] = React.useState<ViewMode>(search.mode ?? 'classic')

  // re-fetch when locale changes
  const [localized, setLocalized] = React.useState(detail)
  React.useEffect(() => {
    let cancelled = false
    getLesson(detail.meta.id, locale).then((d) => {
      if (!cancelled) setLocalized(d)
    })
    return () => {
      cancelled = true
    }
  }, [detail.meta.id, locale])

  const setModeAndUrl = (v: ViewMode) => {
    setMode(v)
    navigate({ search: { mode: v }, replace: true })
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <LessonSidebar phases={phases} lessons={lessons} currentId={localized.meta.id} locale={locale} />

      <div className="min-w-0 flex-1">
        <div className="border-b border-border px-4 py-3 md:px-8">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="mono-label">{localized.meta.phase}</span>
              {localized.needsTranslation && <Badge variant="warn">{t('needsTranslation')}</Badge>}
            </div>
            <Tabs value={mode} onValueChange={(v) => setModeAndUrl(v as ViewMode)}>
              <TabsList>
                <TabsTrigger value="classic">{t('classic')}</TabsTrigger>
                <TabsTrigger value="slides" disabled={!localized.slides.length}>
                  {t('slides')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <Tabs value={mode} onValueChange={(v) => setModeAndUrl(v as ViewMode)}>
          <TabsContent value="classic" className="px-4 py-8 md:px-10">
            <div className="mx-auto max-w-3xl">
              <ClassicLessonView detail={localized} />
            </div>
          </TabsContent>
          <TabsContent value="slides">
            <SlidesViewer slides={localized.slides} title={title} />
          </TabsContent>
        </Tabs>
      </div>

      <LessonToc markdown={localized.markdown} />
    </div>
  )
}
