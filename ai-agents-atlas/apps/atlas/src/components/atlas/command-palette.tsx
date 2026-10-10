'use client';

import * as React from 'react';
import { Search, BookOpen, Bot, Sparkles } from 'lucide-react';
import { useAtlasStore } from '@/lib/store';
import { OPEN_COMMAND_PALETTE_EVENT } from './events';
import { usePaletteNav } from './use-palette-nav';

type SearchItem =
  | { kind: 'lesson'; slug: string; title: string; subtitle: string; href: string }
  | { kind: 'agent'; slug: string; title: string; subtitle: string; href: string }
  | { kind: 'useCase'; slug: string; title: string; subtitle: string; href: string };

const kindIcon = {
  lesson: BookOpen,
  agent: Bot,
  useCase: Sparkles,
} as const;

/**
 * Simple relevance ranking replacing cmdk's fuzzy scoring: title prefix
 * beats title substring beats subtitle substring. The index is ~a dozen
 * items, so anything fancier is wasted effort.
 */
function rank(items: SearchItem[], query: string): SearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  const score = (item: SearchItem) => {
    const title = item.title.toLowerCase();
    if (title.startsWith(q)) return 0;
    if (title.includes(q)) return 1;
    if (item.subtitle.toLowerCase().includes(q)) return 2;
    return -1;
  };
  return items
    .map((item) => [score(item), item] as const)
    .filter(([s]) => s >= 0)
    .sort((a, b) => a[0] - b[0])
    .map(([, item]) => item);
}

/**
 * Site-wide command palette (⌘K). Fuses lessons, agents, and use cases
 * into a single searchable index. Hydration-safe — renders nothing
 * until mounted to avoid SSR/CSR mismatches. Dependency-free: filtering
 * and keyboard navigation are hand-rolled (see use-palette-nav).
 */
export function CommandPalette({
  items,
  placeholder = 'Search lessons, agents, use cases…',
  emptyLabel = 'No results found.',
}: {
  items: SearchItem[];
  placeholder?: string;
  emptyLabel?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const pushRecent = useAtlasStore((s) => s.pushRecentlyViewed);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const onTrigger = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener(OPEN_COMMAND_PALETTE_EVENT, onTrigger);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(OPEN_COMMAND_PALETTE_EVENT, onTrigger);
    };
  }, []);

  const handleSelect = (item: SearchItem) => {
    pushRecent({ slug: item.slug, kind: item.kind, title: item.title, href: item.href });
    setOpen(false);
    // Use full navigation so prefetch + view transitions still apply.
    window.location.assign(item.href);
  };

  const filtered = React.useMemo(() => rank(items, query), [items, query]);
  const { inputProps, listProps, optionProps } = usePaletteNav(filtered, {
    onSelect: handleSelect,
    listId: 'atlas-palette',
  });

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-label="Command palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-[hsl(var(--overlay)/0.4)] px-4 pt-[12vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-lg border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-border px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            {...inputProps}
            aria-label="Atlas search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="flex h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline">
            ESC
          </kbd>
        </div>
        <div {...listProps} className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">{emptyLabel}</p>
          ) : (
            filtered.map((item, index) => {
              const Icon = kindIcon[item.kind];
              return (
                <div
                  {...optionProps(index)}
                  key={`${item.kind}:${item.slug}`}
                  onClick={() => handleSelect(item)}
                  className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 truncate">
                    <div className="truncate">{item.title}</div>
                    <div className="truncate text-xs text-muted-foreground">{item.subtitle}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    {item.kind}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
