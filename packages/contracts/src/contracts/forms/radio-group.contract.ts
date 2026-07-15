import { defineContract } from '../../types';

/**
 * RadioGroup - a set of mutually exclusive options (pick exactly one).
 * React wraps Radix `RadioGroup`; Angular wraps the spartan brain radio group.
 * React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const radioGroup = defineContract({
  name: 'radio-group',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <radio-group>
    └─ radio-group (role=radiogroup)
       └─ radio-group-item (one per option)
          └─ indicator (dot, shown when selected)`,
  props: [
    {
      name: 'value',
      type: 'string',
      adapts: { ng: 'model: value (two-way)' },
      desc: 'Selected option value (controlled).',
    },
    {
      name: 'defaultValue',
      type: 'string',
      adapts: { ng: 'model: value' },
      desc: 'Initial selected value (uncontrolled).',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      adapts: { ng: 'output: valueChange' },
      desc: 'Fires when the selection changes.',
    },
    { name: 'name', type: 'string', desc: 'Form control name.' },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Disables every option.',
    },
    {
      name: 'required',
      type: 'boolean',
      default: false,
      desc: 'Marks the group required.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the group.',
    },
  ],
  guidance: {
    summary: 'A group of radio options where exactly one can be selected.',
    whenToUse: [
      'Present a small set (2–7) of mutually exclusive choices, all visible at once.',
    ],
    whenNotToUse: [
      { text: 'Many options or limited space', use: 'select' },
      { text: 'Multiple selections allowed', use: 'checkbox' },
      { text: 'A single on/off setting', use: 'switch' },
    ],
    rules: [
      'Each radio-group-item needs a unique value; pair each with a label.',
      'Arrow keys move selection within the group (roving tabindex).',
    ],
    example:
      '<radio-group defaultValue="a"><radio-group-item value="a" /></radio-group>',
  },
  preview: {
    rx: 'inputs-selection-radiogroup--workbench',
    ng: 'inputs-selection-radiogroup--workbench',
  },
  tag: { rx: 'RadioGroup', ng: 'gr-radio-group' },
  example: {
    value: 'comfortable',
    disabled: false,
  },
  figma: { nodeId: null },
});
