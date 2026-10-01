import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

import { describe, expect, it } from 'vitest';

/**
 * Guard over the translated navigation files.
 *
 * Fumadocs falls back to `meta.json` when a locale has no `meta.<locale>.json`,
 * so a MISSING translation is safe - the section renders with English labels.
 * A translation that EXISTS overrides the English one outright, and that is the
 * dangerous case: it silently becomes the whole nav for that locale.
 *
 * `components/meta.pt.json` drifted exactly that way. It still listed folders
 * named `ai` and `forms`, which had been split into chatbot/code/utilities and
 * form/buttons/text/selection/date. The Portuguese sidebar therefore showed two
 * dead entries and dropped eight real sections, Buttons among them - while
 * every page underneath still resolved at its URL. Nothing failed; the pages
 * were just unreachable by navigation.
 *
 * A translated meta must list the same pages as its English counterpart.
 * Separator labels (`---Inputs---`) are the part that gets translated, so they
 * are compared by position and count, never by text.
 */
const CONTENT = join(__dirname, '..', 'content');

function metaFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) metaFiles(full, out);
    else if (entry.name === 'meta.json') out.push(full);
  }
  return out;
}

interface MetaFile {
  pages?: string[];
}

const pagesOf = (file: string): string[] => {
  const meta = JSON.parse(readFileSync(file, 'utf8')) as MetaFile;
  return meta.pages ?? [];
};

const isSeparator = (page: string) => page.startsWith('---');

describe('translated navigation mirrors the English one', () => {
  const metas = metaFiles(CONTENT);

  it('finds the content tree', () => {
    expect(metas.length).toBeGreaterThan(0);
  });

  for (const meta of metas) {
    const locales = readdirSync(join(meta, '..'))
      .filter((f) => /^meta\.[a-z]{2}\.json$/.test(f))
      .map((f) => ({ file: join(meta, '..', f), name: f }));

    for (const locale of locales) {
      const label = relative(CONTENT, locale.file).split('\\').join('/');

      it(`${label}: lists the same pages as meta.json`, () => {
        const en = pagesOf(meta).filter((p) => !isSeparator(p));
        const translated = pagesOf(locale.file).filter((p) => !isSeparator(p));

        expect(translated.filter((p) => !en.includes(p))).toEqual([]);
        expect(en.filter((p) => !translated.includes(p))).toEqual([]);
      });

      it(`${label}: keeps the same section breaks`, () => {
        const enShape = pagesOf(meta).map((p) => (isSeparator(p) ? '---' : p));
        const translatedShape = pagesOf(locale.file).map((p) =>
          isSeparator(p) ? '---' : p,
        );

        expect(translatedShape).toEqual(enShape);
      });
    }
  }
});
