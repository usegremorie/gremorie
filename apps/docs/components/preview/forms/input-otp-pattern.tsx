'use client';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@gremorie/rx-forms';

// Restrict every slot to digits only. `pattern` is the regex string the
// underlying input-otp library validates each keystroke against.
const DIGITS_ONLY = '^\\d*$';

export function InputOTPPatternPreview() {
  return (
    <InputOTP maxLength={6} pattern={DIGITS_ONLY}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
