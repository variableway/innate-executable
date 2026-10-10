import * as React from 'react'
import zh from './zh.json'
import en from './en.json'
import type { Locale } from '@/theme/types'

const dicts: Record<Locale, Record<string, string>> = { zh, en }

type I18nContextValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const I18nContext = React.createContext<I18nContextValue | null>(null)

function readLocale(): Locale {
  if (typeof window === 'undefined') return 'zh'
  try {
    const v = window.localStorage.getItem('aej-locale')
    if (v === 'en' || v === 'zh') return v
  } catch {
    /* ignore */
  }
  return 'zh'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>(() => readLocale())

  React.useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = React.useCallback((l: Locale) => {
    setLocaleState(l)
    try {
      window.localStorage.setItem('aej-locale', l)
    } catch {
      /* ignore */
    }
  }, [])

  const t = React.useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let s = dicts[locale][key] ?? dicts.en[key] ?? key
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.replace(`{${k}}`, String(v))
        }
      }
      return s
    },
    [locale],
  )

  const value = React.useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = React.useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
