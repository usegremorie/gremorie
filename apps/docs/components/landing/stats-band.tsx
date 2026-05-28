const stats = [
  { value: "85", label: "primitives" },
  { value: "8", label: "categories" },
  { value: "25+", label: "corpus articles" },
  { value: "MCP", label: "server included" },
  { value: "MIT", label: "open source" }
];

export function StatsBand() {
  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-6">
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
    </section>
  );
}
