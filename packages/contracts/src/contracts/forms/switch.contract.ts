import { defineContract } from '../../types';

/**
 * Switch - an instant on/off toggle. React wraps Radix `Switch`; Angular wraps
 * the spartan brain switch. React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const switchContract = defineContract({
  name: 'switch',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <switch>
    └─ root (button, role=switch)
       └─ thumb (sliding knob)`,
  props: [
    {
      name: 'checked',
      type: 'boolean',
      default: false,
      adapts: { ng: 'model: checked (two-way)' },
      desc: 'On/off state (controlled).',
    },
    {
      name: 'defaultChecked',
      type: 'boolean',
      default: false,
      adapts: { ng: 'model: checked' },
      desc: 'Initial state (uncontrolled).',
    },
    {
      name: 'onCheckedChange',
      type: '(checked: boolean) => void',
      adapts: { ng: 'model: checked (two-way)' },
      desc: 'Fires when toggled.',
    },
    {
      name: 'size',
      type: 'SwitchSize',
      default: 'default',
      options: ['sm', 'default'],
      desc: 'Visual size.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Disables interaction.',
    },
    { name: 'id', type: 'string', desc: 'Element id for label association.' },
    { name: 'name', type: 'string', desc: 'Form control name.' },
    {
      name: 'aria-label',
      type: 'string',
      adapts: { ng: 'native attr' },
      desc: 'Accessible label when there is no visible label.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the control.',
    },
  ],
  guidance: {
    summary: 'An instant on/off toggle for a single setting.',
    whenToUse: [
      'Toggle a setting that applies immediately, with no submit step (e.g. notifications on/off).',
    ],
    whenNotToUse: [
      { text: 'A value confirmed only on form submit', use: 'checkbox' },
      { text: 'Choosing one of several options', use: 'radio-group' },
    ],
    rules: [
      'The change should take effect immediately; do not require a separate save.',
      'Pair with a label so the setting is named and the label toggles it.',
    ],
    example: '<switch defaultChecked /> <label>Email alerts</label>',
  },
  preview: {
    rx: 'inputs-switch--default',
    ng: 'forms-switch--workbench',
  },
  figma: { nodeId: null },
});
