import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  InputOtp,
  InputOtpGroup,
  InputOtpSeparator,
  InputOtpSlot,
} from './input-otp';

/**
 * InputOTP — segmented one-time-passcode input. Angular parity port of React
 * `InputOTP` from `@gremorie/rx-forms`. Built on the spartan brain
 * `BrnInputOtp` (the Angular `input-otp`), which owns paste, focus, the hidden
 * `one-time-code` input and per-slot caret state. Use for 2FA / verification
 * codes.
 */
const meta: Meta<InputOtp> = {
  title: 'Inputs/Text/InputOTP',
  component: InputOtp,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [InputOtp, InputOtpGroup, InputOtpSlot, InputOtpSeparator],
    }),
  ],
  argTypes: {
    maxLength: { control: 'number' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<InputOtp>;

/** Interactive workbench — drive the props from the controls panel. */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    maxLength: 6,
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <gn-input-otp [maxLength]="maxLength" [disabled]="disabled">
        <gn-input-otp-group>
          <gn-input-otp-slot [index]="0" />
          <gn-input-otp-slot [index]="1" />
          <gn-input-otp-slot [index]="2" />
        </gn-input-otp-group>
        <gn-input-otp-separator />
        <gn-input-otp-group>
          <gn-input-otp-slot [index]="3" />
          <gn-input-otp-slot [index]="4" />
          <gn-input-otp-slot [index]="5" />
        </gn-input-otp-group>
      </gn-input-otp>
    `,
  }),
};

/** Four contiguous slots, no separator. */
export const FourDigits: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-input-otp [maxLength]="4">
        <gn-input-otp-group>
          <gn-input-otp-slot [index]="0" />
          <gn-input-otp-slot [index]="1" />
          <gn-input-otp-slot [index]="2" />
          <gn-input-otp-slot [index]="3" />
        </gn-input-otp-group>
      </gn-input-otp>
    `,
  }),
};

/** Disabled. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-input-otp [maxLength]="6" [disabled]="true">
        <gn-input-otp-group>
          <gn-input-otp-slot [index]="0" />
          <gn-input-otp-slot [index]="1" />
          <gn-input-otp-slot [index]="2" />
          <gn-input-otp-slot [index]="3" />
          <gn-input-otp-slot [index]="4" />
          <gn-input-otp-slot [index]="5" />
        </gn-input-otp-group>
      </gn-input-otp>
    `,
  }),
};
