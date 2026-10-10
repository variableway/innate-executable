---
title: Interactive widgets
description: How the React islands work and how to add a new one.
---

The Atlas is mostly static HTML. Where interactivity is needed, it's
implemented as a **React island** — a component mounted by Astro's
client directives. Islands share one persistent store
(`useAtlasStore`).

## The store

```ts
import { useAtlasStore, useHydrated } from '@/lib/store';
```

State slices:

| Slice              | Type                                    |
|--------------------|-----------------------------------------|
| `favorites`        | `string[]`                              |
| `recentlyViewed`   | `RecentItem[]` (max 20)                 |
| `completedLessons` | `string[]`                              |
| `notes`            | `Record<string, { id; body; updatedAt }>`|
| `compareList`      | `string[]` (max 3)                      |
| `filter`           | `{ framework; level; query }` (transient)|

Actions:

- `toggleFavorite(slug)`
- `markLessonDone(slug, done?)`
- `pushRecentlyViewed({ slug, kind, title, href })`
- `setNote(kind, slug, body)` — empty body deletes the entry
- `toggleCompare(slug)` / `clearCompare()`
- `setFilter(patch)`

## Hydration safety

Every island that reads persistent state must guard against SSR
mismatches. The pattern:

```tsx
'use client';
import { useAtlasStore, useHydrated } from '@/lib/store';

export function MyWidget({ slug }: { slug: string }) {
  const hydrated = useHydrated();
  const fav = useAtlasStore((s) => s.favorites.includes(slug));

  return (
    <button disabled={!hydrated} aria-pressed={fav}>
      {fav ? 'Saved' : 'Save'}
    </button>
  );
}
```

`useHydrated` returns `false` on the server and during the first
client render. Once Zustand rehydrates from `localStorage`, it flips
to `true` and the widget renders with the persisted value.

## Existing islands

| Component                             | Mount strategy  | Purpose |
|---------------------------------------|-----------------|---------|
| `ThemeProvider` / `HeaderThemeToggle` | `client:load`   | Theme toggle |
| `CommandPalette` / `Trigger`          | `client:idle`   | ⌘K header search |
| `PagefindSearch`                      | `client:idle`   | Full-text search (when index exists) |
| `LessonsList`                         | `client:load`   | Filterable lessons index |
| `FilterBar`                           | inside above    | URL-synced framework/level filter |
| `FavoriteButton`                      | inside cards    | Heart toggle |
| `LessonActions`                       | `client:load`   | Mark complete + favorite on lesson pages |
| `NotesEditor`                         | `client:load`   | Per-lesson local-only notes |
| `RecentViews`                         | `client:idle`   | Sidebar widget on home |
| `CopyCodeEnhancer`                    | `client:idle`   | Injects copy buttons into `<pre>` blocks |
| `FeedbackWidget`                      | `client:idle`   | Thumbs in the footer |
| `Comments`                            | `client:visible`| Giscus on lesson pages |

## Adding a new island

1. Create `src/components/atlas/<name>.tsx` with `'use client'`.
2. Use `useAtlasStore` for state. Don't introduce a second store.
3. Render a stable fallback for SSR.
4. Mount it from an Astro file with the lightest client directive
   that works — prefer `client:visible` over `client:load`.
5. If the island listens for keyboard or window events, clean up the
   listener in a `useEffect` return.

## Sharing events across islands

Some widgets communicate via `CustomEvent` rather than props. The
command palette, for example, opens in response to a button click
somewhere in the server-rendered tree. Both sides import the event
name from `src/components/atlas/events.ts`:

```ts
export const OPEN_COMMAND_PALETTE_EVENT = 'atlas:open-command-palette';
```

This is intentional: the trigger button is server-rendered, the
palette is a client island, and Astro doesn't have a "ref" mechanism
between the two.