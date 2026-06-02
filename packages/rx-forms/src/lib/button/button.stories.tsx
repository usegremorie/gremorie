import type { Meta, StoryObj } from '@storybook/react';
import { ArrowRight, Loader2, Mail, Plus, Trash2 } from 'lucide-react';

import { Button } from './button';

/**
 * # Button
 *
 * Primary click target. A faithful shadcn port wired to a single
 * class-variance-authority factory exposing six visual variants and eight size
 * presets (including icon-only sizes), plus an `asChild` escape hatch via Radix
 * Slot for rendering as a link or any other element.
 *
 * ## Anatomy
 *
 * A single `<button>` (or, with `asChild`, the child element) styled by
 * `buttonVariants`. SVG children are auto-sized to `size-4` (smaller for `xs` /
 * icon sizes).
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | `"default"` | Visual style. |
 * | `size` | `"default" \| "xs" \| "sm" \| "lg" \| "icon" \| "icon-xs" \| "icon-sm" \| "icon-lg"` | `"default"` | Height / padding preset. |
 * | `asChild` | `boolean` | `false` | Render the single child instead of a `<button>` (Radix Slot). |
 * | `disabled` | `boolean` | `false` | Native disabled state (pointer-events off + 50% opacity). |
 * | ...`button` | `React.ComponentProps<"button">` | — | All native button props. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--primary` / `--primary-foreground` | `variant="default"` fill |
 * | `--destructive` | `variant="destructive"` fill |
 * | `--secondary` / `--secondary-foreground` | `variant="secondary"` fill |
 * | `--accent` / `--accent-foreground` | `ghost` / `outline` hover |
 * | `--ring` | focus ring |
 * | `--background` / `--input` | `outline` surface |
 */
const meta = {
  title: 'Inputs/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { children: 'Button', variant: 'default', size: 'default' },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      control: 'select',
      options: [
        'default',
        'xs',
        'sm',
        'lg',
        'icon',
        'icon-xs',
        'icon-sm',
        'icon-lg',
      ],
    },
    asChild: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default primary button. */
export const Default: Story = {};

const VARIANTS = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
] as const;

/** Every visual variant. */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {VARIANTS.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

/** The text sizes (`xs`, `sm`, `default`, `lg`). */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

/** Square icon-only sizes — pair with an accessible label via `aria-label`. */
export const IconSizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="icon-xs" aria-label="Add">
        <Plus />
      </Button>
      <Button size="icon-sm" aria-label="Add">
        <Plus />
      </Button>
      <Button size="icon" aria-label="Add">
        <Plus />
      </Button>
      <Button size="icon-lg" aria-label="Add">
        <Plus />
      </Button>
    </div>
  ),
};

/** Leading and trailing icons (auto-sized via the `[&_svg]` rules). */
export const WithIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-3">
      <Button>
        <Mail /> Email
      </Button>
      <Button variant="secondary">
        Continue <ArrowRight />
      </Button>
      <Button variant="destructive">
        <Trash2 /> Delete
      </Button>
    </div>
  ),
};

/** Disabled state across a few variants. */
export const Disabled: Story = {
  args: { disabled: true },
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex items-center gap-3">
      <Button disabled>Default</Button>
      <Button variant="outline" disabled>
        Outline
      </Button>
      <Button variant="destructive" disabled>
        Destructive
      </Button>
    </div>
  ),
};

/** A common loading pattern: spinner + disabled. */
export const Loading: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Button disabled>
      <Loader2 className="animate-spin" /> Please wait
    </Button>
  ),
};

/**
 * `asChild` renders the single child (here an `<a>`) with the button styling,
 * so a real link gets button affordances without losing its semantics.
 */
export const AsChildLink: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Button asChild>
      <a href="https://example.com" target="_blank" rel="noreferrer">
        Visit docs <ArrowRight />
      </a>
    </Button>
  ),
};

/** Full matrix: every variant × every text size. */
export const Matrix: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <span className="w-24 text-xs text-muted-foreground capitalize">
            {variant}
          </span>
          {(['xs', 'sm', 'default', 'lg'] as const).map((size) => (
            <Button key={size} variant={variant} size={size}>
              {size}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};
