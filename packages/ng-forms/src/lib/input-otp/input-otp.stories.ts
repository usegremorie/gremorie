import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  BrnInputOtp,
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
// Typed to BrnInputOtp: the consumer element is now `<brn-input-otp grInputOtp>`
// and the controllable props (maxLength / disabled) live on the brain element.
// The grInputOtp styling directive is applied in every template.
const meta: Meta<BrnInputOtp> = {
  title: 'Inputs/Text/InputOTP',
  component: BrnInputOtp,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        BrnInputOtp,
        InputOtp,
        InputOtpGroup,
        InputOtpSlot,
        InputOtpSeparator,
      ],
    }),
  ],
  argTypes: {
    maxLength: { control: 'number' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<BrnInputOtp>;

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
      <brn-input-otp grInputOtp [maxLength]="maxLength" [disabled]="disabled">
        <gr-input-otp-group>
          <gr-input-otp-slot [index]="0" />
          <gr-input-otp-slot [index]="1" />
          <gr-input-otp-slot [index]="2" />
        </gr-input-otp-group>
        <gr-input-otp-separator />
        <gr-input-otp-group>
          <gr-input-otp-slot [index]="3" />
          <gr-input-otp-slot [index]="4" />
          <gr-input-otp-slot [index]="5" />
        </gr-input-otp-group>
      </brn-input-otp>
    `,
  }),
};

/** Four contiguous slots, no separator. */
export const FourDigits: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <brn-input-otp grInputOtp [maxLength]="4">
        <gr-input-otp-group>
          <gr-input-otp-slot [index]="0" />
          <gr-input-otp-slot [index]="1" />
          <gr-input-otp-slot [index]="2" />
          <gr-input-otp-slot [index]="3" />
        </gr-input-otp-group>
      </brn-input-otp>
    `,
  }),
};

/** Disabled. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <brn-input-otp grInputOtp [maxLength]="6" [disabled]="true">
        <gr-input-otp-group>
          <gr-input-otp-slot [index]="0" />
          <gr-input-otp-slot [index]="1" />
          <gr-input-otp-slot [index]="2" />
          <gr-input-otp-slot [index]="3" />
          <gr-input-otp-slot [index]="4" />
          <gr-input-otp-slot [index]="5" />
        </gr-input-otp-group>
      </brn-input-otp>
    `,
  }),
};
