export type Locale = 'zh' | 'en'
export type ThemeId = 'light' | 'dark' | 'shadcn'
export type ViewMode = 'classic' | 'slides'

export interface LessonMeta {
  id: string
  slug: string
  phase: string
  order: number
  phaseOrder: number
  title: { en: string; zh: string }
  hook: string
  type: string
  languages: string[]
  prerequisites: string[]
  timeMinutes: number | null
  needsTranslation: boolean
}

export interface Slide {
  id: string
  title: string
  bodyMarkdown: string
  keyPoints: string[]
  commands: { lang: string; code: string; caption?: string }[]
}

export interface PhaseSummary {
  id: string
  order: number
  title: { en: string; zh: string }
  blurb: string
  lessonCount: number
}

export interface GlossaryTerm {
  term: string
  category: string
  meaning: string
  why: string
  related: string[]
}

export interface LessonDetail {
  meta: LessonMeta
  markdown: string
  slides: Slide[]
  usedLocale: Locale
  needsTranslation: boolean
}

export interface Heading {
  id: string
  title: string
  level: number
}
