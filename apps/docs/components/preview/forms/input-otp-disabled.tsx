'use client';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@gremorie/rx-forms';

export function InputOTPDisabledPreview() {
  return (
    <InputOTP maxLength={6} disabled defaultValue="123456">
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
