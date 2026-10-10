---
title: "ADR-0002: Use camelCase for the useCases directory"
description: Why the directory is named useCases/, not use-cases/.
date: 2026-08-01
status: accepted
---

## Context

Astro's legacy `defineCollection({ type: 'content' })` derives the
**collection name** from the directory name in `src/content/`. The
schema export uses that name as the lookup key for `getCollection()`.

We needed a directory for external-project references. The natural
name was `use-cases/` (kebab-case, like `use-cases/`). The export key
in `src/content/config.ts` was `useCases` (camelCase, matching the
variable names throughout the codebase).

## Decision

The directory is **`useCases/`**. The export key is `useCases`. Both
match.

## Consequences

### Positive

- `getCollection('useCases')` works without any extra configuration.
- The generated content types (`src/.astro/astro/content.d.ts`) match
  the schema exactly — no `as` casts needed at call sites.
- The schema field naming (`sourceHeading`, `resourceType`) stays
  camelCase and consistent with the rest of the Atlas.

### Negative

- The directory name reads oddly to non-React developers used to
  kebab-case folders.
- Anyone copying an example that uses `use-cases/` will hit the build
  error "The collection 'useCases' does not exist or is empty" — and
  the fix isn't obvious.

### Alternatives considered

- **Rename the export key** to `'use-cases'`. Rejected: would require
  `as` casts in TypeScript everywhere we use the collection, and
  shadcn-style component names are camelCase, so the codebase would
  read inconsistently.
- **Switch to `defineCollection({ loader })`** (the Astro 5 way).
  Rejected for now: we're pinned to Astro 4.16 for other reasons
  (see [0003-sitemap-3-2-1.md](./0003-sitemap-3-2-1.md)). When we move
  to Astro 5 we can revisit and probably keep the directory kebab-case.

### See also

- [troubleshooting.md](../troubleshooting.md) — the exact error
  message and how to recognize it.