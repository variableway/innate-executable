import * as React from 'react'
import type { ThemeId } from './types'

const STORAGE_KEY = 'aej-theme'

type ThemeContextValue = {
  theme: ThemeId
  setTheme: (t: ThemeId) => void
  themes: { id: ThemeId; label: string }[]
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

export const THEMES: { id: ThemeId; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'shadcn', label: 'Shadcn' },
]

function readStored(): ThemeId {
  if (typeof window === 'undefined') return 'light'
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    if (v === 'light' || v === 'dark' || v === 'shadcn') return v
  } catch {
    /* ignore */
  }
  return 'light'
}

function applyTheme(theme: ThemeId) {
  const root = document.documentElement
  root.setAttribute('data-theme', theme)
}

export function ThemeProvider({
  children,
  defaultTheme,
  storageKey = STORAGE_KEY,
}: {
  children: React.ReactNode
  defaultTheme?: ThemeId
  storageKey?: string
}) {
  const [theme, setThemeState] = React.useState<ThemeId>(() => defaultTheme || readStored())

  React.useLayoutEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = React.useCallback(
    (t: ThemeId) => {
      setThemeState(t)
      applyTheme(t)
      try {
        window.localStorage.setItem(storageKey, t)
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  )

  const value = React.useMemo(() => ({ theme, setTheme, themes: THEMES }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
