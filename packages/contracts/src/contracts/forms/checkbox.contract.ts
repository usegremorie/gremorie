import { defineContract } from '../../types';

/**
 * Checkbox - a three-state (checked / unchecked / indeterminate) control.
 * React wraps Radix `Checkbox.Root`; Angular wraps the spartan brain checkbox.
 * React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const checkbox = defineContract({
  name: 'checkbox',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <checkbox>
    └─ root (button, role=checkbox)
       └─ indicator (mounts when checked)
          └─ check icon`,
  props: [
    {
      name: 'checked',
      type: "boolean | 'indeterminate'",
      default: false,
      adapts: { ng: 'model: checked (+ indeterminate model)' },
      desc: 'Checked state; "indeterminate" for the mixed state.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Disables interaction.',
    },
    {
      name: 'required',
      type: 'boolean',
      default: false,
      desc: 'Marks the control required in a form.',
    },
    { name: 'id', type: 'string', desc: 'Element id for label association.' },
    { name: 'name', type: 'string', desc: 'Form control name.' },
    {
      name: 'aria-label',
      type: 'string',
      adapts: { ng: 'input: ariaLabel' },
      desc: 'Accessible label when there is no visible label.',
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
      desc: 'Merged onto the control.',
    },
    {
      name: 'onCheckedChange',
      type: "(checked: boolean | 'indeterminate') => void",
      adapts: { ng: 'model: checked (two-way)' },
      desc: 'Fires when the checked state changes.',
    },
  ],
  guidance: {
    summary:
      'A single checkbox with checked, unchecked, and indeterminate states.',
    whenToUse: [
      'Toggle a single boolean.',
      'Let users pick zero or more items from a list (one checkbox per item).',
    ],
    whenNotToUse: [
      {
        text: 'Mutually exclusive choices (pick exactly one)',
        use: 'radio-group',
      },
      { text: 'An instant on/off setting', use: 'switch' },
    ],
    rules: [
      'Pair with a label (id/htmlFor) so the text is clickable.',
      'Use "indeterminate" only for a parent that summarizes a partially-checked group.',
    ],
    example:
      '<checkbox id="terms" /> <label htmlFor="terms">Accept terms</label>',
  },
  preview: {
    rx: 'inputs-checkbox--default',
    ng: 'forms-checkbox--workbench',
  },
  tag: { rx: 'Checkbox', ng: 'gn-checkbox' },
  example: {
    checked: false,
    disabled: false,
    required: false,
    'aria-invalid': false,
  },
  figma: { nodeId: null },
});
