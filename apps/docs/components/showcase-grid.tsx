'use client';

// The showcase cards and their columns live with the workbench showcase
// (apps/showcase) so the site and the Storybook render the very same files
// in the very same places.
import { showcaseColumns } from '../../showcase/rx/columns';
import { Masonry } from '../../showcase/rx/masonry';

import { Assistant } from '@/components/preview/blocks/assistant';

/**
 * The showcase canvas: the workbench columns, one card wide (a phone screen)
 * or two. From md up the columns sit side by side and the canvas scrolls
 * sideways; on phones they collapse into one column.
 */
export function ShowcaseGrid() {
  return (
    <div
      className="relative -mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10"
      data-slot="showcase-grid"
    >
      <Masonry
        className="md:mx-auto"
        columns={showcaseColumns(
          <Assistant key="assistant" initialView="empty" />,
        )}
      />
    </div>
  );
}
