import type { Meta, StoryObj } from '@storybook/react';

import { Separator } from './separator';

/**
 * # Separator
 *
 * A visual divider between groups of content, wrapping
 * `@radix-ui/react-separator`. The `decorative` flag controls whether it is
 * exposed to assistive tech (`role="separator"`) or hidden as presentational.
 * The default `decorative={true}` is right in the vast majority of cases.
 *
 * ## Anatomy
 *
 * ```text
 * Separator   single token-driven 1px line (bg-border); fills width when horizontal, height when vertical
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `orientation` | `"horizontal" \| "vertical"` | `"horizontal"` | Line direction. |
 * | `decorative` | `boolean` | `true` | `false` exposes it semantically to AT. |
 * | `className` | `string` | — | Extra classes (e.g. height for vertical use). |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--border` | the divider fill color |
 */
const meta = {
  title: 'Layout & display/Display/Separator',
  component: Separator,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    decorative: { control: 'boolean' },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Horizontal divider splitting a heading from its description. */
export const Default: Story = {
  render: () => (
    <div className="w-72">
      <div className="space-y-1">
        <h4 className="text-sm font-medium">Gremorie UI</h4>
        <p className="text-muted-foreground text-sm">
          A token-driven React component library.
        </p>
      </div>
      <Separator className="my-4" />
      <p className="text-muted-foreground text-sm">
        Open source. MIT licensed.
      </p>
    </div>
  ),
};

/** Vertical separators between inline items (needs an explicit height). */
export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center gap-4 text-sm">
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Components</span>
      <Separator orientation="vertical" />
      <span>Tokens</span>
    </div>
  ),
};
