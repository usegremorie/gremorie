import type { Meta, StoryObj } from '@storybook/react';
import { BadgeCheck, Check, X } from 'lucide-react';

import { Badge } from './badge';

/**
 * # Badge
 *
 * A compact label for status, counts and tags. Renders a `<span>` (or any
 * element via `asChild`) styled by `class-variance-authority`. A faithful
 * shadcn port — KDS treats Badge as a *static* label primitive; interactive
 * selection-style chips belong to `ToggleGroup`.
 *
 * ## Anatomy
 *
 * ```text
 * Badge   rounded, bordered pill wrapping text and/or a leading size-3 icon
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `variant` | `"default" \| "secondary" \| "destructive" \| "warning" \| "success" \| "outline" \| "ghost" \| "link"` | `"default"` | Visual style. |
 * | `asChild` | `boolean` | `false` | Merge styles onto the child (e.g. render as `<a>`); enables the `[a&]:` hover affordances. |
 * | `className` | `string` | — | Extra classes merged via `cn`. |
 *
 * ## Status variants
 *
 * `destructive`, `warning` and `success` are the three status fills — error,
 * attention and ok. Each bg/foreground pair clears **WCAG AA 4.5:1** in both
 * light and dark (verified against the `--success` / `--warning` / `--destructive`
 * tokens). Reach for them to color a state chip (e.g. a budget "Ok / Attention /
 * Over" indicator) instead of hand-rolling `bg-*` classes.
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--primary` / `--primary-foreground` | `variant="default"` fill |
 * | `--secondary` / `--secondary-foreground` | `variant="secondary"` |
 * | `--destructive` | `variant="destructive"` |
 * | `--warning` / `--warning-foreground` | `variant="warning"` (amber, attention) |
 * | `--success` / `--success-foreground` | `variant="success"` (green, ok) |
 * | `--border` / `--foreground` | `variant="outline"` |
 * | `--accent` / `--accent-foreground` | `ghost` / `outline` hover (as link) |
 * | `--ring` | focus ring |
 */
const meta = {
  title: 'Layout & display/Display/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { variant: 'default', children: 'Badge' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: [
        'default',
        'secondary',
        'destructive',
        'warning',
        'success',
        'outline',
        'ghost',
        'link',
      ],
    },
    asChild: { control: 'boolean' },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Workbench — a single badge driven by the variant control. */
export const Workbench: Story = {
  args: { variant: 'default', children: 'Badge' },
};

/** Default solid badge. */
export const Default: Story = {};

/** Every CVA `variant`. */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
    </div>
  ),
};

/**
 * The three status fills — `success` (ok), `warning` (attention) and
 * `destructive` (error). This is the budget-indicator pattern (e.g. a 50/30/20
 * card): the same three states, colored by variant. Every pair meets WCAG AA
 * 4.5:1 in light and dark.
 */
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="success">
        <Check />
        Ok
      </Badge>
      <Badge variant="warning">Attention</Badge>
      <Badge variant="destructive">
        <X />
        Over
      </Badge>
    </div>
  ),
};

/** With a leading icon (auto-sized to `size-3`). */
export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>
        <BadgeCheck />
        Verified
      </Badge>
      <Badge variant="secondary">
        <Check />
        Done
      </Badge>
      <Badge variant="destructive">
        <X />
        Failed
      </Badge>
    </div>
  ),
};

/** Numeric count badges. */
export const Counts: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge>3</Badge>
      <Badge variant="secondary">12</Badge>
      <Badge variant="destructive">99+</Badge>
    </div>
  ),
};

/**
 * Rendered as a link via `asChild` — the `[a&]:` hover styles activate only in
 * this anchor form, keeping the static variants fully static.
 */
export const AsLink: Story = {
  render: () => (
    <Badge asChild variant="outline">
      <a href="#">View release notes</a>
    </Badge>
  ),
};
