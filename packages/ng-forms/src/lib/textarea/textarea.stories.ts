import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Label } from '../label/label';
import { Textarea } from './textarea';

/**
 * Textarea — multi-line text field. Angular parity port of React `Textarea`
 * from `@gremorie/rx-forms`.
 *
 * Uses CSS `field-sizing: content` so it grows automatically as the user
 * types, with no manual `rows` or JS measurement in modern browsers. Pair with
 * labels and validation messages.
 */
const meta: Meta<Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [Textarea, Label] })],
  argTypes: {
    disabled: { control: 'boolean' },
    ariaInvalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Textarea>;

/** Interactive workbench — drive every prop from the controls panel. */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    placeholder: 'Type your message…',
    disabled: false,
    ariaInvalid: false,
    value: '',
  },
  render: (args) => ({
    props: args,
    template: `
      <gn-textarea
        class="w-80"
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
      <div class="flex w-80 flex-col gap-2">
        <gn-label for="bio">Bio</gn-label>
        <gn-textarea id="bio" placeholder="Tell us about yourself…" />
      </div>
    `,
  }),
};

/** Error state via `aria-invalid`. */
export const Invalid: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<gn-textarea class="w-80" [ariaInvalid]="true" value="Too short" />`,
  }),
};

/** Disabled. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<gn-textarea class="w-80" [disabled]="true" value="Read only content" />`,
  }),
};
