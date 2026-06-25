import { defineContract } from '../../types';

/**
 * ToggleGroup - a coordinated set of toggle buttons, single- or multi-select.
 * React wraps Radix `ToggleGroup`; Angular wraps the spartan brain toggle group.
 * React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const toggleGroup = defineContract({
  name: 'toggle-group',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <toggle-group>
    └─ toggle-group (root)
       └─ toggle-group-item (one per option, button + aria-pressed)`,
  props: [
    {
      name: 'type',
      type: "'single' | 'multiple'",
      options: ['single', 'multiple'],
      adapts: { ng: 'host-directive input' },
      desc: 'Whether one or many items can be pressed at once.',
    },
    {
      name: 'value',
      type: 'string | string[]',
      adapts: { ng: 'host-directive input' },
      desc: 'Pressed value(s); a string for single, an array for multiple.',
    },
    {
      name: 'onValueChange',
      type: '(value: string | string[]) => void',
      adapts: { ng: 'output: valueChange' },
      desc: 'Fires when the pressed set changes.',
    },
    {
      name: 'variant',
      type: 'ToggleVariant',
      default: 'default',
      options: ['default', 'outline'],
      desc: 'Visual style propagated to items.',
    },
    {
      name: 'size',
      type: 'ToggleSize',
      default: 'default',
      options: ['default', 'sm', 'lg'],
      desc: 'Size preset propagated to items.',
    },
    {
      name: 'spacing',
      type: 'number',
      default: 0,
      desc: 'Gap between items, in spacing units (0 = fused segmented control).',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      adapts: { ng: 'host-directive input' },
      desc: 'Disables the whole group.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the group.',
    },
  ],
  guidance: {
    summary: 'A row of toggle buttons sharing state, variant, and size.',
    whenToUse: [
      'Offer related inline options as a segmented control: text alignment, view mode, formatting.',
    ],
    whenNotToUse: [
      { text: 'A single standalone toggle', use: 'toggle' },
      { text: 'One choice from a longer list', use: 'select' },
      { text: 'Mutually exclusive form options', use: 'radio-group' },
    ],
    rules: [
      'type="single" behaves like radios; type="multiple" like checkboxes.',
      'variant/size set on the group propagate to items; an item may override.',
    ],
    example:
      '<toggle-group type="single" defaultValue="left"><toggle-group-item value="left" /></toggle-group>',
  },
  preview: {
    rx: 'inputs-toggle-group--multiple',
    ng: 'forms-toggle-group--workbench',
  },
  figma: { nodeId: null },
});
