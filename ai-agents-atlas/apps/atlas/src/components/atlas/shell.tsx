'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Lightweight wrapper around the site header / footer. Active-route
 * highlighting is rendered server-side in `BaseLayout.astro` so this
 * component is purely presentational and hydration-safe.
 */
export function AtlasShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('isolate min-h-screen bg-background text-foreground', className)}>
      {children}
    </div>
  );
}

/**
 * Stand-alone theme toggle for use inside the Astro header.
 * Server-stable: renders a placeholder until mounted.
 */
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@atlas/ui/components/ui/button';

export function HeaderThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();
  React.useEffect(() => setMounted(true), []);

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="text-muted-foreground"
    >
      {mounted ? (
        theme === 'dark' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )
      ) : (
        <Sun className="h-4 w-4 opacity-50" />
      )}
    </Button>
  );
}