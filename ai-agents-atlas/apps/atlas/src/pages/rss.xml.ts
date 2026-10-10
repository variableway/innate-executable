import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

// The RSS feed tracks the English source content (/en tree).
export async function GET(context: APIContext) {
  const lessons = (await getCollection('lessons', ({ data }) => !data.draft))
    .filter((l) => l.id.startsWith('en/'));
  const agents = (await getCollection('agents'))
    .filter((a) => a.id.startsWith('en/'));

  return rss({
    title: 'AI Agents Atlas',
    description:
      'Continuously published lessons and runnable agents for the multi-agent era.',
    site: context.site ?? 'https://atlas.example.com',
    items: [
      ...lessons.map((lesson) => ({
        title: lesson.data.title,
        pubDate: lesson.data.publishedAt,
        description: lesson.data.description,
        link: `/en/lessons/${lesson.id.replace(/^en\//, '')}/`,
        categories: [lesson.data.framework, lesson.data.level, ...lesson.data.tags],
      })),
      ...agents.map((agent) => ({
        title: `[Agent] ${agent.data.title}`,
        pubDate: agent.data.publishedAt,
        description: agent.data.description,
        link: `/en/agents/${agent.id.replace(/^en\//, '')}/`,
        categories: [agent.data.framework, agent.data.industry, ...agent.data.tags],
      })),
    ],
    customData: `<language>en-us</language>`,
  });
}