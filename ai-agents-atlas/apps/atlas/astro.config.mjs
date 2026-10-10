// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://atlas.example.com',
  output: 'static',
  // Bilingual site: Chinese is the default (unprefixed URLs), English
  // lives under /en. Pages under src/pages/en/ are the English tree.
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    mdx(),
    sitemap(),
  ],
  // Tailwind v4 uses its native Vite plugin — no PostCSS pipeline, no
  // @astrojs/tailwind integration. All theme tokens, plugins, and
  // keyframes are configured in src/styles/globals.css.
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['cmdk', '@atlas/ui'],
    },
    build: {
      rollupOptions: {
        // `/pagefind/pagefind.js` is generated post-build by the
        // `pagefind` CLI. Mark it external so Vite doesn't try to
        // resolve it during bundling.
        external: [/^\/pagefind\//],
      },
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark-dimmed',
      wrap: true,
    },
  },
});