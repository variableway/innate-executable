#!/usr/bin/env node
/**
 * Scaffold a new lesson from a title.
 *
 * Usage:
 *   pnpm new:lesson "Your lesson title"
 *   pnpm new:lesson "Your lesson title" --level intermediate --framework langgraph
 *
 * Generates `src/content/lessons/en/<slug>.mdx` with a valid frontmatter
 * block so authors only have to fill in the body.
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function parseArgs(argv) {
  const args = { title: '', level: 'beginner', framework: 'cross' };
  const positional = [];
  for (let i = 2; i < argv.length; i++) {
    const cur = argv[i];
    if (cur === '--level') args.level = argv[++i];
    else if (cur === '--framework') args.framework = argv[++i];
    else positional.push(cur);
  }
  args.title = positional.join(' ').trim();
  return args;
}

function slugify(input) {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function template({ title, slug, level, framework, date }) {
  return `---
title: "${title}"
description: "One-sentence summary of what the reader learns."
author: "Your Name"
publishedAt: ${date}
level: "${level}"
framework: "${framework}"
industry: "general"
tags: []
duration: 10
# Position in the ordered learning path (/roadmap). 0 = unplaced;
# set it to append the lesson to the roadmap.
order: 0
prerequisites: []
related: []
objectives:
  - "First thing the reader can do after finishing"
  - "Second thing the reader can do after finishing"
resources: []
---

## What you'll learn

Open with the single most important takeaway. Be specific about the outcome.

## Section 1

Body content. Use \`code fences\` for snippets:

\`\`\`python title="example.py"
print("hello")
\`\`\`

## Section 2

Continue. Use callouts where useful.

## Try it

A concrete exercise the reader can complete in under 30 minutes.

## Up next

Link to the next lesson.
`;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.title) {
    console.error('Usage: pnpm new:lesson "<title>" [--level beginner|intermediate|advanced] [--framework crewai|langgraph|autogen|agno|llamaindex|cross]');
    process.exit(1);
  }

  const slug = slugify(args.title);
  const outDir = resolve(ROOT, 'src/content/lessons/en');
  const outPath = resolve(outDir, `${slug}.mdx`);

  if (existsSync(outPath)) {
    console.error(`✗ A lesson already exists at ${outPath}`);
    process.exit(1);
  }

  await mkdir(outDir, { recursive: true });
  const frontmatter = template({
    title: args.title,
    slug,
    level: args.level,
    framework: args.framework,
    date: todayISO(),
  });
  await writeFile(outPath, frontmatter, 'utf8');

  console.log(`✓ Created ${outPath}`);
  console.log(`  Run \`pnpm dev\` and open http://localhost:4321/lessons/${slug}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});