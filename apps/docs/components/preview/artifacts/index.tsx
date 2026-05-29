import { Calculator } from "./calculator";
import { ChartBar } from "./chart-bar";
import { CodeBlockArtifact } from "./code-block";
import { DataTable } from "./data-table";
import { FormSchema } from "./form-schema";
import { MarkdownDoc } from "./markdown-doc";

const artifacts = {
  "chart-bar": ChartBar,
  "code-block": CodeBlockArtifact,
  "markdown-doc": MarkdownDoc,
  "data-table": DataTable,
  "form-schema": FormSchema,
  calculator: Calculator,
} as const;

export type ArtifactName = keyof typeof artifacts;

/**
 * Embeds a featured artifact preview inside an MDX page. The wrapper
 * frames the artifact with a muted background and a thin border so it
 * reads as a contained demo, distinct from prose.
 */
export function ArtifactPreview({ name }: { name: ArtifactName }) {
  const Component = artifacts[name];
  return (
    <div className="not-prose my-6 overflow-hidden rounded-lg border bg-muted/20 p-6">
      <Component />
    </div>
  );
}
