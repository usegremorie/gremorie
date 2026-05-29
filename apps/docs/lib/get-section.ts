/**
 * Maps a meta path (relative to the content directory) to a section key
 * used to look up the section's accent color CSS variable.
 *
 * Pattern from fumadocs.dev/apps/docs/lib/source/navigation.ts — keeps the
 * tabs.transform() callback decoupled from the directory layout.
 */
export function getSection(path: string | undefined): string {
  if (!path) return "get-started";
  const [dir] = path.split("/", 1);
  return (
    (
      {
        "get-started": "get-started",
        corpus: "corpus",
        tokens: "tokens",
        components: "components",
        blocks: "blocks",
        artifacts: "artifacts",
        platform: "platform"
      } as const
    )[dir ?? ""] ?? "get-started"
  );
}
