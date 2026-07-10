import type { Meta, StoryObj } from '@storybook/react';

import { Spinner } from './spinner';

/**
 * # Spinner
 *
 * An indeterminate "thinking" indicator — a faithful shadcn/ui port (lucide
 * `Loader2Icon` + `animate-spin`), extended with a `size` variant matching the
 * Angular companion. Use it when duration is unknown; use `Progress` when the
 * percent complete is known; use `Skeleton` to reserve layout for content
 * shape. It inherits `currentColor`, so it tints with the surrounding text.
 *
 * ## Anatomy
 *
 * ```text
 * Spinner   a single rotating Loader2 glyph (role="status", aria-label="Loading")
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `size` | `"sm" \| "default" \| "lg"` | `"default"` | 12 / 16 / 24 px glyph. |
 * | `className` | `string` | — | Extra classes (e.g. a text color). |
 *
 * (Spreads all standard `svg` attributes.)
 *
 * ## Variables (design tokens)
 *
 * None — the glyph strokes `currentColor` and follows the surrounding text.
 */
const meta = {
  title: 'Interaction/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Workbench — a single spinner driven by the size control. */
export const Workbench: Story = {
  args: { size: 'default' },
};

export const Default: Story = {
  args: { size: 'default' },
};

/** The three built-in sizes. */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Spinner size={size} />
          <span className="text-xs text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  ),
};

/**
 * Inline — Spinner sits next to text. Inherits `currentColor` so it tints
 * with the surrounding text color.
 */
export const Inline: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner size="sm" />
      <span>Loading conversations…</span>
    </div>
  ),
};
