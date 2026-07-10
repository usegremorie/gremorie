import Link from 'next/link';

import { BlockThumbnail, type BlockThumbnailName } from './block-thumbnail';

/**
 * Featured-block card for the /blocks index: a live scaled-down
 * thumbnail of the real block on top, then title + description.
 * Mirrors the Fumadocs `Card` surface (same radius, padding, tokens,
 * hover, and `@max-lg` collapse) so it slots into a `<Cards>` grid
 * next to plain cards without visual drift.
 */
export function BlockCard({
  href,
  title,
  description,
  block,
}: {
  href: string;
  title: string;
  description: string;
  block: BlockThumbnailName;
}) {
  return (
    <Link
      href={href}
      data-card
      className="not-prose block rounded-xl border bg-fd-card p-4 text-fd-card-foreground no-underline transition-colors hover:bg-fd-accent/80 @max-lg:col-span-full"
    >
      <BlockThumbnail name={block} className="mb-3" />
      <h3 className="mb-1 text-sm font-medium">{title}</h3>
      <p className="my-0 text-sm text-fd-muted-foreground">{description}</p>
    </Link>
  );
}
