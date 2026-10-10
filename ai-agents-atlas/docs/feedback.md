---
title: Feedback & governance
description: How the Atlas collects reader signal and how decisions get recorded.
---

Feedback flows are deliberately thin. The Atlas keeps no database and
runs no auth — every feedback channel is a thin wrapper over something
else.

## Channels

### Giscus comments

Lesson pages can show a thread hosted on **GitHub Discussions**.
Configure once via <https://giscus.app>:

1. Pick the repo (must be public).
2. Pick the Discussions category (e.g. `General`).
3. Copy the four IDs into Cloudflare Pages env (`PUBLIC_GISCUS_*`).
4. Redeploy — the `Comments` island will mount automatically.

Giscus is preferred over Disqus because:

- It is identity-bound to GitHub accounts. No new account to create.
- Spam moderation is the same as repo issues.
- Threads are searchable from GitHub itself.

### Thumbs feedback

The footer of every page has 👍 / 👎 buttons. The vote is stored in
`localStorage` (so reloads don't lose it) and optionally POSTed to a
Worker endpoint. Without an endpoint configured, the widget is a local
no-op — votes still get remembered for the reader.

To enable the Worker side:

```ts
// In a Cloudflare Pages Function (or any Worker):
export default {
  async fetch(req: Request, env: Env) {
    if (req.method !== 'POST') return new Response('method not allowed', { status: 405 });
    const body = await req.json<{ vote: 'up'|'down'; path: string; ts: number }>();
    await env.FEEDBACK_KV.put(`${body.path}:${body.ts}`, JSON.stringify(body));
    return new Response('ok');
  },
};
```

Bind a KV namespace named `FEEDBACK_KV` and set
`PUBLIC_FEEDBACK_ENDPOINT` to the function URL.

### Plausible analytics

Cookieless, GDPR-friendly, single self-hosted script tag.
Set `PUBLIC_PLAUSIBLE_DOMAIN=atlas.example.com` and Plausible
auto-binds. No events fire until that env var is set.

## Editorial governance

- Every PR must link an issue or describe motivation.
- The PR template (`.github/pull_request_template.md`) enforces the
  minimum surface area.
- `CONTRIBUTING.md` is the canonical authoring guide; new style rules
  go there before anywhere else.
- Schema changes require an ADR. See `docs/decisions/`.

## Security disclosures

Open a GitHub issue or email the maintainers. The Atlas ships no
user-input endpoints in static mode — only the optional feedback Worker
above, which is opt-in.