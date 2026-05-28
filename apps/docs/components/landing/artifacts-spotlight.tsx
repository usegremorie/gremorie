import Link from "next/link";
import { ArrowRight, BarChart3, Code2 } from "lucide-react";

/**
 * Spotlights two artifact types: Chart (data viz schema -> bar chart)
 * and Code (LLM emits code -> highlighted block with runtime preview).
 *
 * Both are visual placeholders here. The real artifacts wire to the AI
 * SDK stream and the @gremorie/rx-data Chart primitive. The point of
 * the landing card is to show the schema -> render mental model.
 */
export function ArtifactsSpotlight() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Generative UI artifacts
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Render structured LLM output as production UI. Schema in,
            components out. Streaming-aware, type-safe, swappable.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Chart artifact */}
          <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <BarChart3 className="size-3.5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Chart artifact
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Monthly revenue, last 12 months
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Streaming
              </span>
            </div>

            <div className="flex flex-1 items-end gap-2 p-6">
              {/* Simple bar chart placeholder using styled divs */}
              {[40, 55, 48, 62, 70, 65, 78, 82, 75, 88, 92, 100].map(
                (h, i) => (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center gap-1.5"
                  >
                    <div
                      className="w-full rounded-t-sm bg-primary/70 transition-colors hover:bg-primary"
                      style={{ height: `${h * 1.6}px` }}
                      aria-hidden="true"
                    />
                    <span className="text-[9px] text-muted-foreground">
                      {[
                        "J",
                        "F",
                        "M",
                        "A",
                        "M",
                        "J",
                        "J",
                        "A",
                        "S",
                        "O",
                        "N",
                        "D"
                      ][i]}
                    </span>
                  </div>
                )
              )}
            </div>

            <Link
              href="/artifacts"
              className="border-t border-border/60 px-5 py-3 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span className="inline-flex items-center gap-1.5">
                Learn more about chart artifacts
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </Link>
          </article>

          {/* Code artifact */}
          <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border/60 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Code2 className="size-3.5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Code artifact
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Generated component, ts + tsx
                  </p>
                </div>
              </div>
              <span className="rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Runtime
              </span>
            </div>

            <pre className="flex-1 overflow-hidden bg-muted/30 p-5 font-mono text-xs leading-relaxed text-foreground">
              <code>
                <span className="text-muted-foreground">
                  // Generated by claude-opus-4-7
                </span>
                {"\n"}
                <span className="text-primary">export function</span>{" "}
                <span className="text-foreground">StatsCard</span>
                <span className="text-muted-foreground">{"({"}</span>
                {"\n  "}label, value, delta{"\n"}
                <span className="text-muted-foreground">{"})"}</span> {"{"}
                {"\n  "}
                <span className="text-primary">return</span> (
                {"\n    "}
                {"<Card>"}
                {"\n      "}
                {"<CardHeader>{label}</CardHeader>"}
                {"\n      "}
                {"<CardContent>"}
                {"\n        "}
                {"<span>{value}</span>"}
                {"\n        "}
                {"<Badge>{delta}</Badge>"}
                {"\n      "}
                {"</CardContent>"}
                {"\n    "}
                {"</Card>"}
                {"\n  "});
                {"\n"}
                {"}"}
              </code>
            </pre>

            <Link
              href="/artifacts"
              className="border-t border-border/60 px-5 py-3 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span className="inline-flex items-center gap-1.5">
                Learn more about code artifacts
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
