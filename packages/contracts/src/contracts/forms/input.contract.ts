import { defineContract } from '../../types';

/**
 * Input - the single-line text field. A thin styled wrapper over the native
 * `<input>`. React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const input = defineContract({
  name: 'input',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <input>
    └─ input (native <input>, themed)`,
  props: [
    {
      name: 'type',
      type: 'string',
      default: 'text',
      desc: 'HTML input type (text, email, password, file, ...).',
    },
    { name: 'placeholder', type: 'string', desc: 'Placeholder text.' },
    { name: 'value', type: 'string', desc: 'Controlled value.' },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Disables interaction.',
    },
    { name: 'id', type: 'string', desc: 'Element id for label association.' },
    { name: 'name', type: 'string', desc: 'Form control name.' },
    {
      name: 'aria-invalid',
      type: 'boolean',
      adapts: { ng: 'input: ariaInvalid' },
      desc: 'Signals the error state.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the field.',
    },
    {
      name: 'onChange',
      type: '(e) => void',
      adapts: { ng: 'output: valueChange' },
      desc: 'Fires on input; Angular emits the string value.',
    },
  ],
  guidance: {
    summary: 'A single-line text field over the native input element.',
    whenToUse: [
      'Collect a short, single-line value: name, email, password, search.',
    ],
    whenNotToUse: [
      { text: 'Multi-line free text', use: 'textarea' },
      { text: 'A fixed set of choices', use: 'select' },
      {
        text: 'A field with a leading/trailing addon or button',
        use: 'input-group',
      },
    ],
    rules: [
      'Pair with a label (via id/htmlFor) for accessibility.',
      'Set aria-invalid for the error style; do not rely on color alone.',
    ],
    example: '<input type="email" placeholder="you@example.com" />',
  },
  preview: {
    rx: 'inputs-text-input--default',
    ng: 'forms-input--workbench',
  },
  tag: { rx: 'Input', ng: 'gn-input' },
  example: {
    type: 'text',
    placeholder: 'Type here…',
    disabled: false,
    'aria-invalid': false,
    value: '',
  },
  figma: { nodeId: null },
});
