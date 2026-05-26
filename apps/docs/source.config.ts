import { defineDocs, defineConfig } from "fumadocs-mdx/config";

// Chunk 1 placeholder: default schema only.
// Chunk 2 will extend the schema with `category`, `component`,
// `importPath`, and `status` fields per spec §5.4.
export const docs = defineDocs({
  dir: "content"
});

export default defineConfig();
