'use client';

import { Clock } from 'lucide-react';
import { useAtlasStore, useHydrated } from '@/lib/store';
import { Card } from '@atlas/ui/components/ui/card';
import { Badge } from '@atlas/ui/components/ui/badge';
import { cn } from '@/lib/utils';

/**
 * Recently-viewed widget shown on the home page. Reads from the
 * persisted store; renders a stable fallback while SSR.
 */
export function RecentViews({ label }: { label: string }) {
  const hydrated = useHydrated();
  const items = useAtlasStore((s) => s.recentlyViewed);

  if (!hydrated || items.length === 0) return null;

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>{label}</span>
      </div>
      <ul className="space-y-2">
        {items.slice(0, 6).map((item) => (
          <li key={`${item.kind}:${item.slug}`}>
            <a
              href={item.href}
              className={cn(
                'flex items-center justify-between gap-2 rounded-md border border-transparent px-2 py-1.5 text-sm',
                'hover:border-border hover:bg-accent',
              )}
            >
              <span className="truncate">{item.title}</span>
              <Badge variant="outline" className="shrink-0 text-[10px]">
                {item.kind}
              </Badge>
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}