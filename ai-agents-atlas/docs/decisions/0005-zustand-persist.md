---
title: "ADR-0005: Zustand + persist for learning state"
description: Why one shared localStorage store, not per-widget state.
date: 2026-08-01
status: accepted
---

## Context

We have six small pieces of persistent state:

- Favorites (lesson slugs)
- Recently viewed
- Completed lessons
- Per-lesson notes
- Compare list
- Filter (transient — not persisted)

Several reasonable ways to model this:

- One **Zustand store** with `persist` middleware.
- Per-widget **React state** + a small `localStorage` helper.
- **Signals** (e.g. `@preact/signals`) — wrong tool for cross-island state.

## Decision

**One Zustand store** with `persist` middleware. `partialize` excludes
the transient `filter` slice so URL sync remains the source of truth.

```ts
export const useAtlasStore = create<AtlasState>()(
  persist(
    (set) => ({ /* actions */ }),
    {
      name: 'ai-agents-atlas:v1',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      partialize: (state) => ({
        favorites: state.favorites,
        recentlyViewed: state.recentlyViewed,
        completedLessons: state.completedLessons,
        notes: state.notes,
        compareList: state.compareList,
      }),
    },
  ),
);
```

## Consequences

### Positive

- All islands share one hydration event. No race conditions.
- The `useHydrated()` helper makes SSR-safe rendering trivial:

  ```ts
  const hydrated = useHydrated();
  const fav = useAtlasStore((s) => s.favorites.includes(slug));
  ```

- Selective selectors mean each island only re-renders when its slice
  changes.
- The single `localStorage` key makes "reset my progress" trivial
  (one devtools call) and migration future-proof (bump `version` +
  add `migrate`).

### Negative

- A second store would be tempting to add later. Resist it. If you
  need a non-persisted UI flag, use `useState` in the island.
- Schema changes require either a version bump or a manual cleanup.

### Hydration safety

Every island that reads state must guard with `useHydrated()` —
otherwise the server renders "Save" and the client first-renders
"Saved" (or vice versa) before rehydration. The pattern is documented
in [interactive-widgets.md](../interactive-widgets.md).

### Migration story

When the schema changes:

1. Bump `version: 1` → `version: 2` in the store config.
2. Add a `migrate` function that reshapes `persistedState` into the
   new shape.
3. Older readers see a one-time loss; new readers continue.

This is identical to the Redux-Persist migration story and well
understood.