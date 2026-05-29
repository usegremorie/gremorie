import { Award, ServerCog, Sparkles } from "lucide-react";
import { Separator } from "@gremorie/rx-display";

const numbers = [
  { value: "85", label: "primitives" },
  { value: "8", label: "categories" },
  { value: "25+", label: "corpus articles" },
];

/**
 * Each quality gets its own accent token (Odo final audit). Previously
 * all 3 used brand-subtle, so the row read as monochrome even though
 * the 3 items are semantically distinct. Now: AI is brand (the flagship
 * tone), MCP server is chart-2 (technical / infra), MIT licensed is
 * chart-4 (warm / human / community).
 */
const qualities = [
  {
    icon: Sparkles,
    label: "AI-native",
    description: "Knowledge layer",
    accent: "var(--brand)",
    accentSubtle: "var(--brand-subtle)",
  },
  {
    icon: ServerCog,
    label: "MCP server",
    description: "Tool included",
    accent: "var(--chart-2)",
    accentSubtle: "color-mix(in oklch, var(--chart-2) 14%, transparent)",
  },
  {
    icon: Award,
    label: "MIT licensed",
    description: "Open source",
    accent: "var(--chart-4)",
    accentSubtle: "color-mix(in oklch, var(--chart-4) 14%, transparent)",
  },
];

/**
 * Stats band - REWORKED per Odo audit.
 *
 * Original problem: 5 stats in one row mixed numbers (85, 8, 25+) with
 * qualities (MCP, MIT), so the row had no consistent grammar. The eye
 * had to context-switch between "what is this number" and "what is this
 * label" on every cell.
 *
 * Fix: split into TWO sub-bands.
 *  - Band A (Numbers): large dt + small dd, semantic <dl>. Pure metrics.
 *  - Band B (Qualities): icon + label + description, 3 columns, identical
 *    grammar (each is a property of the system, not a count).
 *
 * Visual hierarchy:
 *  - Numbers are the loudest (4xl/5xl), they communicate scale
 *  - Qualities are quieter but more numerous (icon + 2 lines of text)
 *  - A short separator between them gives the band breathing room without
 *    feeling like two unrelated sections
 *
 * Dogfood: top + bottom rules use rx-display Separator. Numbers still
 * native dt/dd because we have no Stat primitive yet (could be a future
 * registry item).
 *
 * Accessibility:
 * - dt holds the prominent number, dd holds the label (axe-clean per
 *   Bug 2 fix carried over)
 * - Qualities band uses a <ul> of descriptive items (not a definition
 *   list) because each has an icon + 2 strings, which maps to list
 *   semantics, not term/description semantics
 */
export function StatsBand() {
  return (
    <section className="bg-muted/30">
      <Separator />
      <div className="mx-auto max-w-7xl px-6 py-14">
        {/* Band A - Numbers */}
        <dl className="grid grid-cols-3 gap-y-8">
          {numbers.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {stat.value}
              </dt>
              <dd className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>

        {/* Mid-band divider - shorter than full width so it reads as
            "split into two parts" not "two sections" */}
        <div className="my-10 flex items-center justify-center">
          <div className="h-px w-24 bg-border" aria-hidden="true" />
        </div>

        {/* Band B - Qualities (icon + 2 lines) */}
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {qualities.map((q) => (
            <li
              key={q.label}
              className="flex items-center gap-3 justify-self-center text-left"
            >
              <span
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md"
                style={{
                  background: q.accentSubtle,
                  color: q.accent,
                }}
              >
                <q.icon className="size-4" aria-hidden="true" />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {q.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {q.description}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Separator />
    </section>
  );
}
