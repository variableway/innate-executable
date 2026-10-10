'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { useAtlasStore } from '@/lib/store';
import { OPEN_COMMAND_PALETTE_EVENT } from './events';
import { usePaletteNav } from './use-palette-nav';

/**
 * Pagefind-backed search. Loaded only when a static index exists
 * (created by `pnpm dlx pagefind --site dist` in CI). Renders nothing
 * when the index is missing — degrades gracefully to the existing
 * build-time search index shipped in the command palette.
 */
type Hit = {
  url: string;
  meta: { title: string };
  excerpt: string;
};

export function PagefindSearch() {
  const [open, setOpen] = React.useState(false);
  const [enabled, setEnabled] = React.useState(false);
  const pushRecent = useAtlasStore((s) => s.pushRecentlyViewed);

  // Detect whether Pagefind index is present
  React.useEffect(() => {
    // Pagefind mounts itself at `/pagefind/pagefind.js` after build.
    const exists = document.querySelector('script[data-pagefind]') != null;
    setEnabled(exists);
  }, []);

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

  if (!enabled || !open) return null;

  return (
    <div
      role="dialog"
      aria-label="Search the atlas"
      className="fixed inset-0 z-50 flex items-start justify-center bg-[hsl(var(--overlay)/0.4)] px-4 pt-[12vh]"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-lg border border-border bg-popover shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <PagefindInner onPick={(hit) => {
          pushRecent({
            slug: hit.url.split('/').filter(Boolean).pop() ?? hit.url,
            kind: 'lesson',
            title: hit.meta.title,
            href: hit.url,
          });
          setOpen(false);
          window.location.assign(hit.url);
        }} />
      </div>
    </div>
  );
}

function PagefindInner({ onPick }: { onPick: (h: Hit) => void }) {
  const [results, setResults] = React.useState<Hit[]>([]);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    // Lazy-load Pagefind. `/pagefind/pagefind.js` is generated post-build by
    // the Pagefind CLI (`pnpm dlx pagefind --site dist`), so the path is
    // absent in dev and during `astro build`. The `rollupOptions.external`
    // regex only covers the production build, and the `/* @vite-ignore */`
    // hint below can be stripped by the TSX transform before Vite's dev
    // import-analysis runs. Holding the specifier in a variable makes the
    // import non-literal, so Vite cannot statically resolve it and leaves it
    // as a runtime fetch - the `enabled` guard above ensures this only runs
    // when the Pagefind index actually exists.
    const pagefindUrl = '/pagefind/pagefind.js';
    import(/* @vite-ignore */ pagefindUrl)
      .then((pagefind: any) => pagefind.search(query))
      .then((r: any) => setResults(r.results.slice(0, 8).map((hit: any) => ({
        url: hit.url,
        meta: hit.meta ?? { title: hit.url },
        excerpt: hit.excerpt,
      }))))
      .catch(() => setResults([]));
  }, [query]);

  const { inputProps, listProps, optionProps } = usePaletteNav(results, {
    onSelect: onPick,
    listId: 'atlas-pagefind',
  });

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-border px-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          {...inputProps}
          aria-label="Atlas search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search lessons, agents, use cases…"
          className="flex h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div {...listProps} className="max-h-[60vh] overflow-y-auto p-2">
        {query && results.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Searching Pagefind…
          </p>
        )}
        {results.map((hit, index) => (
          <div
            {...optionProps(index)}
            key={hit.url}
            onClick={() => onPick(hit)}
            className="cursor-pointer rounded-md px-2 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
          >
            <div className="truncate font-medium">{hit.meta.title}</div>
            <div
              className="truncate text-xs text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: hit.excerpt }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
