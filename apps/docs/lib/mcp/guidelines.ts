/**
 * MCP helpers: reads the UX corpus MDX from content/corpus/.
 * The MCP `get_guidelines` tool returns these so an LLM can apply the rules
 * when generating code with the Gremorie registry.
 *
 * No MDX parsing — we return the raw MDX so the consumer can render or
 * extract whatever it needs. Frontmatter remains as the first block.
 *
 * As of Phase 1 of the proposta v4 information architecture, the corpus
 * lives at the top level (content/corpus/) rather than nested under
 * foundations/. The MCP serves only the corpus — the rest of the docs
 * (platform/internal/*, get-started/*, etc.) are author-facing and aren't
 * meant to be injected into LLM context.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const CORPUS_DIR = path.join(process.cwd(), "content", "corpus");

export interface GuidelineDoc {
  /** Filename without extension (also the URL slug under /corpus/). */
  slug: string;
  /** Path relative to content/ for traceability. */
  path: string;
  /** Title extracted from frontmatter (best-effort). */
  title: string;
  /** Description extracted from frontmatter (best-effort). */
  description: string;
  /** Raw MDX content. */
  content: string;
}

/**
 * Tiny frontmatter reader. Extracts the first --- ... --- block and pulls
 * `title:` and `description:` lines. Good enough for the MCP tool — full
 * YAML parsing is overkill here.
 */
function readFrontmatter(raw: string): { title: string; description: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match || !match[1]) return { title: "", description: "" };
  const block = match[1];
  const titleMatch = /^title:\s*(.+)$/m.exec(block);
  const descMatch = /^description:\s*(.+)$/m.exec(block);
  const title = titleMatch?.[1]?.trim() ?? "";
  const description = descMatch?.[1]?.trim() ?? "";
  return {
    title: stripQuotes(title),
    description: stripQuotes(description),
  };
}

function stripQuotes(s: string): string {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1);
  }
  return s;
}

/**
 * Walk content/corpus/ recursively and return every MDX file.
 * Sub-folders (heuristics/, components/, patterns/, etc.) are flattened
 * with slash slugs.
 */
async function walkMdx(dir: string, relBase = ""): Promise<GuidelineDoc[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const docs: GuidelineDoc[] = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const rel = relBase ? `${relBase}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      docs.push(...(await walkMdx(fullPath, rel)));
      continue;
    }
    if (!entry.name.endsWith(".mdx")) continue;
    const raw = await fs.readFile(fullPath, "utf-8");
    const { title, description } = readFrontmatter(raw);
    const slug = rel.replace(/\.mdx$/, "");
    docs.push({
      slug,
      path: `content/corpus/${rel}`,
      title,
      description,
      content: raw,
    });
  }
  return docs;
}

/** List every guideline doc with title + slug + description (no body). */
export async function listGuidelines(): Promise<
  Array<Omit<GuidelineDoc, "content">>
> {
  const docs = await walkMdx(CORPUS_DIR);
  return docs.map(({ content: _, ...meta }) => meta);
}

/**
 * Get one or more guidelines. If `topic` is provided, returns docs whose
 * slug, title, or description matches (case-insensitive substring). When no
 * topic is given, returns the index (all docs, headers only).
 */
export async function getGuidelines(topic?: string): Promise<GuidelineDoc[]> {
  const docs = await walkMdx(CORPUS_DIR);
  if (!topic) return docs;
  const q = topic.toLowerCase().trim();
  // Direct slug match first (most precise).
  const exact = docs.find((d) => d.slug.toLowerCase() === q);
  if (exact) return [exact];
  // Substring across slug + title + description.
  return docs.filter((d) => {
    const haystack = `${d.slug} ${d.title} ${d.description}`.toLowerCase();
    return haystack.includes(q);
  });
}
