import * as React from 'react'
import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { SiteFooter, SiteHeader } from '@/components/layout/SiteHeader'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { I18nProvider } from '@/i18n'
import '@/styles/globals.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="light">
      <I18nProvider>
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main id="main" className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
      </I18nProvider>
    </ThemeProvider>
  )
}
