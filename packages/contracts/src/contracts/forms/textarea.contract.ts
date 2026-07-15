import { defineContract } from '../../types';

/**
 * Textarea - the multi-line text field over the native `<textarea>`,
 * auto-sizing via `field-sizing: content`.
 * React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const textarea = defineContract({
  name: 'textarea',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <textarea>
    └─ textarea (native <textarea>, themed)`,
  props: [
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
      name: 'rows',
      type: 'number',
      desc: 'Visible row count (escape hatch over auto-sizing).',
    },
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
    summary: 'A multi-line text field over the native textarea element.',
    whenToUse: [
      'Collect longer free-form text: messages, descriptions, notes.',
    ],
    whenNotToUse: [
      { text: 'A short single-line value', use: 'input' },
      { text: 'A field with addons/buttons', use: 'input-group' },
    ],
    rules: [
      'Pair with a label for accessibility.',
      'It auto-grows with content; set rows only when a fixed height is required.',
    ],
    example: '<textarea placeholder="Write a message..." />',
  },
  preview: {
    rx: 'inputs-text-textarea--workbench',
    ng: 'inputs-text-textarea--workbench',
  },
  tag: { rx: 'Textarea', ng: 'gr-textarea' },
  example: {
    placeholder: 'Type your message…',
    disabled: false,
    'aria-invalid': false,
    value: '',
  },
  figma: { nodeId: null },
});
