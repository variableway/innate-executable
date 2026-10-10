import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { frameworks } from './lib/frameworks';

/**
 * Content Collections schema for the AI Agents Atlas learning platform.
 *
 * Each lesson is a typed Markdown / MDX file. The schema enforces
 * structure so we can confidently build indexes, RSS feeds, and
 * search indexes without runtime guards.
 *
 * Astro v6+ requires every collection to declare a `loader`. We use
 * `glob()` from `astro/loaders` to point at the on-disk source paths;
 * the legacy `type: 'content'` field is no longer accepted.
 *
 * Note: only `collections` is exported from this file. Shared, non-schema
 * constants used by client islands (e.g. `frameworkMeta`) live in
 * `src/lib/frameworks.ts` so they can be imported without dragging the
 * server-only `astro:content` virtual module into the browser bundle.
 */

const levels = ['beginner', 'intermediate', 'advanced'] as const;

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string().default('Atlas Team'),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    level: z.enum(levels),
    framework: z.enum(frameworks),
    industry: z.string().optional(),
    tags: z.array(z.string()).default([]),
    duration: z.number().int().positive().optional(),
    prerequisites: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
    cover: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    resources: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
          type: z.enum(['github', 'docs', 'video', 'paper', 'colab']),
        }),
      )
      .default([]),
    draft: z.boolean().default(false),
    objectives: z.array(z.string()).default([]),
    /** Position in the ordered learning path (see /roadmap). 0 = unplaced. */
    order: z.number().int().default(0),
  }),
});

/**
 * Runnable agents - sourced from the upstream `agents/` directories.
 * These are first-class content because each one gets its own page with
 * architecture, code, and run instructions.
 */
const agents = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/agents' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    framework: z.enum(frameworks),
    llm: z.string().default('Configurable'),
    industry: z.string().default('General'),
    difficulty: z.enum(levels),
    tags: z.array(z.string()).default([]),
    language: z.string().default('Python'),
    entrypoint: z.string().default('agent.py'),
    requirements: z.string().default('requirements.txt'),
    githubPath: z.string(),
    objectives: z.array(z.string()).default([]),
    publishedAt: z.coerce.date(),
    order: z.number().int().default(0),
  }),
});

/**
 * Use cases - external projects linked from the upstream README catalog.
 * Each one gets a redirect-style page plus source metadata.
 */
const useCases = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/useCases' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    framework: z.enum(frameworks),
    industry: z.string().default('General'),
    url: z.string().url().optional(),
    resourceType: z.enum(['Notebook', 'Code', 'Link', 'Paper']).default('Link'),
    sourceHeading: z.string(),
    tags: z.array(z.string()).default([]),
    publishedAt: z.coerce.date().optional(),
  }),
});

/**
 * Internal documentation - not part of the published curriculum.
 * Authored at `src/content/docs/`, rendered under `/docs/`.
 */
const docs = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    status: z.enum(['draft', 'accepted', 'superseded']).optional(),
    group: z.string().optional(),
  }),
});

export const collections = { lessons, agents, useCases, docs };
