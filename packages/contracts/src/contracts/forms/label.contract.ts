import { defineContract } from '../../types';

/**
 * Label - the accessible caption for a form control. React wraps Radix
 * `Label.Root`; Angular projects content into a native `<label>`.
 * React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const label = defineContract({
  name: 'label',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <label>
    └─ label (native <label>, content projected)`,
  props: [
    {
      name: 'htmlFor',
      type: 'string',
      adapts: { ng: 'input: for' },
      desc: 'Id of the control this label captions.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the label.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      adapts: { ng: '<ng-content>' },
      desc: 'Label text / content.',
    },
  ],
  guidance: {
    summary: 'An accessible caption bound to a form control.',
    whenToUse: [
      'Name any input, checkbox, radio, switch, or select so it is announced and clickable.',
    ],
    whenNotToUse: [
      { text: 'Section or page headings', use: 'heading' },
      { text: 'Helper / error text under a field', use: 'form' },
    ],
    rules: [
      'Always set htmlFor (Angular: for) to the control id, or wrap the control as a child.',
      'Clicking the label focuses / toggles the associated control.',
    ],
    example: '<label htmlFor="email">Email</label>',
  },
  preview: {
    rx: 'inputs-text-label--workbench',
    ng: 'inputs-text-label--workbench',
  },
  tag: { rx: 'Label', ng: 'gn-label' },
  example: {
    htmlFor: '',
  },
  figma: { nodeId: null },
});
