import * as React from 'react'
import { Moon, Sun, Sparkles } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import type { ThemeId } from './types'
import { cn } from '@/lib/utils'

const ICONS: Record<ThemeId, React.ReactNode> = {
  light: <Sun className="h-4 w-4" aria-hidden />,
  dark: <Moon className="h-4 w-4" aria-hidden />,
  shadcn: <Sparkles className="h-4 w-4" aria-hidden />,
}

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme, themes } = useTheme()
  return (
    <div
      role="group"
      aria-label="Theme"
      className={cn(
        'inline-flex items-center gap-0.5 rounded-[var(--radius)] border border-border bg-bg-surface p-0.5',
        className,
      )}
    >
      {themes.map((t) => (
        <button
          key={t.id}
          type="button"
          aria-label={`Theme ${t.label}`}
          aria-pressed={theme === t.id}
          onClick={() => setTheme(t.id)}
          className={cn(
            'inline-flex h-8 w-8 items-center justify-center rounded-[calc(var(--radius)-2px)] transition-colors',
            theme === t.id
              ? 'bg-primary text-primary-foreground'
              : 'text-ink-soft hover:bg-bg-surface-hover hover:text-ink',
          )}
          title={t.label}
        >
          {ICONS[t.id]}
        </button>
      ))}
    </div>
  )
}
