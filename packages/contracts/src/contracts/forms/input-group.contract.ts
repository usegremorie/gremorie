import { defineContract } from '../../types';

/**
 * InputGroup - a field decorated with leading/trailing addons, text, or buttons,
 * fused into one control. React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const inputGroup = defineContract({
  name: 'input-group',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <input-group>
    └─ input-group (role=group)
       ├─ input-group-addon (icon/button slot; aligned start/end/block)
       │  ├─ input-group-button
       │  └─ input-group-text
       ├─ input-group-input    (the field)
       └─ input-group-textarea (multi-line variant)`,
  props: [
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the group wrapper.',
    },
    {
      name: 'align',
      type: 'InputGroupAddonAlign',
      default: 'inline-start',
      options: ['inline-start', 'inline-end', 'block-start', 'block-end'],
      adapts: { rx: 'on <InputGroupAddon>', ng: 'on <gr-input-group-addon>' },
      desc: 'Addon placement (on input-group-addon).',
    },
    {
      name: 'variant',
      type: 'ButtonVariant',
      default: 'ghost',
      adapts: { rx: 'on <InputGroupButton>', ng: 'on <gr-input-group-button>' },
      desc: 'Button style (on input-group-button).',
    },
    {
      name: 'size',
      type: 'InputGroupButtonSize',
      default: 'xs',
      options: ['xs', 'sm', 'icon-xs', 'icon-sm'],
      adapts: { rx: 'on <InputGroupButton>', ng: 'on <gr-input-group-button>' },
      desc: 'Button size preset (on input-group-button).',
    },
  ],
  guidance: {
    summary:
      'An input fused with leading/trailing addons, text, or action buttons.',
    whenToUse: [
      'Attach a prefix/suffix to a field: a currency symbol, a search icon, a "Copy" or submit button.',
    ],
    whenNotToUse: [
      { text: 'A plain field with no decoration', use: 'input' },
      { text: 'Several fused action buttons (no field)', use: 'button-group' },
    ],
    rules: [
      'Place addons with input-group-addon (align controls which edge).',
      'Use input-group-input for single-line and input-group-textarea for multi-line.',
    ],
    example:
      '<input-group><input-group-addon><SearchIcon /></input-group-addon><input-group-input /></input-group>',
  },
  preview: {
    rx: 'inputs-text-inputgroup--workbench',
    ng: 'inputs-text-inputgroup--workbench',
  },
  tag: { rx: 'InputGroup', ng: 'gr-input-group' },
  // The ng Workbench story renders sub-components with no top-level scalar args,
  // so there are no canonical scalar values to seed.
  example: {},
  figma: { nodeId: null },
});
