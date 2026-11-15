import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';

// Chunk 1 placeholder: default schema only.
// Chunk 2 will extend the schema with `category`, `component`,
// `importPath`, and `status` fields per spec §5.4.
export const docs = defineDocs({
  dir: 'content',
});

export default defineConfig({
  // Exposes `page.data.lastModified`: the date of the last git commit that
  // touched each MDX file, used as the sitemap's <lastmod>. Needs the full
  // history, so Vercel builds set VERCEL_DEEP_CLONE=true (a shallow clone
  // would date every file to the latest commit).
  plugins: [lastModified()],
});
