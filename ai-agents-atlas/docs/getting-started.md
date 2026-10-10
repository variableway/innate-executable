---
title: Getting started
description: Install, develop, and ship your first change to the Atlas.
---

## Prerequisites

- **Node 20+** (Node 22 recommended). The CI workflows assume Node 20.
- **pnpm 9+**. If you don't have it: `corepack enable && corepack prepare pnpm@latest --activate`.
- A POSIX shell (macOS, Linux, or WSL).

## Install

```bash
pnpm install
```

The first install resolves the dependency graph under `pnpm-workspace.yaml`,
which pins two transitively-pulled packages. Don't edit the workspace
overrides without reading [decisions/0005-zustand-persist.md](./decisions/0005-zustand-persist.md)
and [troubleshooting.md](./troubleshooting.md).

## Develop

```bash
pnpm dev          # http://localhost:4321
```

The dev server supports Astro's view-transitions, MDX hot reload, and
React Fast Refresh for the islands.

## Type-check

```bash
pnpm exec astro check
```

Treat warnings as errors in new code; existing warnings are tracked in
the issue tracker.

## Build

```bash
pnpm build
```

Outputs `./dist/` — a fully static site. The `postbuild` hook stamps
each HTML page with a Pagefind marker so the runtime search island
knows to mount.

```bash
pnpm preview:build   # build + run Pagefind + drop the index in dist/
```

## Your first change

1. Run `pnpm dev`.
2. Open `src/content/lessons/<one>.mdx`, edit the description.
3. The dev server reloads automatically.
4. `pnpm exec astro check` should still pass — frontmatter is type-checked.

To author a *new* lesson:

```bash
pnpm new:lesson "My title goes here"
```

This scaffolds `src/content/lessons/<slug>.mdx` with valid frontmatter
(see [frontmatter-schema.md](./frontmatter-schema.md)). Open the file
and start writing.

## What to read next

- [architecture.md](./architecture.md) for the high-level map
- [authoring.md](./authoring.md) for content conventions
- [publishing.md](./publishing.md) when you're ready to ship