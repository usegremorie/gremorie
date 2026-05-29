import type { Meta, StoryObj } from '@storybook/angular';

import { Badge } from './badge';

/**
 * Badge — compact label for status, counts and tags.
 *
 * 6 variants mirror React `Badge`. Use stories to validate each variant
 * renders with the right surface treatment. Compound usage is shown in
 * the Tool / Task / ChainOfThought stories where Badge is dogfooded.
 */
const meta: Meta<Badge> = {
  title: 'Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'],
    },
  },
};

export default meta;
type Story = StoryObj<Badge>;

export const Default: Story = {
  args: { variant: 'default' },
  render: (args) => ({
    props: args,
    template: `<gn-badge [variant]="variant">Default</gn-badge>`,
  }),
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
  render: (args) => ({
    props: args,
    template: `<gn-badge [variant]="variant">Secondary</gn-badge>`,
  }),
};

export const Destructive: Story = {
  args: { variant: 'destructive' },
  render: (args) => ({
    props: args,
    template: `<gn-badge [variant]="variant">Destructive</gn-badge>`,
  }),
};

export const Outline: Story = {
  args: { variant: 'outline' },
  render: (args) => ({
    props: args,
    template: `<gn-badge [variant]="variant">Outline</gn-badge>`,
  }),
};

export const Ghost: Story = {
  args: { variant: 'ghost' },
  render: (args) => ({
    props: args,
    template: `<gn-badge [variant]="variant">Ghost</gn-badge>`,
  }),
};

export const LinkVariant: Story = {
  name: 'Link',
  args: { variant: 'link' },
  render: (args) => ({
    props: args,
    template: `<gn-badge [variant]="variant">Link</gn-badge>`,
  }),
};

/**
 * Showcase — all 6 variants side-by-side. Use this story to spot regressions
 * in spacing, border treatment, or hover affordances when the cva spec
 * changes.
 */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <gn-badge variant="default">Default</gn-badge>
        <gn-badge variant="secondary">Secondary</gn-badge>
        <gn-badge variant="destructive">Destructive</gn-badge>
        <gn-badge variant="outline">Outline</gn-badge>
        <gn-badge variant="ghost">Ghost</gn-badge>
        <gn-badge variant="link">Link</gn-badge>
      </div>
    `,
  }),
};

/**
 * With icon — badges accept a leading SVG. CVA targets `[&>svg]:size-3`.
 */
export const WithIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <gn-badge variant="default">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5"/>
          </svg>
          Verified
        </gn-badge>
        <gn-badge variant="destructive">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Error
        </gn-badge>
      </div>
    `,
  }),
};
