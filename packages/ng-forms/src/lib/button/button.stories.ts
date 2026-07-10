import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Button } from './index';

/**
 * Button — primary click target. Angular parity port of React `Button` from
 * `@gremorie/rx-forms`.
 *
 * The component source lives in `@gremorie/ng-core` (ng-forms depends on
 * ng-core's `cn`/`buttonVariants`, so hosting it here would be circular) and is
 * re-exported from `@gremorie/ng-forms` to mirror the React package surface.
 * Exposes six visual variants and four size presets via a cva factory shared
 * verbatim with the React edition's class strings.
 */
const meta: Meta<Button> = {
  title: 'Inputs/Buttons/Button',
  component: Button,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [Button] })],
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
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Button>;

/**
 * Workbench preset: renders the IDENTICAL use case as the React `Workbench`
 * story in `rx-forms`. Keep both datasets in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    variant: 'default',
    size: 'default',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <ai-button [variant]="variant" [size]="size" [disabled]="disabled">
        Button
      </ai-button>
    `,
  }),
};

/** Every visual variant. */
export const Variants: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-3">
        <ai-button variant="default">default</ai-button>
        <ai-button variant="destructive">destructive</ai-button>
        <ai-button variant="outline">outline</ai-button>
        <ai-button variant="secondary">secondary</ai-button>
        <ai-button variant="ghost">ghost</ai-button>
        <ai-button variant="link">link</ai-button>
      </div>
    `,
  }),
};

/** The size presets (`sm`, `default`, `lg`). */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-3">
        <ai-button size="sm">Small</ai-button>
        <ai-button size="default">Default</ai-button>
        <ai-button size="lg">Large</ai-button>
      </div>
    `,
  }),
};

/** Disabled state across a few variants. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-center gap-3">
        <ai-button [disabled]="true">Default</ai-button>
        <ai-button variant="outline" [disabled]="true">Outline</ai-button>
        <ai-button variant="destructive" [disabled]="true">Destructive</ai-button>
      </div>
    `,
  }),
};
