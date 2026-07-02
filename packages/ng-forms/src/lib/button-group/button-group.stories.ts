import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Button } from '@gremorie/ng-core';
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from './button-group';

/**
 * ButtonGroup — layout wrapper that fuses adjacent buttons into one segmented
 * control. Angular parity port of React `ButtonGroup` from `@gremorie/rx-forms`.
 *
 * Pure layout (no brain). `orientation` strips the inner radii/borders so the
 * children read as a single unit. Compose with `gn-button-group-text` for inline
 * affixes and `gn-button-group-separator` for dividers.
 */
const meta: Meta<ButtonGroup> = {
  title: 'Forms/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [ButtonGroup, ButtonGroupText, ButtonGroupSeparator, Button],
    }),
  ],
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
  },
};

export default meta;
type Story = StoryObj<ButtonGroup>;

export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    orientation: 'horizontal',
  },
  render: (args) => ({
    props: args,
    template: `
      <gn-button-group [orientation]="orientation">
        <ai-button variant="outline">Prev</ai-button>
        <ai-button variant="outline">Next</ai-button>
      </gn-button-group>
    `,
  }),
};

/** With a text affix and a separator between segments. */
export const WithTextAndSeparator: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <gn-button-group>
        <gn-button-group-text>https://</gn-button-group-text>
        <ai-button variant="outline">gremorie.com</ai-button>
        <gn-button-group-separator />
        <ai-button variant="outline">Copy</ai-button>
      </gn-button-group>
    `,
  }),
};

/** Vertical orientation — stacks segments and strips top borders/radii. */
export const Vertical: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <gn-button-group orientation="vertical">
        <ai-button variant="outline">Top</ai-button>
        <ai-button variant="outline">Middle</ai-button>
        <ai-button variant="outline">Bottom</ai-button>
      </gn-button-group>
    `,
  }),
};
