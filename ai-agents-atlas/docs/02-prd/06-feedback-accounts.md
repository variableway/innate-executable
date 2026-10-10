# PRD M6 — Feedback and optional accounts

## Problem

Maintainers need evidence about useful and confusing content, while readers
should not pay the complexity or privacy cost of an account before one is
necessary. Existing Giscus, thumbs, and Plausible adapters provide a good
low-infrastructure starting point.

## Users and jobs

- A reader wants to report whether a page helped.
- A reader may want discussion without creating a new site-specific account.
- A maintainer wants aggregate behavior, not invasive tracking.
- A returning user may later want progress across devices.

## Requirements

### Feedback

- Keep per-page helpful/not-helpful feedback with duplicate-click protection.
- Allow an optional short reason after negative feedback.
- Giscus remains optional and loads only near the comments section.
- Missing feedback services result in a graceful local-only behavior.

### Analytics

- Use privacy-friendly aggregate analytics.
- Track a small documented event vocabulary: search, course start, lesson
  complete, quiz submit, project start/complete, source click, and feedback.
- Do not send note bodies, quiz free text, diagram content, or source code.
- Publish a privacy statement listing local and remote data.

### Accounts — deferred

- Public reading remains anonymous.
- When enabled, authentication links a remote learner profile to local state.
- First sign-in asks whether to merge, replace remote, or keep local data when
  both sides contain progress.
- Sync uses revision/timestamp conflict rules and never silently erases notes.
- TanStack Query owns remote request caching; Zustand remains the UI/local
  state boundary.

## Acceptance criteria

- Analytics and comments can be disabled entirely through configuration.
- No PII or note content appears in analytics payload tests.
- A feedback network failure does not lose the local acknowledgement or block
  navigation.
- The privacy page accurately describes localStorage keys and external tools.
- Account UI cannot appear until the backend and migration behavior exist.

## Out of scope for public v1

- Mandatory account registration.
- Public learner profiles, leaderboards, direct messages, and certificates.
- Marketing automation based on individual reading behavior.

## Metrics

- Helpful ratio and negative-feedback reasons.
- Comment engagement.
- Course funnel events.
- Future sync success/conflict rate.
