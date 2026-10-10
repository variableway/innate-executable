import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import { defaultLocale, type Locale } from './ui';

/**
 * Locale-aware collection access. Content files live at
 * `src/content/<collection>/<locale>/<slug>.md(x)`, so an entry id is
 * `<locale>/<slug>`. When the requested locale has no version of a
 * slug we fall back (target locale → en → zh) so a language never
 * renders an empty section while translations are being written.
 */

export interface LocalizedEntry<C extends CollectionKey> {
  entry: CollectionEntry<C>;
  /** Entry id without the locale prefix, e.g. `decisions/0001-...`. */
  slug: string;
  /** The locale the returned entry is actually written in. */
  contentLocale: Locale;
}

function parseId(id: string): { loc: Locale; slug: string } | null {
  const [loc, ...rest] = id.split('/');
  if ((loc !== 'zh' && loc !== 'en') || rest.length === 0) return null;
  return { loc, slug: rest.join('/') };
}

export async function getLocalizedEntries<C extends CollectionKey>(
  collection: C,
  locale: Locale,
  filter?: (entry: CollectionEntry<C>) => boolean,
): Promise<LocalizedEntry<C>[]> {
  const all = (await getCollection(collection, filter as never)) as CollectionEntry<C>[];

  const priority = (loc: Locale) => (loc === locale ? 0 : loc === 'en' ? 1 : 2);
  const best = new Map<string, { candidate: LocalizedEntry<C>; score: number }>();

  for (const entry of all) {
    const parsed = parseId(entry.id);
    if (!parsed) continue;
    const candidate: LocalizedEntry<C> = {
      entry,
      slug: parsed.slug,
      contentLocale: parsed.loc,
    };
    const score = priority(parsed.loc);
    const existing = best.get(parsed.slug);
    if (!existing || score < existing.score) {
      best.set(parsed.slug, { candidate, score });
    }
  }

  return [...best.values()].map((v) => v.candidate);
}

/**
 * `getStaticPaths` helper for localized dynamic routes. Generates one
 * page per slug (after fallback), with clean slugs as params.
 */
export async function localizedStaticPaths<C extends CollectionKey>(
  collection: C,
  locale: Locale,
  filter?: (entry: CollectionEntry<C>) => boolean,
) {
  const entries = await getLocalizedEntries(collection, locale, filter);
  return entries.map(({ entry, slug }) => ({
    params: { slug },
    props: { entry },
  }));
}

/** Re-exported so page shells have a single import site. */
export { defaultLocale };
