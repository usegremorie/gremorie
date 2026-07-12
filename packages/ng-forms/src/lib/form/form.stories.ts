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
 * (`gr-form-item` mints an id and provides field context; `grFormControl` wires
 * `id` / `aria-describedby` / `aria-invalid`; `gr-form-message` is the
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
      <gr-form-item class="w-80" [invalid]="invalid">
        <gr-form-label>Email</gr-form-label>
        <gr-input grFormControl type="email" placeholder="ada@example.com" class="w-full" />
        <gr-form-description>We'll never share your email.</gr-form-description>
        @if (invalid) {
          <gr-form-message>Please enter a valid email.</gr-form-message>
        }
      </gr-form-item>
    `,
  }),
};

/** A valid field — description only, no message row. */
export const Default: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gr-form-item class="w-80">
        <gr-form-label>Username</gr-form-label>
        <gr-input grFormControl placeholder="shadcn" class="w-full" />
        <gr-form-description>This is your public display name.</gr-form-description>
      </gr-form-item>
    `,
  }),
};

/** Error state — invalid field with a destructive message. */
export const WithError: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gr-form-item class="w-80" [invalid]="true">
        <gr-form-label>Email</gr-form-label>
        <gr-input grFormControl type="email" value="not-an-email" [ariaInvalid]="true" class="w-full" />
        <gr-form-message>Please enter a valid email.</gr-form-message>
      </gr-form-item>
    `,
  }),
};
