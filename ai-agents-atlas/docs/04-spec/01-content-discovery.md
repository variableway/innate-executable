# Spec M1 — Content and discovery

Related PRD: [`../02-prd/01-content-discovery.md`](../02-prd/01-content-discovery.md)

## 1. Content contracts

### Course collection

Store course records as YAML under `src/content/courses/<slug>.yaml`.

```ts
type Course = {
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  frameworks: FrameworkSlug[];
  tags: string[];
  objectives: string[];
  prerequisites: string[]; // course slugs
  modules: Array<{
    id: string;
    title: string;
    description?: string;
    lessons: string[]; // lesson slugs, ordered
    project?: string; // project slug
  }>;
  draft: boolean;
  publishedAt: Date;
  updatedAt?: Date;
};
```

Constraints:

- Module IDs are unique within a course.
- A lesson appears once within a course.
- Every lesson, prerequisite course, and project reference exists and is public
  whenever the course is public.
- An empty public course or module is invalid.

### Lesson additions

Extend the existing lesson schema with:

```ts
type LessonAdditions = {
  primaryCourse?: string;
  related: string[];
  prerequisites: string[]; // change from free text to lesson slugs
  agents: string[];
  projects: string[];
  quiz?: string;
  canonicalPath?: string;
};
```

Human-readable prerequisite descriptions belong in the MDX body, not in the
reference field.

## 2. Frontend specification

### Routes

| Route | Rendering | Purpose |
|---|---|---|
| `/courses` | Static | Course catalog |
| `/courses/[slug]` | Static | Modules, lesson list, progress island |
| `/lessons` | Static shell + filter island | Lesson catalog |
| `/lessons/[slug]` | Static + learning islands | Lesson detail |
| `/frameworks/[slug]` | Static | Framework landing and related items |
| `/tags/[slug]` | Static | Cross-type tag index |
| `/search` | Static shell + Pagefind island | Full search |

Existing `/frameworks` may remain as an index, but detail discovery must not
depend only on fragment IDs.

### Components

```text
src/components/atlas/content/
├── breadcrumb.astro
├── course-card.astro
├── course-outline.tsx        progress-aware island
├── lesson-card.astro
├── lesson-navigation.astro
├── related-content.astro
├── taxonomy-filter.tsx
└── search-results.tsx
```

`CourseOutline` receives a serialized view model rather than raw Astro content
entries. Static links are rendered in its server fallback where practical.

### URL filter contract

Supported parameters:

```text
?q=memory&type=lesson&framework=langgraph&level=intermediate&tag=state
```

- Unknown values are ignored.
- Empty/default parameters are removed.
- Multi-value behavior uses repeated parameters, for example
  `framework=crewai&framework=langgraph`.
- Browser back/forward restores the UI.

## 3. Build-time backend specification

Create content utilities under `src/lib/content/`:

- `collections.ts`: typed read helpers and public/draft filtering.
- `course-graph.ts`: resolve course/module membership and previous/next.
- `relations.ts`: cross-collection validation.
- `related.ts`: explicit relationships followed by tag fallback.
- `taxonomy.ts`: normalized tag/framework/industry indexes.

Create `scripts/validate-content.mjs` or TypeScript equivalent. It emits
machine-readable and human-readable failures. It must not mutate content.

### Previous/next algorithm

1. Read the lesson's `primaryCourse`.
2. Flatten that course's modules in declared order.
3. Locate the lesson exactly once.
4. Return adjacent public lessons.
5. If no primary course exists, omit previous/next rather than guessing.

### Search

- Pagefind indexes rendered public routes after build.
- Add `data-pagefind-meta` values for type, framework, level, and tags.
- Exclude admin, redirect, error, and draft pages.
- `pnpm build` prepares markers; `pnpm search:index` creates the index.

## 4. Runtime backend

None for public v1. Search is static and content is in the build artifact.

## 5. Test specification

- Unit: course flattening, duplicate detection, previous/next, taxonomy.
- Content fixtures: broken lesson/project/course references fail with paths.
- Browser: course → lesson → next lesson; filter URL restoration.
- No-JS: course and lesson links remain present.
- SEO: canonical and JSON-LD snapshots for one course and one lesson.
