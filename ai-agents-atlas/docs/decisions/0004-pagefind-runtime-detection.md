---
title: "ADR-0004: Runtime Pagefind detection"
description: Why we mount Pagefind lazily and only when the index is present.
date: 2026-08-01
status: accepted
---

## Context

Pagefind indexes the built site at *post-build* time
(`pnpm dlx pagefind --site dist`). In dev, the index doesn't exist;
in CI, it does. We need the search UX to degrade gracefully.

Three approaches were considered:

1. **Always import Pagefind** at build time → build fails because the
   module doesn't exist on disk until *after* the build.
2. **Use a build-time flag** (`import.meta.env.PUBLIC_HAS_PAGEFIND`)
   → requires two builds or a CI-only env var.
3. **Detect at runtime** via a marker script tag → degrade gracefully.

## Decision

**Option 3.** The `pagefind-tag.mjs` post-build script stamps every
generated HTML page with:

```html
<script data-pagefind src="/pagefind/pagefind.js" defer></script>
```

The `PagefindSearch` island checks for that marker before mounting:

```ts
const exists = document.querySelector('script[data-pagefind]') != null;
setEnabled(exists);
```

The `vite.build.rollupOptions.external` regex keeps Rollup from
trying to bundle `/pagefind/pagefind.js` (which doesn't exist on disk
during the Astro build).

## Consequences

### Positive

- Single command (`pnpm build`) produces a working site. Pagefind is
  optional.
- `pnpm preview:build` adds the index without changing the build
  pipeline.
- TypeScript stays happy via the ambient declaration in
  `src/types/pagefind.d.ts`.

### Negative

- Two scripts (the post-build stamp + the CLI) can drift. The CI
  workflow runs them in order; locally a developer must remember to
  re-run `pnpm build` after `pagefind` regenerates the index if they
  want fresh content.
- The "two builds" feel is real: in dev, the search bar still opens
  but shows an empty state.

### Alternatives considered

- **Server-render the marker only on production**: would require an
  environment variable. Rejected because it forces a branching in
  the layout that's easy to forget.
- **Use Astro's `import.meta.env.PROD`**: doesn't help — the marker
  is needed whenever the Pagefind index exists, regardless of build
  mode.