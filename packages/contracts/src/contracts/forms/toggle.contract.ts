import { defineContract } from '../../types';

/**
 * Toggle - a single two-state button (pressed / not pressed, via aria-pressed).
 * React wraps Radix `Toggle`; Angular wraps the spartan brain toggle.
 * React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const toggle = defineContract({
  name: 'toggle',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <toggle>
    └─ toggle (button, aria-pressed)`,
  props: [
    {
      name: 'pressed',
      type: 'boolean',
      default: false,
      adapts: {
        rx: 'pressed / defaultPressed',
        ng: 'model: pressed (two-way)',
      },
      desc: 'Pressed (active) state.',
    },
    {
      name: 'onPressedChange',
      type: '(pressed: boolean) => void',
      adapts: { ng: 'model: pressed (two-way)' },
      desc: 'Fires when toggled.',
    },
    {
      name: 'variant',
      type: 'ToggleVariant',
      default: 'default',
      options: ['default', 'outline'],
      desc: 'Visual style.',
    },
    {
      name: 'size',
      type: 'ToggleSize',
      default: 'default',
      options: ['default', 'sm', 'lg'],
      desc: 'Size preset.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Disables interaction.',
    },
    {
      name: 'aria-label',
      type: 'string',
      adapts: { ng: 'input: ariaLabel' },
      desc: 'Accessible label for an icon-only toggle.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the button.',
    },
  ],
  guidance: {
    summary: 'A single button that stays pressed to represent an on/off state.',
    whenToUse: [
      'Toggle a formatting or view state inline (bold, mute, grid/list) where a button feels right.',
    ],
    whenNotToUse: [
      {
        text: 'A set of mutually exclusive or multi-select toggles',
        use: 'toggle-group',
      },
      { text: 'A labelled settings on/off', use: 'switch' },
      { text: 'A boolean inside a form', use: 'checkbox' },
    ],
    rules: [
      'Give icon-only toggles an aria-label.',
      'For more than one related toggle, use toggle-group for shared state and styling.',
    ],
    example: '<toggle aria-label="Bold">B</toggle>',
  },
  preview: {
    rx: 'inputs-toggle--default',
    ng: 'forms-toggle--workbench',
  },
  figma: { nodeId: null },
});
