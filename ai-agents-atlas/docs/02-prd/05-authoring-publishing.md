# PRD M5 — Authoring and publishing

## Problem

Atlas already treats content as code, but it has duplicate documentation
sources, incomplete relationship checks, an inert CMS proxy configuration, and
conflicting GitHub Pages versus Cloudflare Pages deployment declarations.

## Users and jobs

- An author wants a correct template and fast preview.
- A reviewer wants content-quality failures before manual review.
- A maintainer wants one reproducible release path and rollback procedure.
- A non-technical contributor may later need a controlled CMS form.

## Requirements

### Authoring

- Provide scaffolds for lesson, course, Agent, project, quiz, and scenario.
- Keep one canonical source for every document.
- Document required fields, voice, code conventions, and media handling.
- Allow drafts and scheduled metadata without accidentally publishing drafts.

### Validation

- Validate Zod schemas, unique IDs, enum values, dates, URL formats, and
  required section completeness.
- Validate all cross-collection references.
- Validate internal links and periodically check external links.
- Reject unfinished markers such as placeholder, TODO, TBD, and lorem ipsum in
  production content unless explicitly allowlisted.
- Detect source files that would expose likely secrets.

### Preview and release

- Every content or application PR receives a preview URL.
- Production deploys only from `main` after checks pass.
- Use exactly one provider-specific deployment implementation.
- Support immediate rollback to a prior successful static artifact.
- Publish cache, redirect, security-header, and canonical-domain behavior as
  versioned configuration.

### CMS — optional

- Decap CMS may edit the same content schema through an editorial workflow.
- CMS authentication must be configured before `/admin` is advertised.
- CMS commits go through the same CI checks as manually authored content.

## Acceptance criteria

- A clean checkout can install, check, test, and build using documented
  commands.
- A broken reference fails CI with file, field, and target information.
- The deployment documentation matches the workflow implementation.
- A preview URL is produced for a representative content-only PR.
- A rollback drill is documented and tested before public v1.
- Root docs and rendered docs cannot silently drift.

## Out of scope for v1

- Real-time collaborative editing.
- A custom WYSIWYG editor.
- Publishing content outside Git-backed review.

## Metrics

- Median time from first commit to valid preview.
- Content CI failures by category.
- Failed production deployments.
- Rollback time.
- External-link health.
