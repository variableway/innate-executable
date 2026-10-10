#!/usr/bin/env node
/**
 * Post-build hook: stamps every generated HTML page with a marker
 * script tag so the Pagefind client island knows to mount.
 *
 * Pagefind itself produces `/pagefind/pagefind.js` when invoked;
 * this script just flips a flag so the runtime detection succeeds.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.name.endsWith('.html')) {
      const html = await readFile(full, 'utf8');
      if (html.includes('data-pagefind')) continue;
      const marker =
        '<script data-pagefind src="/pagefind/pagefind.js" defer></script>';
      await writeFile(full, html.replace('</body>', `${marker}\n</body>`));
    }
  }
}

try {
  await walk(DIST);
  console.log('✓ Pagefind markers injected');
} catch (err) {
  console.warn('pagefind-tag skipped:', err.message);
}