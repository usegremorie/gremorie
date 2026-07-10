import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Source } from './source';
import { Sources } from './sources';
import { SourcesContent } from './sources-content';
import { SourcesTrigger } from './sources-trigger';

/**
 * Sources — citation list with collapsible trigger. Stories cover
 * collapsed (default), expanded, and the override of the trigger label.
 */
const meta: Meta<Sources> = {
  title: 'AI/Chatbot/Sources',
  component: Sources,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Sources, SourcesTrigger, SourcesContent, Source],
    }),
  ],
};

export default meta;
type Story = StoryObj<Sources>;

/**
 * Workbench — fixed-width preview frame matching the catalog convention.
 * Same dataset as the React Workbench story (expanded, three sources).
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <div style="width: 420px;">
        <sources [open]="true">
          <sources-trigger [count]="3" />
          <sources-content>
            <source href="https://example.com/article-1" title="Compound components in 2024" />
            <source href="https://example.com/article-2" title="React patterns deep dive" />
            <source href="https://example.com/article-3" title="Slot composition" />
          </sources-content>
        </sources>
      </div>
    `,
  }),
};

export const Collapsed: Story = {
  render: () => ({
    template: `
      <sources [open]="false">
        <sources-trigger [count]="3" />
        <sources-content>
          <source href="https://example.com/article-1" title="Compound components in 2024" />
          <source href="https://example.com/article-2" title="React patterns deep dive" />
          <source href="https://example.com/article-3" title="Slot composition" />
        </sources-content>
      </sources>
    `,
  }),
};

export const Expanded: Story = {
  render: () => ({
    template: `
      <sources [open]="true">
        <sources-trigger [count]="3" />
        <sources-content>
          <source href="https://example.com/article-1" title="Compound components in 2024" />
          <source href="https://example.com/article-2" title="React patterns deep dive" />
          <source href="https://example.com/article-3" title="Slot composition" />
        </sources-content>
      </sources>
    `,
  }),
};

export const SingleSource: Story = {
  name: 'Single source',
  render: () => ({
    template: `
      <sources [open]="true">
        <sources-trigger [count]="1" />
        <sources-content>
          <source href="https://example.com" title="Just one reference for this answer" />
        </sources-content>
      </sources>
    `,
  }),
};

/**
 * Many sources — list scrolls naturally; `<sources-content>` keeps
 * `flex flex-col gap-2 w-fit` so each citation lays out on its own line.
 */
export const ManySources: Story = {
  name: 'Many sources',
  render: () => ({
    template: `
      <sources [open]="true">
        <sources-trigger [count]="6" />
        <sources-content>
          <source href="https://example.com/1" title="React docs · forwardRef" />
          <source href="https://example.com/2" title="Radix Primitives · Slot" />
          <source href="https://example.com/3" title="shadcn registry overview" />
          <source href="https://example.com/4" title="Angular signals" />
          <source href="https://example.com/5" title="AI SDK · UIMessage" />
          <source href="https://example.com/6" title="Spartan-ng · Brain" />
        </sources-content>
      </sources>
    `,
  }),
};

/**
 * Custom trigger — project content into `<sources-trigger>` to fully
 * replace the default "Used N sources" label.
 */
export const CustomTrigger: Story = {
  name: 'Custom trigger',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <sources [open]="true">
        <sources-trigger [count]="2">
          <p class="font-medium">References (2)</p>
        </sources-trigger>
        <sources-content>
          <source href="https://example.com/a" title="Reference A" />
          <source href="https://example.com/b" title="Reference B" />
        </sources-content>
      </sources>
    `,
  }),
};
