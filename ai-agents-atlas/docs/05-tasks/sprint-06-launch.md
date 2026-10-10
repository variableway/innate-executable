# Sprint 6 — Launch, feedback, and operations

## Goal

Turn the public-v1 candidate into an observable, accessible, documented, and
recoverable production release.

## Start policy

Independent tasks such as analytics contracts, SEO auditing, and privacy copy
may begin during S3/S4. The final release gate depends on S4 completion.

## Exit criteria

- Production and rollback are verified.
- SEO, accessibility, performance, link, and content-count gates pass.
- Analytics and feedback behavior match privacy documentation.
- CMS is either functional and secured or explicitly not advertised.
- A launch/incident runbook and known-risk register exist.

## Parallel launch tasks

### S6-T01 — Analytics event adapter

- **Role:** analytics frontend Agent
- **Depends on:** S3-T03/S3-T05 and S4 feature event contracts
- **Owns:** `src/lib/analytics/**`, event adapter tests, event documentation
- **Work:** typed Plausible/no-op adapter; wire only documented events through
  narrow calls; enforce payload denylist.
- **Acceptance:** disabled configuration sends nothing; tests show no query text,
  notes, free text, diagram data, or PII.

### S6-T02 — Feedback service hardening

- **Role:** feedback full-stack Agent
- **Depends on:** S0-T01
- **Owns:** feedback widget enhancements, optional `functions/api/feedback.*` or
  Worker package, feedback API tests
- **Work:** local vote idempotency, optional negative reason, validated ≤2 KB
  POST API, idempotency storage, graceful offline behavior.
- **Acceptance:** local-only mode works; duplicate event is idempotent; malformed,
  oversized, and unsupported payloads fail safely.
- **Boundary:** do not add authentication or remote learner state.

### S6-T03 — SEO and social metadata audit

- **Role:** static-platform Agent
- **Depends on:** S1-T04/S1-T05, S2-T08, S4-T03
- **Owns:** BaseLayout SEO helpers, OG defaults/generator if approved, structured
  data tests, sitemap/RSS tests
- **Work:** canonical, title/description, Open Graph, Twitter cards, course/
  lesson/project JSON-LD, draft/redirect exclusions, real site URL.
- **Acceptance:** representative route snapshots and generated sitemap/RSS pass;
  no `atlas.example.com` remains in production output.

### S6-T04 — Accessibility and performance audit

- **Role:** quality/performance Agent
- **Depends on:** S4-T09
- **Owns:** axe/Lighthouse configuration, targeted fixes outside files actively
  owned by other launch tasks, audit report
- **Work:** keyboard flows, focus, headings, labels, live regions, contrast,
  reduced motion, bundle inspection, image/font behavior, no-JS reading.
- **Acceptance:** no serious/critical axe findings in core routes; Lighthouse
  performance ≥90 target or documented approved exception; advanced bundles
  isolated if S5 exists.

### S6-T05 — Link and content-quality gate

- **Role:** content quality Agent
- **Depends on:** S1-T03, S2-T09, S4-T10
- **Owns:** link-check config, content coverage script/report, scheduled link
  workflow
- **Work:** robust internal link validation, scheduled external check with
  allowlist/retry, content counts, unfinished-marker scan, required-section
  coverage.
- **Acceptance:** internal broken links block merge; flaky external links report
  separately; public-v1 minimum counts pass from source and built routes.

### S6-T06 — CMS decision and implementation

- **Role:** authoring/infrastructure Agent
- **Depends on:** S0-T03, S1-T01, S1-T07
- **Owns:** `public/admin/**`, CMS auth proxy/config, CMS documentation/tests
- **Work:** either configure and verify Decap editorial auth against current
  schemas, or remove/hide inert admin entry and record a deferred decision.
- **Acceptance:** no visible broken admin; if enabled, a test content PR passes
  the same CI and media/alt rules.

### S6-T07 — Privacy and operations documentation

- **Role:** product operations Agent
- **Depends on:** S6-T01, S6-T02, S6-T06 decisions
- **Owns:** privacy content, release/rollback/incident runbook, environment and
  data-retention documentation
- **Work:** document localStorage, analytics, comments, feedback, deploy, smoke,
  rollback, outage behavior, and contact path.
- **Acceptance:** documentation matches enabled configuration and a maintainer
  can execute a rollback drill from it.

## Final integration gate

### S6-T08 — Production release candidate

- **Role:** release integration Agent
- **Depends on:** S6-T01 through S6-T07 and S4-T10
- **Owns:** shared nav/footer final wiring, release checklist, version/release
  notes; coordinates fixes rather than rewriting task-owned modules
- **Work:** clean install/check/test/build/index, preview smoke, environment
  verification, content counts, analytics/feedback config, release deploy and
  rollback readiness.
- **Acceptance:** all exit criteria pass; known risks have owner/severity; public
  v1 can be deployed or rolled back with recorded evidence.

## Suggested concurrency

```text
Agent A: S6-T01 → assist S6-T08
Agent B: S6-T02 → S6-T07 input
Agent C: S6-T03 → S6-T04
Agent D: S6-T05 → S6-T06
Lead:    S6-T07 → S6-T08
```
