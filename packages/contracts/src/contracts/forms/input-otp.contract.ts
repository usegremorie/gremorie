import { defineContract } from '../../types';

/**
 * InputOTP - a segmented one-time-passcode field; each character renders in its
 * own slot. React uses the `input-otp` library; Angular wraps the spartan brain
 * input-otp. React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const inputOtp = defineContract({
  name: 'input-otp',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <input-otp>
    └─ input-otp (hidden input drives state)
       ├─ input-otp-group
       │  └─ input-otp-slot (one per character)
       └─ input-otp-separator (optional, between groups)`,
  props: [
    {
      name: 'maxLength',
      type: 'number',
      required: true,
      desc: 'Number of slots / code length.',
    },
    {
      name: 'value',
      type: 'string',
      adapts: { ng: 'model: value (two-way)' },
      desc: 'Current code (controlled).',
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      adapts: { ng: 'model: value (two-way)' },
      desc: 'Fires as the code is typed/pasted.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Disables interaction.',
    },
    {
      name: 'id',
      type: 'string',
      adapts: { ng: 'input: inputId' },
      desc: 'Id of the underlying hidden input.',
    },
    {
      name: 'containerClassName',
      type: 'string',
      desc: 'Merged onto the slots container.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'merged into containerClassName' },
      desc: 'Merged onto the hidden-input wrapper.',
    },
    {
      name: 'index',
      type: 'number',
      required: true,
      adapts: { rx: 'on <InputOTPSlot>', ng: 'on <gn-input-otp-slot>' },
      desc: 'Which slot a given input-otp-slot renders (on the slot sub-component).',
    },
  ],
  guidance: {
    summary: 'A segmented field for entering a fixed-length one-time passcode.',
    whenToUse: [
      'Enter a short verification code (2FA/MFA, email/SMS confirmation) one digit per slot.',
    ],
    whenNotToUse: [
      { text: 'Any free-form short text', use: 'input' },
      { text: 'A masked secret of arbitrary length', use: 'input' },
    ],
    rules: [
      'maxLength sets the slot count; render one input-otp-slot per index.',
      'Paste fills all slots; split into groups with input-otp-separator for readability.',
    ],
    example:
      '<input-otp maxLength={6}><input-otp-group>...slots...</input-otp-group></input-otp>',
  },
  preview: {
    rx: 'inputs-input-otp--six-digits',
    ng: 'forms-input-otp--workbench',
  },
  tag: { rx: 'InputOTP', ng: 'gn-input-otp' },
  example: {
    maxLength: 6,
    disabled: false,
  },
  figma: { nodeId: null },
});
