'use client';

import * as React from 'react';
import { Palette } from 'lucide-react';
import { Button } from '@atlas/ui/components/ui/button';

/**
 * Palette switcher (default ↔ blueprint) — orthogonal to the light/dark
 * axis that next-themes manages. It toggles `data-palette` on <html> and
 * persists to its own localStorage key; the FOUC script in BaseLayout
 * restores it before first paint. Server-stable: placeholder until mounted.
 */

const STORAGE_KEY = 'ai-agents-atlas-palette';

export function HeaderPaletteToggle({ label }: { label: string }) {
  const [palette, setPalette] = React.useState<'default' | 'blueprint' | null>(null);

  React.useEffect(() => {
    setPalette(
      document.documentElement.dataset.palette === 'blueprint' ? 'blueprint' : 'default',
    );
  }, []);

  const toggle = () => {
    const next = palette === 'blueprint' ? 'default' : 'blueprint';
    setPalette(next);
    try {
      if (next === 'default') {
        delete document.documentElement.dataset.palette;
        localStorage.removeItem(STORAGE_KEY);
      } else {
        document.documentElement.dataset.palette = next;
        localStorage.setItem(STORAGE_KEY, next);
      }
    } catch (_) {}
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-pressed={palette === 'blueprint'}
      onClick={toggle}
      className="text-muted-foreground"
    >
      <Palette className={palette ? 'h-4 w-4' : 'h-4 w-4 opacity-50'} />
    </Button>
  );
}
