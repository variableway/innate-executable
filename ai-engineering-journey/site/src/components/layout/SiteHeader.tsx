import * as React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { Menu, X, Languages } from 'lucide-react'
import { ThemeSwitcher } from '@/theme/ThemeSwitcher'
import { useI18n } from '@/i18n'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { t, locale, setLocale } = useI18n()
  const [open, setOpen] = React.useState(false)
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const nav = [
    { to: '/', label: t('home') },
    { to: '/catalog', label: t('catalog') },
    { to: '/roadmap', label: t('roadmap') },
    { to: '/glossary', label: t('glossary') },
    { to: '/about', label: t('about') },
  ]

  return (
    <header
      className="sticky top-0 z-50 border-b border-border backdrop-blur"
      style={{ background: 'var(--header-bg)' }}
    >
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl tracking-wide text-ink no-underline">
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center border border-[var(--blueprint)] font-mono text-xs text-[var(--blueprint)]"
          >
            AI
          </span>
          <span className="hidden sm:inline">{t('brand')}</span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'font-mono text-xs uppercase tracking-wider no-underline',
                pathname === item.to ? 'text-[var(--blueprint)]' : 'text-ink-soft hover:text-ink',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            aria-label={t('language')}
            onClick={() => setLocale(locale === 'zh' ? 'en' : 'zh')}
            className="font-mono text-xs"
          >
            <Languages className="h-4 w-4" aria-hidden />
            {locale === 'zh' ? '中文' : 'EN'}
          </Button>
          <ThemeSwitcher />
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border md:hidden">
          <div className="container-page flex flex-col gap-2 py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="py-1 font-mono text-sm text-ink no-underline"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}

export function SiteFooter() {
  const { t } = useI18n()
  return (
    <footer className="mt-16 border-t border-border py-8">
      <div className="container-page flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="mono-label">{t('footerNote')}</p>
        <a
          href="https://github.com/rohitg00/ai-engineering-from-scratch"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-[var(--blueprint)]"
        >
          {t('github')} ↗
        </a>
      </div>
    </footer>
  )
}
