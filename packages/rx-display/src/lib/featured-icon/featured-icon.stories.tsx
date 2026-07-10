import type { Meta, StoryObj } from '@storybook/react';
import {
  Bell,
  ChartColumn,
  Check,
  Sparkles,
  TriangleAlert,
} from 'lucide-react';

import { FeaturedIcon } from './featured-icon';

/**
 * # FeaturedIcon
 *
 * An icon inside a styled, themed container — the small badge that anchors a
 * card / artifact / empty-state header. Token-driven (theme + dark mode flow
 * through automatically).
 *
 * ## Anatomy
 *
 * A single element: a sized, rounded container wrapping one glyph.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `icon` | `LucideIcon` | — | Glyph to render (or pass `children`). |
 * | `color` | `"primary" \| "gray" \| "success" \| "error"` | `"primary"` | Semantic color. |
 * | `theme` | `"light" \| "solid" \| "outline"` | `"light"` | Fill style. |
 * | `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | 32 / 40 / 48 / 56 px. |
 * | `shape` | `"square" \| "circle"` | `"square"` | Container shape. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--primary` / `--primary-foreground` | `color="primary"` fill + icon |
 * | `--success` / `--success-foreground` | `color="success"` |
 * | `--destructive` / `--destructive-foreground` | `color="error"` |
 * | `--muted` / `--secondary` / `--muted-foreground` | `color="gray"` |
 * | `--border` | `theme="outline"` border |
 */
const meta = {
  title: 'Layout & display/Display/FeaturedIcon',
  component: FeaturedIcon,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    icon: Sparkles,
    color: 'primary',
    theme: 'light',
    size: 'md',
    shape: 'square',
  },
  argTypes: {
    color: {
      control: 'inline-radio',
      options: ['primary', 'gray', 'success', 'error'],
    },
    theme: { control: 'inline-radio', options: ['light', 'solid', 'outline'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    shape: { control: 'inline-radio', options: ['square', 'circle'] },
    icon: { control: false },
  },
} satisfies Meta<typeof FeaturedIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Workbench — a single featured icon driven by the variant controls. */
export const Workbench: Story = {
  args: {
    icon: Sparkles,
    color: 'primary',
    theme: 'light',
    size: 'md',
    shape: 'square',
  },
};

export const Default: Story = {};

const COLORS = ['primary', 'gray', 'success', 'error'] as const;
const THEMES = ['light', 'solid', 'outline'] as const;

/** Every color × theme combination. */
export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {THEMES.map((theme) => (
        <div key={theme} className="flex items-center gap-4">
          <span className="w-16 text-xs text-muted-foreground capitalize">
            {theme}
          </span>
          {COLORS.map((color) => (
            <FeaturedIcon
              key={color}
              icon={Sparkles}
              color={color}
              theme={theme}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

/** The four sizes (square). */
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <FeaturedIcon key={size} icon={ChartColumn} size={size} />
      ))}
    </div>
  ),
};

/** Square vs circle. */
export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <FeaturedIcon icon={Bell} shape="square" size="lg" />
      <FeaturedIcon icon={Bell} shape="circle" size="lg" />
    </div>
  ),
};

/** Common semantic pairings. */
export const Semantic: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <FeaturedIcon icon={Check} color="success" />
      <FeaturedIcon icon={TriangleAlert} color="error" />
      <FeaturedIcon icon={ChartColumn} color="primary" />
      <FeaturedIcon icon={Bell} color="gray" />
    </div>
  ),
};
