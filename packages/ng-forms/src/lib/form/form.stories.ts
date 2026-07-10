import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Input } from '../input/input';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';

/**
 * Form — field-aware form primitives. Angular parity port of React `Form` from
 * `@gremorie/rx-forms`. React wraps `react-hook-form`; Angular has first-class
 * form state, so this edition keeps the structural + ARIA-wiring contract
 * (`gn-form-item` mints an id and provides field context; `gnFormControl` wires
 * `id` / `aria-describedby` / `aria-invalid`; `gn-form-message` is the
 * destructive row that renders only when it has content) and lets you bind your
 * own reactive / template-driven control.
 */
const meta: Meta<FormItem> = {
  title: 'Inputs/Form',
  component: FormItem,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        FormItem,
        FormLabel,
        FormControl,
        FormDescription,
        FormMessage,
        Input,
      ],
    }),
  ],
  argTypes: {
    invalid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<FormItem>;

/** Interactive workbench — toggle `invalid` to see the label + message react. */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    invalid: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <gn-form-item class="w-80" [invalid]="invalid">
        <gn-form-label>Email</gn-form-label>
        <gn-input gnFormControl type="email" placeholder="ada@example.com" class="w-full" />
        <gn-form-description>We'll never share your email.</gn-form-description>
        @if (invalid) {
          <gn-form-message>Please enter a valid email.</gn-form-message>
        }
      </gn-form-item>
    `,
  }),
};

/** A valid field — description only, no message row. */
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-form-item class="w-80">
        <gn-form-label>Username</gn-form-label>
        <gn-input gnFormControl placeholder="shadcn" class="w-full" />
        <gn-form-description>This is your public display name.</gn-form-description>
      </gn-form-item>
    `,
  }),
};

/** Error state — invalid field with a destructive message. */
export const WithError: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-form-item class="w-80" [invalid]="true">
        <gn-form-label>Email</gn-form-label>
        <gn-input gnFormControl type="email" value="not-an-email" [ariaInvalid]="true" class="w-full" />
        <gn-form-message>Please enter a valid email.</gn-form-message>
      </gn-form-item>
    `,
  }),
};
