import { defineContract } from '../../types';

/**
 * Slider - a draggable track for picking a number or a numeric range.
 * React wraps Radix `Slider`; Angular wraps the spartan brain slider.
 * React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const slider = defineContract({
  name: 'slider',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <slider>
    └─ root
       ├─ track
       │  └─ range (filled portion)
       └─ thumb (one per value; two for a range)`,
  props: [
    {
      name: 'value',
      type: 'number[]',
      adapts: { ng: 'model: value (two-way)' },
      desc: 'Current value(s); one entry per thumb (controlled).',
    },
    {
      name: 'defaultValue',
      type: 'number[]',
      adapts: { ng: 'model: value' },
      desc: 'Initial value(s) (uncontrolled).',
    },
    {
      name: 'onValueChange',
      type: '(value: number[]) => void',
      adapts: { ng: 'model: value (two-way)' },
      desc: 'Fires while dragging.',
    },
    { name: 'min', type: 'number', default: 0, desc: 'Minimum value.' },
    { name: 'max', type: 'number', default: 100, desc: 'Maximum value.' },
    { name: 'step', type: 'number', default: 1, desc: 'Step increment.' },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      default: 'horizontal',
      options: ['horizontal', 'vertical'],
      desc: 'Layout direction.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Disables interaction.',
    },
    {
      name: 'thumbAriaLabel',
      type: 'string | string[]',
      desc: 'Accessible label(s) for the thumb(s) when there is no visible label.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the root.',
    },
  ],
  guidance: {
    summary: 'A draggable track for selecting a number or a numeric range.',
    whenToUse: [
      'Pick an approximate value within a bounded range (volume, opacity, price band).',
    ],
    whenNotToUse: [
      { text: 'A precise number where exact entry matters', use: 'input' },
      { text: 'An on/off setting', use: 'switch' },
    ],
    rules: [
      'value is always an array: one entry per thumb. Two entries make it a range.',
      'Provide thumbAriaLabel when there is no visible label (WCAG 4.1.2).',
    ],
    example: '<slider defaultValue={[50]} min={0} max={100} />',
  },
  preview: {
    rx: 'inputs-selection-slider--workbench',
    ng: 'inputs-selection-slider--workbench',
  },
  tag: { rx: 'Slider', ng: 'gr-slider' },
  example: {
    min: 0,
    max: 100,
    step: 1,
    orientation: 'horizontal',
    disabled: false,
    thumbAriaLabel: 'Value',
  },
  figma: { nodeId: null },
});
