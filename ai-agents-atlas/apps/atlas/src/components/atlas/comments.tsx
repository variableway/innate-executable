'use client';

import * as React from 'react';
import { MessageCircle } from 'lucide-react';

/**
 * Giscus — GitHub-Discussions-driven comments. Lazy-loads the
 * script only after the page hydrates so SSR stays cheap. No DB,
 * no third-party tracking; the entire discussion lives on GitHub.
 *
 * Configure the four env variables in `.env` before enabling.
 */
export function Comments({
  repo,
  repoId,
  category,
  categoryId,
}: {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'specific');
    script.setAttribute('data-term', window.location.pathname);
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'en');
    ref.current.appendChild(script);
  }, [repo, repoId, category, categoryId]);

  return (
    <section className="mt-12 space-y-3">
      <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
        <MessageCircle className="h-5 w-5 text-muted-foreground" />
        Discussion
      </h2>
      <p className="text-sm text-muted-foreground">
        Powered by{' '}
        <a className="underline-offset-4 hover:underline" href="https://giscus.app">
          Giscus
        </a>{' '}
        — comments live in GitHub Discussions alongside this repo.
      </p>
      <div ref={ref} />
    </section>
  );
}