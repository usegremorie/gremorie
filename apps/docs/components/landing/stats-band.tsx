import { Separator } from "@gremorie/rx-display";

const stats = [
  { value: "85", label: "primitives" },
  { value: "8", label: "categories" },
  { value: "25+", label: "corpus articles" },
  { value: "MCP", label: "server included" },
  { value: "MIT", label: "open source" },
];

/**
 * Dogfood: top + bottom rules use rx-display Separator instead of CSS borders.
 * Numbers stay native text - no equivalent "Stat" primitive yet, and the
 * layout (5 inline metrics) doesn't map to Card cleanly here.
 */
export function StatsBand() {
  return (
    <section className="bg-muted/30 py-12">
      <Separator />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <dl className="grid grid-cols-2 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {stat.value}
              </dd>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>
      </div>
      <Separator />
    </section>
  );
}
