'use client';

import * as React from 'react';
import { Card } from '@atlas/ui/components/ui/card';
import { Badge } from '@atlas/ui/components/ui/badge';
import { useAtlasStore, useHydrated } from '@/lib/store';
import { FavoriteButton } from './favorite-button';
import { FilterBar, type FilterBarLabels } from './filter-bar';
import { frameworkMeta } from '@/lib/frameworks';

export type LessonListItem = {
  slug: string;
  title: string;
  description: string;
  framework: keyof typeof frameworkMeta;
  level: 'beginner' | 'intermediate' | 'advanced';
  publishedAt: string;
  duration?: number;
};

export type LessonsListLabels = FilterBarLabels & {
  empty: string;
  done: string;
  minUnit: string;
};

/** Per-framework group header text for the category view. */
export type FrameworkGroupMeta = {
  name: string;
  description: string;
};

/**
 * Client island that renders the lessons list and applies the
 * persistent filter. The page still serves a server-rendered list
 * below for crawlers and no-JS readers. `basePath` is the
 * locale-aware prefix for lesson links (`/lessons` or `/en/lessons`).
 * With `grouped`, lessons render under per-framework headers — the
 * category dimension alongside the /roadmap sequential view.
 */
export function LessonsList({
  items,
  labels,
  basePath,
  grouped = false,
  groups,
}: {
  items: LessonListItem[];
  labels: LessonsListLabels;
  basePath: string;
  grouped?: boolean;
  /** Framework slug → display meta, required when `grouped`. */
  groups?: Record<string, FrameworkGroupMeta>;
}) {
  const hydrated = useHydrated();
  const filter = useAtlasStore((s) => s.filter);
  const done = useAtlasStore((s) => s.completedLessons);

  const filtered = React.useMemo(() => {
    if (!hydrated) return items;
    return items.filter((l) => {
      if (filter.framework !== 'all' && l.framework !== filter.framework) return false;
      if (filter.level !== 'all' && l.level !== filter.level) return false;
      if (filter.query) {
        const q = filter.query.toLowerCase();
        if (!`${l.title} ${l.description}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [items, filter, hydrated]);

  const renderCard = (lesson: LessonListItem) => {
    const isDone = hydrated && done.includes(lesson.slug);
    return (
      <Card
        key={lesson.slug}
        className="group relative flex items-start justify-between gap-4 p-4 transition-colors hover:border-primary/40"
      >
        <a href={`${basePath}/${lesson.slug}`} className="flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline">{frameworkMeta[lesson.framework].name}</Badge>
            <Badge variant="secondary">{lesson.level}</Badge>
            {isDone && <Badge variant="default">{labels.done}</Badge>}
          </div>
          <h3 className="mt-2 text-lg font-semibold tracking-tight">{lesson.title}</h3>
          <p className="text-sm text-muted-foreground">{lesson.description}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            {lesson.publishedAt}
            {lesson.duration ? ` · ${lesson.duration} ${labels.minUnit}` : ''}
          </p>
        </a>
        <FavoriteButton slug={lesson.slug} />
      </Card>
    );
  };

  const groupedSections = React.useMemo(() => {
    if (!grouped) return null;
    const order = Object.keys(frameworkMeta) as Array<keyof typeof frameworkMeta>;
    return order
      .map((fw) => ({ fw, lessons: filtered.filter((l) => l.framework === fw) }))
      .filter((g) => g.lessons.length > 0);
  }, [filtered, grouped]);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_280px]">
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            {labels.empty}
          </p>
        ) : groupedSections ? (
          groupedSections.map(({ fw, lessons }) => (
            <section key={fw} className="space-y-3">
              <header className="border-b border-border pb-2 pt-4">
                <h2 className="text-xl font-semibold tracking-tight">
                  {groups?.[fw]?.name ?? frameworkMeta[fw].name}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {lessons.length}
                  </span>
                </h2>
                {groups?.[fw]?.description && (
                  <p className="text-sm text-muted-foreground">{groups[fw].description}</p>
                )}
              </header>
              {lessons.map(renderCard)}
            </section>
          ))
        ) : (
          filtered.map(renderCard)
        )}
      </div>
      <aside className="md:sticky md:top-20 md:self-start">
        <FilterBar labels={labels} />
      </aside>
    </div>
  );
}
