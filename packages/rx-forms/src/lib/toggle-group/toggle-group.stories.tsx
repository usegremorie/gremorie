import type { Meta, StoryObj } from '@storybook/react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from 'lucide-react';

import { ToggleGroup, ToggleGroupItem } from './toggle-group';

/**
 * # ToggleGroup
 *
 * Coordinated set of Toggles, a faithful shadcn/Radix port. Use `type="single"`
 * for radio-like behavior (one pressed at a time) or `type="multiple"` for
 * checkbox-like (any number pressed). `variant`, `size` and `spacing` propagate
 * from the Root to children via context. Use it for formatting/state
 * (alignment, view mode, filter chips).
 *
 * ## Anatomy
 *
 * - **ToggleGroup** — the `Root`; owns `type`, `variant`, `size`, `spacing` and
 *   shares them via context.
 * - **ToggleGroupItem** — one toggle button; inherits styling from the Root.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `type` | `"single" \| "multiple"` | — | Selection model (one vs many). |
 * | `variant` | `"default" \| "outline"` | `"default"` | Shared visual style. |
 * | `size` | `"default" \| "sm" \| "lg"` | `"default"` | Shared size. |
 * | `spacing` | `number` | `0` | Gap between items; `0` fuses borders. |
 * | `value` / `defaultValue` | `string \| string[]` | — | Selected item(s). |
 * | `onValueChange` | `(value) => void` | — | Change handler. |
 * | `disabled` | `boolean` | `false` | Disable the group. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `ToggleGroupItem` | One toggle (`value` required); inherits variant/size. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--accent` / `--accent-foreground` | pressed item |
 * | `--muted` / `--muted-foreground` | hover |
 * | `--input` | `outline` borders |
 * | `--ring` | focus ring |
 */
const meta = {
  title: 'Inputs/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { type: 'single' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['default', 'outline'] },
    size: { control: 'inline-radio', options: ['default', 'sm', 'lg'] },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Multiple selection — a text-formatting cluster. */
export const Multiple: Story = {
  render: () => (
    <ToggleGroup type="multiple" variant="outline">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/** Single selection — text alignment (only one active). */
export const Single: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="left">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/** Outline variant. */
export const Outline: Story = {
  render: () => (
    <ToggleGroup type="single" variant="outline" defaultValue="center">
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

/** Sizes (`sm`, `default`, `lg`). */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col items-start gap-3">
      {(['sm', 'default', 'lg'] as const).map((size) => (
        <ToggleGroup
          key={size}
          type="single"
          variant="outline"
          size={size}
          defaultValue="b"
        >
          <ToggleGroupItem value="a" aria-label="Bold">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="b" aria-label="Italic">
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem value="c" aria-label="Underline">
            <Underline />
          </ToggleGroupItem>
        </ToggleGroup>
      ))}
    </div>
  ),
};

/** Spaced items (`spacing={2}`) instead of fused borders. */
export const Spaced: Story = {
  render: () => (
    <ToggleGroup type="multiple" variant="outline" spacing={2}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
