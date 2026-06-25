import { defineContract } from '../../types';

/**
 * Progress - a determinate progress indicator (0–100). React: `@gremorie/rx-feedback`
 * (wraps Radix Progress). Angular: `@gremorie/ng-feedback` (wraps `@spartan-ng/brain`
 * BrnProgress, which also exposes an indeterminate state).
 */
export const progress = defineContract({
  name: 'progress',
  category: 'feedback',
  status: 'stable',
  anatomy: `
    <progress>               (rounded track)
    └─ progress-indicator    (filled bar, translated by value%)`,
  props: [
    {
      name: 'value',
      type: 'number | null',
      desc: 'Completion (0–max). null/omitted renders empty; in Angular null reports an indeterminate state.',
    },
    {
      name: 'max',
      type: 'number',
      default: 100,
      desc: 'Maximum value.',
    },
    {
      name: 'getValueLabel',
      type: '(value: number, max: number) => string',
      adapts: {
        rx: 'forwarded Radix Progress prop',
        ng: 'input forwarded to BrnProgress',
      },
      desc: 'Accessible label for the current value.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Sizing / color overrides on the track.',
    },
  ],
  guidance: {
    summary: 'A determinate bar for tasks whose percent complete is known.',
    whenToUse: [
      'Uploads, multi-step forms, batch jobs — anything where you can compute how far along it is.',
    ],
    whenNotToUse: [
      { text: 'Unknown-duration waits', use: 'spinner' },
      { text: 'Content placeholders while data loads', use: 'skeleton' },
    ],
    rules: [
      'Always pair the bar with a numeric value or label; a silent bar confuses users about the actual state.',
      'Use max for step counts (e.g. 3 of 5) rather than pre-computing a percentage.',
    ],
    example: '<progress value={60} />',
  },
  preview: {
    rx: 'interaction-feedback-progress--default',
    ng: 'feedback-progress--default',
  },
  figma: { nodeId: null },
});
