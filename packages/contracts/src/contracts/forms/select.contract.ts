import { defineContract } from '../../types';

/**
 * Select - a single-choice dropdown over a custom (non-native) listbox.
 * React wraps Radix `Select`; Angular wraps the spartan brain select + popover.
 * React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const select = defineContract({
  name: 'select',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <select>
    └─ select (root)
       ├─ select-trigger
       │  ├─ select-value (placeholder when empty)
       │  └─ chevron icon
       └─ select-content (portalled)
          ├─ select-group
          │  ├─ select-label
          │  └─ select-item (one per option, check when selected)
          └─ select-separator`,
  props: [
    {
      name: 'value',
      type: 'string',
      adapts: { ng: 'model: value (two-way)' },
      desc: 'Selected value (controlled).',
    },
    {
      name: 'defaultValue',
      type: 'string',
      adapts: { ng: 'model: value' },
      desc: 'Initial value (uncontrolled).',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      adapts: { ng: 'output: valueChange' },
      desc: 'Fires when the selection changes.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Disables the trigger.',
    },
    { name: 'name', type: 'string', desc: 'Form control name.' },
    {
      name: 'placeholder',
      type: 'string',
      adapts: { rx: 'on <SelectValue>', ng: 'on <gn-select-value>' },
      desc: 'Text shown when nothing is selected (on the value sub-component).',
    },
    {
      name: 'size',
      type: 'SelectSize',
      default: 'default',
      options: ['sm', 'default'],
      adapts: { rx: 'on <SelectTrigger>', ng: 'on <gn-select-trigger>' },
      desc: 'Trigger height (on the trigger sub-component).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class (per sub-component)' },
      desc: 'Merged onto the relevant sub-component.',
    },
  ],
  guidance: {
    summary: 'A single-choice dropdown with a custom, themeable listbox.',
    whenToUse: [
      'Pick one option from a longer list where showing all radios would crowd the layout.',
    ],
    whenNotToUse: [
      { text: 'A small set of always-visible choices', use: 'radio-group' },
      { text: 'Multiple selections', use: 'checkbox' },
      { text: 'Free-text entry with suggestions', use: 'input' },
    ],
    rules: [
      'Each select-item needs a unique value.',
      'Group related options with select-group + select-label; divide with select-separator.',
    ],
    example:
      '<select><select-trigger><select-value placeholder="Pick one" /></select-trigger><select-content>...</select-content></select>',
  },
  preview: {
    rx: 'inputs-select--default',
    ng: 'forms-select--workbench',
  },
  tag: { rx: 'Select', ng: 'gn-select' },
  example: {
    disabled: false,
  },
  figma: { nodeId: null },
});
