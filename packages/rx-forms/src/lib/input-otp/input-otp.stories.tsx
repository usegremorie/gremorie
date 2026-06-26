import type { Meta, StoryObj } from '@storybook/react';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from './input-otp';

/**
 * # InputOTP
 *
 * Segmented one-time-passcode input, built on the `input-otp` library which
 * manages paste, `one-time-code` autocomplete and focus movement between slots.
 * Use it for 2FA, email/SMS verification and code-based auth — not for
 * persistent secrets like passwords or PINs.
 *
 * ## Anatomy
 *
 * ```text
 * InputOTP                       hidden OTPInput owning value + maxLength
 * ├─ InputOTPGroup               visual cluster of contiguous slots
 * │  └─ InputOTPSlot             one character cell (reads its char by index)
 * ├─ InputOTPSeparator           a MinusIcon divider between groups
 * └─ InputOTPGroup               another cluster (split codes 3 + 3)
 *    └─ InputOTPSlot             one character cell
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `maxLength` | `number` | — | Total number of characters / slots. |
 * | `value` | `string` | — | Controlled value. |
 * | `onChange` | `(value: string) => void` | — | Change handler. |
 * | `containerClassName` | `string` | — | Class for the outer slot container. |
 * | `disabled` | `boolean` | `false` | Disable input. |
 *
 * | Prop (InputOTPSlot) | Type | Description |
 * | --- | --- | --- |
 * | `index` | `number` | Which character (0-based) this cell renders. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `InputOTPGroup` | Visual cluster of adjacent slots. |
 * | `InputOTPSlot` | A single character cell (`index`). |
 * | `InputOTPSeparator` | Divider glyph between groups. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--input` | slot borders |
 * | `--ring` | active slot ring |
 * | `--destructive` | `aria-invalid` slot border |
 * | `--foreground` | fake caret |
 */
const meta = {
  title: 'Inputs/Text/InputOTP',
  component: InputOTP,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  // `maxLength` + `children` are required on `OTPInput`; each story supplies its
  // own through `render`, so these meta-level args are just type satisfiers.
  args: { maxLength: 6, children: null },
} satisfies Meta<typeof InputOTP>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A 6-digit code in a single contiguous group. */
export const SixDigits: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        {Array.from({ length: 6 }, (_, i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
};

/** 6 digits split 3 + 3 with a separator — the classic SMS layout. */
export const Grouped: Story = {
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  ),
};

/** A short 4-digit PIN-style code. */
export const FourDigits: Story = {
  render: () => (
    <InputOTP maxLength={4}>
      <InputOTPGroup>
        {Array.from({ length: 4 }, (_, i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
};

/** Disabled. */
export const Disabled: Story = {
  render: () => (
    <InputOTP maxLength={6} disabled>
      <InputOTPGroup>
        {Array.from({ length: 6 }, (_, i) => (
          <InputOTPSlot key={i} index={i} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
};
