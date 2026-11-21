import type { Meta, StoryObj } from '@storybook/react-vite';

// The React Assistant is a docs block, not a package (the Angular one ships
// in ng-ai); this dev-only showcase reaches into the docs app for it.
import { Assistant } from '../../docs/components/preview/blocks/assistant';
import { showcaseColumns } from './columns';
import { Masonry } from './masonry';

/**
 * The React showcase: a set of product cards built with Gremorie
 * components, in a fixed column order. The workbench embeds this
 * story (id `showcase--all`) next to the Angular one.
 */
const meta = {
  title: 'Showcase',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

export const All: StoryObj = {
  render: () => (
    <div className="min-h-screen bg-background p-10">
      <Masonry
        columns={showcaseColumns(
          <Assistant key="assistant" initialView="empty" />,
        )}
      />
    </div>
  ),
};
