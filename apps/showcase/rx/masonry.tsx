import { Fragment, type ReactNode } from 'react';

/**
 * One row of a showcase column:
 *   a card          fills the column
 *   { pair }        two cards side by side, half the column each
 *   { split }       two sub-columns that stack their own rows; only in a
 *                   double column (e.g. a menu pair over a form on the left,
 *                   two device cards on the right)
 */
export type ShowcaseRow =
  | ReactNode
  | { pair: readonly [ReactNode, ReactNode] }
  | { split: readonly [readonly ShowcaseRow[], readonly ShowcaseRow[]] };

export interface ShowcaseColumn {
  key: string;
  /** 1 = one card wide (375px), 2 = two cards wide plus the gap. */
  span?: 1 | 2;
  rows: readonly ShowcaseRow[];
}

const isPair = (
  row: ShowcaseRow,
): row is { pair: readonly [ReactNode, ReactNode] } =>
  typeof row === 'object' && row !== null && 'pair' in row;

const isSplit = (
  row: ShowcaseRow,
): row is {
  split: readonly [readonly ShowcaseRow[], readonly ShowcaseRow[]];
} => typeof row === 'object' && row !== null && 'split' in row;

function Rows({ rows }: { rows: readonly ShowcaseRow[] }) {
  return rows.map((row, i) => {
    if (isPair(row)) {
      return (
        <div key={i} className="grid grid-cols-2 items-start gap-4">
          {row.pair[0]}
          {row.pair[1]}
        </div>
      );
    }
    if (isSplit(row)) {
      return (
        <div
          key={i}
          className="flex flex-col gap-6 md:grid md:grid-cols-2 md:items-start md:gap-10"
        >
          <div className="flex flex-col gap-6 md:gap-10">
            <Rows rows={row.split[0]} />
          </div>
          <div className="flex flex-col gap-6 md:gap-10">
            <Rows rows={row.split[1]} />
          </div>
        </div>
      );
    }
    return <Fragment key={i}>{row}</Fragment>;
  });
}

/**
 * The showcase grid: columns one card wide (375px, a phone screen) or two
 * cards wide, 40px apart; each column stacks its own rows, so every card
 * keeps its place. From md up the columns sit side by side (the page scrolls
 * sideways when they do not fit, as a design canvas does); on phones they
 * collapse into one column, pairs stay side by side.
 */
export function Masonry({
  columns,
  className,
}: {
  columns: readonly ShowcaseColumn[];
  className?: string;
}) {
  return (
    <div
      data-slot="showcase-masonry"
      className={[
        // 375px: the width of the phone screen each card is designed for.
        '[--showcase-column:375px] flex flex-col gap-6 md:w-max md:flex-row md:items-start md:gap-10',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {columns.map((column) => (
        <div
          key={column.key}
          data-span={column.span ?? 1}
          data-slot="showcase-column"
          className="flex w-full flex-col gap-6 md:w-(--showcase-column) md:shrink-0 md:gap-10 md:data-[span=2]:w-[calc(var(--showcase-column)*2+var(--spacing)*10)]"
        >
          <Rows rows={column.rows} />
        </div>
      ))}
    </div>
  );
}
