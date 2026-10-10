# PRD M1 — Content and discovery

## Problem

The current Atlas exposes individual lessons and filters but does not express a
course/module sequence. Readers can browse content, yet they cannot reliably
answer what to learn first, what comes next, or which materials belong to the
same outcome.

## Users and jobs

- A beginner wants a guided path with clear prerequisites.
- An experienced engineer wants to find a specific framework or technique.
- A search visitor wants a stable, indexable answer page.
- An author wants a new lesson to appear automatically in the correct indexes.

## Requirements

### Course information architecture

- Publish `/courses`, `/courses/<course>`, and existing `/lessons/<lesson>`
  routes as static HTML.
- A course contains ordered modules; a module contains ordered lesson slugs.
- Course pages show description, level, estimated duration, module breakdown,
  lesson status, and a start/continue action.
- Lesson pages show course/module context, prerequisites, previous/next lesson,
  and related content.
- A lesson may appear in multiple curated paths, but one `primaryCourse` owns
  previous/next behavior unless the URL carries explicit course context.

### Discovery

- Search indexes lessons, courses, Agents, projects, use cases, and docs.
- Filters support framework, level, content type, industry, and tags where
  applicable.
- Filters are reflected in the URL so a result set can be shared.
- Results have a no-JavaScript fallback for the primary content indexes.
- Framework and tag pages use real URLs, not hash-only application routes.

### Content navigation

- Every content page has a canonical URL and breadcrumb.
- Every lesson provides previous/next actions when part of a course.
- Related items are explicit first and may use tag-based fallback second.
- Draft content never appears in production indexes, RSS, or sitemap.

### SEO and distribution

- Course and lesson pages emit appropriate JSON-LD.
- Pages expose canonical, Open Graph, and social-card metadata.
- RSS includes new or substantially updated lessons.
- Sitemap contains all public canonical routes and excludes redirect-only or
  private routes as configured.

## UX flow

```text
Landing/search
  → course/framework/tag index
  → course detail or content detail
  → lesson
  → previous/next or related content
```

## Acceptance criteria

- Adding a valid lesson requires no route-code edit.
- Adding a lesson slug to a course fails CI if the lesson does not exist.
- A crawler receives useful title, description, body, canonical URL, and
  structured data without running client JavaScript.
- Search returns at least one correct result for title, tag, framework, and
  body-text test fixtures.
- Filter state can be copied as a URL and restored in a fresh browser.
- Previous/next ordering is deterministic and covered by tests.

## Out of scope for v1

- AI-generated semantic search.
- Personalized recommendations that require server-side profiles.
- Automatic prerequisite enforcement that blocks reading.

## Metrics

- Search result click-through.
- Course start rate.
- Previous/next navigation rate.
- Searches with no result.
- Organic landing pages and crawl errors.
