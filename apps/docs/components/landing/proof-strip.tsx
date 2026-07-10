/**
 * Proof strip - a single subdued line of numbers right below the hero
 * (Vercel-style), replacing the old stats band section. Each claim appears
 * exactly once on the page; this strip is the scale + license moment.
 *
 * Numbers are the current repo truth (registry build): update them when the
 * registry grows. Semantics: a list, one metric per item, with decorative
 * middots between items.
 */
const stats = [
  { value: '83', label: 'primitives' },
  { value: '8', label: 'categories' },
  { value: '5', label: 'production blocks' },
  { value: '2', label: 'frameworks' },
  { value: '192', label: 'registry items' },
  { value: 'MIT', label: 'licensed' },
];

export function ProofStrip() {
  return (
    <section className="border-y border-border/60 bg-muted/20">
      <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1.5 px-6 py-4 text-muted-foreground text-sm">
        {stats.map((stat, index) => (
          <li key={stat.label} className="flex items-center gap-x-3">
            {index > 0 && (
              <span aria-hidden="true" className="text-border">
                ·
              </span>
            )}
            <span className="whitespace-nowrap">
              <span className="font-medium text-foreground">{stat.value}</span>{' '}
              {stat.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
