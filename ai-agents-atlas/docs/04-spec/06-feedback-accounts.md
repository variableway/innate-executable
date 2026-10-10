# Spec M6 — Feedback and optional accounts

Related PRD: [`../02-prd/06-feedback-accounts.md`](../02-prd/06-feedback-accounts.md)

## 1. Analytics event contract

All analytics calls pass through `src/lib/analytics/events.ts`.

```ts
type AtlasEvent =
  | { name: 'search'; props: { queryLength: number; resultCount: number } }
  | { name: 'course_start'; props: { course: string } }
  | { name: 'lesson_complete'; props: { lesson: string; course?: string } }
  | { name: 'quiz_submit'; props: { quiz: string; percent: number; attempt: number } }
  | { name: 'project_start' | 'project_complete'; props: { project: string } }
  | { name: 'source_click'; props: { agent: string; target: 'repo' | 'file' } }
  | { name: 'feedback'; props: { path: string; vote: 'up' | 'down' } };
```

Rules:

- Do not send search text, notes, free-form answers, diagram data, IP-derived
  application IDs, or user email.
- Event calls are no-ops when analytics is not configured.
- Analytics failures never surface as blocking UI errors.

## 2. Feedback frontend

- `FeedbackWidget` stores one current vote per canonical path locally.
- A user may change a vote; the API receives an idempotency token stored in the
  browser.
- Negative feedback may open an optional reason list plus a maximum 500-character
  comment. Free text is sent only after explicit submit.
- The widget renders `client:idle` and has a stable noninteractive fallback.
- Giscus renders `client:visible` and is absent when configuration is incomplete.

## 3. Optional feedback API

Cloudflare Worker/Pages Function:

```http
POST /api/feedback
Content-Type: application/json

{
  "path": "/lessons/tool-calling",
  "vote": "down",
  "reason": "outdated",
  "comment": "The SDK example uses an old method.",
  "eventId": "random-client-generated-id",
  "ts": 1785722400000
}
```

Response:

```json
{ "accepted": true }
```

Backend rules:

- Validate body ≤ 2 KB and supported path/vote/reason.
- Sanitize control characters; store text as data, never render as HTML.
- Enforce idempotency on `eventId`.
- Apply rate limiting or Turnstile only if abuse appears; do not fingerprint
  readers preemptively.
- D1 is preferred over one-key-per-vote KV when aggregate reporting and
  idempotency are required. Local-only feedback remains valid before this API.

## 4. Privacy page

Publish `/privacy` with:

- localStorage keys and purposes;
- optional Giscus/Plausible/feedback services;
- data retention and deletion contact;
- statement that lesson notes remain local unless future sync is enabled;
- configuration-dependent sections generated from enabled integrations.

## 5. Future account frontend

Account functionality is feature-flagged and absent in public v1.

When implemented:

- One route-level provider owns auth state and TanStack Query.
- Static public pages remain server-rendered and cacheable.
- An account menu and sync status are islands, not a whole-site SPA shell.
- First sign-in presents local/remote merge choices when necessary.

## 6. Future account API

Minimum logical endpoints:

```text
GET  /api/me
GET  /api/learning-state
PUT  /api/learning-state
POST /api/learning-state/merge-preview
DELETE /api/learning-state
```

Remote state envelope:

```ts
type RemoteLearningState = {
  schemaVersion: number;
  revision: number;
  updatedAt: string;
  state: LearningStateV2;
};
```

- Updates use expected `revision`; conflict returns HTTP 409 with remote state.
- Completion sets merge by union.
- Quiz attempts merge by stable attempt identity/timestamp.
- Notes with divergent bodies never overwrite automatically; return a conflict
  for user choice.
- Deleted items require tombstones if bidirectional sync is supported.

## 7. Test specification

- Analytics payload type and PII-denylist tests.
- Feedback widget local-only and network-failure tests.
- API schema, size, idempotency, and rate-policy tests when enabled.
- Giscus absent/present configuration snapshots.
- Future sync: revision conflicts, note conflicts, offline retry, logout with
  retained local state.
