import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Label } from '../label/label';
import { Input } from './input';

/**
 * Input — single-line text field. Angular parity port of React `Input` from
 * `@gremorie/rx-forms`.
 *
 * Renders a styled native `<input>` that adopts every HTML `type` (text, email,
 * password, number, search, tel, url, file…). Visual states are token-driven:
 * `border-input` by default, `ring-ring/50` on focus, `border-destructive` on
 * `aria-invalid`.
 */
const meta: Meta<Input> = {
  title: 'Forms/Input',
  component: Input,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [Input, Label] })],
  argTypes: {
    type: {
      control: 'select',
      options: [
        'text',
        'email',
        'password',
        'number',
        'search',
        'tel',
        'url',
        'file',
      ],
    },
    disabled: { control: 'boolean' },
    ariaInvalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Input>;

/** Interactive workbench — drive every prop from the controls panel. */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    type: 'text',
    placeholder: 'Type here…',
    disabled: false,
    ariaInvalid: false,
    value: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <gn-input
        class="w-72"
        [type]="type"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [ariaInvalid]="ariaInvalid"
        [value]="value"
      />
    `,
  }),
};

/** Paired with a Label for an accessible field. */
export const WithLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex w-72 flex-col gap-2">
        <gn-label for="email">Email</gn-label>
        <gn-input id="email" type="email" placeholder="ada@example.com" />
      </div>
    `,
  }),
};

/** Error state via `aria-invalid`. */
export const Invalid: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-input class="w-72" [ariaInvalid]="true" value="not-an-email" />
    `,
  }),
};

/** Disabled. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-input class="w-72" [disabled]="true" value="Can't edit" />
    `,
  }),
};
