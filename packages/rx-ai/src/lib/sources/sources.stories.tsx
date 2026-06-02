import type { Meta, StoryObj } from '@storybook/react';

import { Source, Sources, SourcesContent, SourcesTrigger } from './sources';

/**
 * Sources - citation list with collapsible trigger (React edition).
 *
 * Mirrors the ng-ai Sources stories: collapsed (default), expanded,
 * single / many sources, and an override of the trigger label.
 */
const meta = {
  title: 'AI/Sources',
  component: Sources,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Sources>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {
  render: () => (
    <Sources open={false}>
      <SourcesTrigger count={3} />
      <SourcesContent>
        <Source
          href="https://example.com/article-1"
          title="Compound components in 2024"
        />
        <Source
          href="https://example.com/article-2"
          title="React patterns deep dive"
        />
        <Source href="https://example.com/article-3" title="Slot composition" />
      </SourcesContent>
    </Sources>
  ),
};

export const Expanded: Story = {
  render: () => (
    <Sources open={true}>
      <SourcesTrigger count={3} />
      <SourcesContent>
        <Source
          href="https://example.com/article-1"
          title="Compound components in 2024"
        />
        <Source
          href="https://example.com/article-2"
          title="React patterns deep dive"
        />
        <Source href="https://example.com/article-3" title="Slot composition" />
      </SourcesContent>
    </Sources>
  ),
};

export const SingleSource: Story = {
  name: 'Single source',
  render: () => (
    <Sources open={true}>
      <SourcesTrigger count={1} />
      <SourcesContent>
        <Source
          href="https://example.com"
          title="Just one reference for this answer"
        />
      </SourcesContent>
    </Sources>
  ),
};

/**
 * Many sources - list lays out naturally; `SourcesContent` keeps
 * `flex flex-col gap-2 w-fit` so each citation sits on its own line.
 */
export const ManySources: Story = {
  name: 'Many sources',
  render: () => (
    <Sources open={true}>
      <SourcesTrigger count={6} />
      <SourcesContent>
        <Source href="https://example.com/1" title="React docs - forwardRef" />
        <Source href="https://example.com/2" title="Radix Primitives - Slot" />
        <Source href="https://example.com/3" title="shadcn registry overview" />
        <Source href="https://example.com/4" title="Angular signals" />
        <Source href="https://example.com/5" title="AI SDK - UIMessage" />
        <Source href="https://example.com/6" title="Spartan-ng - Brain" />
      </SourcesContent>
    </Sources>
  ),
};

/**
 * Custom trigger - project content into `SourcesTrigger` to fully replace
 * the default "Used N sources" label.
 */
export const CustomTrigger: Story = {
  name: 'Custom trigger',
  parameters: { controls: { disable: true } },
  render: () => (
    <Sources open={true}>
      <SourcesTrigger count={2}>
        <p className="font-medium">References (2)</p>
      </SourcesTrigger>
      <SourcesContent>
        <Source href="https://example.com/a" title="Reference A" />
        <Source href="https://example.com/b" title="Reference B" />
      </SourcesContent>
    </Sources>
  ),
};
