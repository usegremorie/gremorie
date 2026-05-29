/**
 * Inline swatch rows for the Chart Color Schemes section of the
 * Tokens page. Pure presentational — renders a row of coloured
 * cells driven by an array of CSS variables, with each variable
 * name shown beneath as a monospaced caption.
 *
 * Server-renderable: no client APIs used.
 */

export function ChartSwatchRow({ tokens }: { tokens: string[] }) {
  return (
    <div className="my-4 flex flex-col gap-2">
      <div className="flex h-12 w-full overflow-hidden rounded-md border border-fd-border">
        {tokens.map((token) => (
          <div
            key={token}
            className="flex-1"
            style={{ backgroundColor: `var(${token})` }}
            title={token}
            aria-label={token}
          />
        ))}
      </div>
      <div className="flex w-full gap-1 text-[10px] font-mono text-fd-muted-foreground">
        {tokens.map((token) => (
          <div key={token} className="flex-1 truncate text-center">
            {token.replace(/^--color-chart-/, "")}
          </div>
        ))}
      </div>
    </div>
  );
}
