'use client';

import * as React from 'react';
import { Filter } from 'lucide-react';
import { useAtlasStore, useHydrated } from '@/lib/store';
import { Button } from '@atlas/ui/components/ui/button';
import { Input } from '@atlas/ui/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@atlas/ui/components/ui/toggle-group';
import { frameworkMeta } from '@/lib/frameworks';

const FRAMEWORKS = [
  { value: 'all' },
  { value: 'crewai' },
  { value: 'langgraph' },
  { value: 'autogen' },
  { value: 'agno' },
  { value: 'llamaindex' },
  { value: 'cross' },
] as const;

const LEVELS = [
  { value: 'all', key: 'all' },
  { value: 'beginner', key: 'beginner' },
  { value: 'intermediate', key: 'intermediate' },
  { value: 'advanced', key: 'advanced' },
] as const;

export type FilterBarLabels = {
  title: string;
  search: string;
  framework: string;
  level: string;
  all: string;
  reset: string;
};

/**
 * Lesson-list filter bar. Two-way URL sync: filter state writes to
 * the query string, query string changes hydrate back into the
 * Zustand store. Always renders a stable fallback during SSR.
 * Display strings arrive via `labels` so the bar follows the page locale.
 */
export function FilterBar({ labels }: { labels: FilterBarLabels }) {
  const hydrated = useHydrated();
  const filter = useAtlasStore((s) => s.filter);
  const setFilter = useAtlasStore((s) => s.setFilter);

  // Push filter to URL
  React.useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams(window.location.search);
    if (filter.framework !== 'all') params.set('framework', filter.framework);
    else params.delete('framework');
    if (filter.level !== 'all') params.set('level', filter.level);
    else params.delete('level');
    if (filter.query) params.set('q', filter.query);
    else params.delete('q');
    const next = params.toString();
    const url = next ? `${window.location.pathname}?${next}` : window.location.pathname;
    window.history.replaceState({}, '', url);
  }, [filter, hydrated]);

  // Hydrate from URL once
  React.useEffect(() => {
    if (!hydrated) return;
    const params = new URLSearchParams(window.location.search);
    const frameworkRaw = params.get('framework') ?? 'all';
    const levelRaw = params.get('level') ?? 'all';
    const query = params.get('q') ?? '';
    const framework =
      frameworkRaw === 'all' ||
      frameworkRaw === 'crewai' ||
      frameworkRaw === 'langgraph' ||
      frameworkRaw === 'autogen' ||
      frameworkRaw === 'agno' ||
      frameworkRaw === 'llamaindex' ||
      frameworkRaw === 'cross'
        ? frameworkRaw
        : 'all';
    const level =
      levelRaw === 'all' ||
      levelRaw === 'beginner' ||
      levelRaw === 'intermediate' ||
      levelRaw === 'advanced'
        ? levelRaw
        : 'all';
    setFilter({ framework, level, query });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Filter className="h-3.5 w-3.5" />
        <span>{labels.title}</span>
      </div>
      <Input
        type="search"
        placeholder={labels.search}
        value={filter.query}
        onChange={(e) => setFilter({ query: e.target.value })}
      />
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">{labels.framework}</p>
        <ToggleGroup
          type="single"
          value={filter.framework}
          onValueChange={(v) => {
            if (v) setFilter({ framework: v });
          }}
          className="flex flex-wrap"
        >
          {FRAMEWORKS.map((f) => (
            <ToggleGroupItem key={f.value} value={f.value} size="sm">
              {f.value === 'all' ? labels.all : frameworkMeta[f.value].name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">{labels.level}</p>
        <ToggleGroup
          type="single"
          value={filter.level}
          onValueChange={(v) => {
            if (!v) return;
            if (v === 'all' || v === 'beginner' || v === 'intermediate' || v === 'advanced') {
              setFilter({ level: v });
            }
          }}
          className="flex flex-wrap"
        >
          {LEVELS.map((l) => (
            <ToggleGroupItem key={l.value} value={l.value} size="sm">
              {l.key === 'all' ? labels.all : l.key}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setFilter({ framework: 'all', level: 'all', query: '' })}
        disabled={!hydrated}
      >
        {labels.reset}
      </Button>
    </div>
  );
}