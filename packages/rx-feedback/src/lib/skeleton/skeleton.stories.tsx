import type { Meta, StoryObj } from '@storybook/react';

import { Skeleton } from './skeleton';

/**
 * # Skeleton
 *
 * A pulsing placeholder block that stands in for content still being fetched.
 * Shape it with `className` width/height to match the real content's geometry —
 * that's the point: skeletons reserve layout so there's no shift when data
 * arrives. Animation is `animate-pulse`; users with `prefers-reduced-motion` see
 * the static state. Pair with `aria-busy` / `aria-live` on the surrounding region.
 *
 * ## Anatomy
 *
 * ```text
 * Skeleton   a single pulsing, rounded block sized by its className
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `className` | `string` | — | Width / height / shape (the whole API). |
 *
 * (Spreads all standard `div` attributes.)
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--accent` | Block background |
 */
const meta = {
  title: 'Interaction/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A single line. */
export const Default: Story = {
  render: () => <Skeleton className="h-4 w-[250px]" />,
};

/** Stacked text lines of varying width. */
export const Lines: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-[300px]" />
      <Skeleton className="h-4 w-[260px]" />
      <Skeleton className="h-4 w-[180px]" />
    </div>
  ),
};

/** Avatar + two-line caption — a typical list-row placeholder. */
export const Avatar: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[160px]" />
      </div>
    </div>
  ),
};

/** A card placeholder: image block plus a caption. */
export const Card: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-[160px] w-[280px] rounded-xl" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-[280px]" />
        <Skeleton className="h-4 w-[220px]" />
      </div>
    </div>
  ),
};
