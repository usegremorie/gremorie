import type { ReactNode } from 'react';

/**
 * The showcase grid: fixed 375px columns, 40px apart, cards stacked 40px
 * apart inside each column. Columns are explicit (not CSS masonry) so every
 * card keeps its place, column by column.
 */
export function Masonry({ columns }: { columns: ReactNode[][] }) {
  return (
    <div className="flex min-h-screen items-start gap-10 bg-background p-10">
      {columns.map((cards, i) => (
        <div key={i} className="flex w-[375px] shrink-0 flex-col gap-10">
          {cards}
        </div>
      ))}
    </div>
  );
}
