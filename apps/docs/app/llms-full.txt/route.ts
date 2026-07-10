import { promises as fs } from 'node:fs';
import path from 'node:path';

import { mdxToText } from './mdx-to-text';

import { source } from '@/lib/source';

/**
 * /llms-full.txt — the full docs corpus in one plain-markdown stream, the way
 * shadcn/ui and Vercel AI Elements ship it. Where /llms.txt is the index
 * (links only), this route concatenates the CONTENT of every public docs page
 * (components, blocks, artifacts, tokens, get-started, platform, corpus) so
 * an agent can ingest the whole documentation in a single fetch.
 *
 * Pages are enumerated with the same Fumadocs source loader the app renders
 * with (lib/source.ts) — no hand-maintained list — and the raw MDX is read
 * from content/ at build time (force-static), stripped of MDX/JSX machinery
 * by mdxToText. Deterministic: pages are sorted by URL.
 */
export const revalidate = false;
export const dynamic = 'force-static';

const ORIGIN = 'https://www.gremorie.com';

export async function GET() {
  // Default language (en) pages only; /pt mirrors the same content.
  const pages = [...source.getPages()].sort((a, b) =>
    a.url.localeCompare(b.url),
  );

  const sections: string[] = [
    '# Gremorie — full documentation',
    '',
    '> The AI-native design system for React and Angular. This file contains the full content of every docs page. For the lightweight index, see https://www.gremorie.com/llms.txt.',
    '',
  ];

  for (const page of pages) {
    const filePath =
      page.absolutePath ?? path.join(process.cwd(), 'content', page.path);
    let raw: string;
    try {
      raw = await fs.readFile(filePath, 'utf-8');
    } catch {
      // Pages without a readable MDX source (should not happen) are skipped
      // rather than failing the whole stream.
      continue;
    }

    const title = page.data.title ?? page.url;
    const body = mdxToText(raw);

    sections.push('---');
    sections.push('');
    sections.push(`# ${title}`);
    sections.push('');
    sections.push(`URL: ${ORIGIN}${page.url}`);
    if (page.data.description) {
      sections.push('');
      sections.push(`> ${page.data.description}`);
    }
    sections.push('');
    if (body) {
      sections.push(body);
      sections.push('');
    }
  }

  return new Response(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
