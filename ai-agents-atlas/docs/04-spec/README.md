# Technical specification index

## Purpose

These specifications translate the module PRDs into implementation contracts.
Each module describes three surfaces:

1. **Frontend:** Astro pages, server-rendered components, React islands, and
   browser state.
2. **Build-time backend:** content loaders, schema validation, synchronization,
   indexes, and static generation executed by Node.js/CI.
3. **Runtime backend:** optional network APIs. Public v1 uses these only for
   feedback integrations; accounts and sync are deferred.

## Module specifications

| Module | Specification |
|---|---|
| M1 Content and discovery | [`01-content-discovery.md`](01-content-discovery.md) |
| M2 Learning experience | [`02-learning-experience.md`](02-learning-experience.md) |
| M3 Agent catalog | [`03-agent-catalog.md`](03-agent-catalog.md) |
| M4 Projects and practice | [`04-projects-practice.md`](04-projects-practice.md) |
| M5 Authoring and publishing | [`05-authoring-publishing.md`](05-authoring-publishing.md) |
| M6 Feedback and accounts | [`06-feedback-accounts.md`](06-feedback-accounts.md) |

## Shared implementation rules

### Identifiers

- Content slugs are lowercase kebab-case.
- Persisted IDs are namespaced: `lesson:<slug>`, `agent:<slug>`,
  `project:<slug>`, `useCase:<slug>`.
- Quiz question and option IDs are stable within a quiz version.
- Renaming a persisted slug requires an explicit alias and state migration.

### Error behavior

- Authored-data errors fail the build with source file and field.
- Browser-storage errors show a non-blocking warning and keep reading usable.
- Optional-service errors are logged without preventing navigation.
- User input errors are rendered next to the field and announced to assistive
  technology.

### React island boundary

- Static content and navigation remain Astro components.
- Components sharing React Context or TanStack Query must live in one island.
- Use the lightest hydration directive that works: `client:visible` or
  `client:idle` before `client:load`.
- Cross-island messages use typed CustomEvents or the external Zustand store.

### Accessibility

- WCAG 2.2 AA is the target for public flows.
- Every interactive control has an accessible name and visible focus.
- Quiz feedback, timers, save state, and route updates use appropriate live
  regions without excessive announcements.
- Reduced-motion preferences disable nonessential movement.

### Performance budgets

- Lesson prose renders without client JavaScript.
- No playground/interview dependencies are imported by lesson routes.
- New client islands must declare expected hydration strategy and bundle cost.
- Core pages target Lighthouse performance ≥ 90 in the release environment.
- Images require dimensions, modern formats where practical, and meaningful alt
  text or explicit decorative treatment.

### Security

- No secrets are bundled into `PUBLIC_*` variables.
- MDX is trusted repository content; CMS changes still pass code review and CI.
- Source ingestion uses an allowlist and rejects path traversal and secret-like
  filenames.
- Runtime POST endpoints validate content type, size, origin/rate policy, and
  schema before storage.

## Quality gates

Required commands after the test scaffold exists:

```bash
pnpm check
pnpm test
pnpm test:e2e
pnpm build
pnpm search:index
pnpm content:validate
```

Content-only changes may run a smaller fast path first, but merge protection
must include the full static build and relationship validation.
