'use client';

import * as React from 'react';
import { useAtlasStore, useHydrated } from '@/lib/store';
import { cn } from '@/lib/utils';

/**
 * Roadmap progress islands — read `completedLessons` from the persisted
 * store and render the learner's progress on the /roadmap page.
 * SSR renders the "nothing done" state; hydration fills in reality.
 */

export function RoadmapProgress({
  slugs,
  label,
}: {
  /** Clean lesson slugs, in roadmap order. */
  slugs: string[];
  /** Label template with `{done}` and `{total}` placeholders. */
  label: string;
}) {
  const hydrated = useHydrated();
  const completed = useAtlasStore((s) => s.completedLessons);
  const done = hydrated ? slugs.filter((s) => completed.includes(s)).length : 0;
  const total = slugs.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {label.replace('{done}', String(done)).replace('{total}', String(total))}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 w-full bg-secondary"
      >
        <div
          className="h-full bg-primary transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function RoadmapStepDot({ slug }: { slug: string }) {
  const hydrated = useHydrated();
  const completed = useAtlasStore((s) => s.completedLessons);
  const isDone = hydrated && completed.includes(slug);

  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid h-5 w-5 place-items-center rounded-full border bg-background',
        isDone ? 'border-primary' : 'border-border',
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full transition-colors',
          isDone ? 'bg-primary' : 'bg-muted-foreground/40',
        )}
      />
    </span>
  );
}
