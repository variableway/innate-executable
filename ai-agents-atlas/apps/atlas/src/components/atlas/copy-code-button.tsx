'use client';

import * as React from 'react';
import { toast } from 'sonner';

/**
 * Injected client-side onto every code block rendered by
 * `rehype-pretty-code`. Walks the DOM once, decorates each <pre>
 * with a copy button. Server-render no-op.
 */
export function CopyCodeEnhancer({
  labels = { aria: 'Copy code', success: 'Copied to clipboard', error: 'Failed to copy' },
}: {
  labels?: { aria: string; success: string; error: string };
}) {
  React.useEffect(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLPreElement>('pre[data-language]'));
    const cleanupFns: Array<() => void> = [];

    for (const pre of blocks) {
      if (pre.querySelector('button[data-copy-button]')) continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('data-copy-button', '');
      button.setAttribute('aria-label', labels.aria);
      button.className =
        'absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background/80 text-muted-foreground opacity-0 transition-opacity hover:bg-background hover:text-foreground group-hover:opacity-100';
      button.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';

      const handler = async () => {
        const code = pre.querySelector('code')?.innerText ?? pre.innerText;
        try {
          await navigator.clipboard.writeText(code);
          button.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
          toast.success(labels.success);
          setTimeout(() => {
            button.innerHTML =
              '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
          }, 1500);
        } catch {
          toast.error(labels.error);
        }
      };

      button.addEventListener('click', handler);
      pre.style.position = 'relative';
      pre.classList.add('group');
      pre.appendChild(button);

      cleanupFns.push(() => {
        button.removeEventListener('click', handler);
        button.remove();
      });
    }

    return () => cleanupFns.forEach((fn) => fn());
  }, [labels]);

  return null;
}