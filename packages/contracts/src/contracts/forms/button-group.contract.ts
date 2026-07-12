import { defineContract } from '../../types';

/**
 * ButtonGroup - a layout wrapper that fuses adjacent buttons (and text/inputs)
 * into a single segmented control. Presentational only.
 * React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const buttonGroup = defineContract({
  name: 'button-group',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <button-group>
    └─ button-group (role=group)
       ├─ button (any number; fused at the edges)
       ├─ button-group-text (inline label/addon)
       └─ button-group-separator (divider)`,
  props: [
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: 'horizontal',
      options: ['horizontal', 'vertical'],
      desc: 'Layout axis (also exposed on button-group-separator).',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the wrapper.',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: false,
      adapts: {
        rx: 'on <ButtonGroupText>',
        ng: 'n/a (renders a styled container)',
      },
      desc: 'React-only: lets button-group-text render as its single child (Slot).',
    },
  ],
  guidance: {
    summary: 'A wrapper that visually fuses adjacent buttons into one control.',
    whenToUse: [
      'Group related actions into a segmented bar (toolbars, split buttons, input + action).',
    ],
    whenNotToUse: [
      {
        text: 'Toggling on/off states rather than firing actions',
        use: 'toggle-group',
      },
      { text: 'A single action', use: 'button' },
    ],
    rules: [
      'It only handles layout/fusing; each child button keeps its own behavior.',
      'Insert button-group-separator between segments and button-group-text for inline labels.',
    ],
    example:
      '<button-group><button>Prev</button><button>Next</button></button-group>',
  },
  preview: {
    rx: 'inputs-buttons-buttongroup--workbench',
    ng: 'inputs-buttons-buttongroup--workbench',
  },
  tag: { rx: 'ButtonGroup', ng: 'gr-button-group' },
  example: {
    orientation: 'horizontal',
  },
  figma: { nodeId: null },
});
