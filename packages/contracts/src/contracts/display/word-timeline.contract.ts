import { defineContract } from '../../types';

/**
 * WordTimeline - transcript words as a clickable strip to pick clip in/out at
 * word boundaries. React: `@gremorie/rx-display` (`WordTimeline`). Angular:
 * `@gremorie/ng-display` (`gr-word-timeline`), with `[(value)]` two-way binding.
 *
 * Storybook only, on purpose: no page on the docs site, no registry entry, no
 * workbench nav (Kal, 2026-11-13). Both editions live in their Storybooks.
 * Ask before adding docs for it.
 */
export const wordTimeline = defineContract({
  name: 'word-timeline',
  category: 'display',
  status: 'preview',
  anatomy: `
    <word-timeline>
    ├─ mode (toggle group: seek | set in | set out)
    └─ words (role=group)
       ├─ speaker label (at each turn)
       └─ word button (data-in-range, data-edge, data-current; roving tabindex)`,
  props: [
    {
      name: 'words',
      type: 'TimelineWord[]',
      required: true,
      desc: 'Words with start/end seconds and speaker.',
    },
    {
      name: 'value',
      type: '[number, number]',
      required: true,
      desc: 'Selected in/out in seconds.',
    },
    {
      name: 'onValueChange',
      type: '(value: [number, number]) => void',
      adapts: { ng: 'output: valueChange' },
      desc: 'New in/out after a boundary click.',
    },
    {
      name: 'currentTime',
      type: 'number',
      desc: 'Playhead; highlights the spoken word.',
    },
    {
      name: 'onSeek',
      type: '(t: number) => void',
      adapts: { ng: 'output: seek' },
      desc: 'Word start, when clicked in seek mode.',
    },
    {
      name: 'speakerNames',
      type: 'Record<string, string>',
      desc: 'Display names per speaker id.',
    },
    {
      name: 'labels',
      type: 'Partial<WordTimelineLabels>',
      desc: 'Mode, group and screen-reader clip-state labels (defaults in English).',
    },
    {
      name: 'followPlayhead',
      type: 'boolean',
      default: true,
      desc: 'Scroll the strip to keep the spoken word visible, except while focus is inside it.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the root.',
    },
  ],
  guidance: {
    summary: 'Pick clip boundaries by clicking transcript words.',
    whenToUse: ['Trimming a clip so it starts and ends on whole words.'],
    whenNotToUse: [{ text: 'Free numeric time entry', use: 'input' }],
    rules: [
      'The range never inverts: setting out before in moves in to that word.',
      'Pair with MediaRangePlayer: pass its time as currentTime and seek from onSeek.',
      'The strip is one tab stop; arrows, Home and End move between words.',
      'Clip state is also in text and borders, never only in color.',
    ],
    example:
      '<WordTimeline words={words} value={[12.3, 58.1]} onValueChange={setValue} />',
  },
  preview: {
    rx: 'layout-display-display-wordtimeline--workbench',
    ng: 'layout-display-display-wordtimeline--workbench',
  },
  tag: { rx: 'WordTimeline', ng: 'gr-word-timeline' },
  // `value` is a tuple and `words` an array, not scalar control values, so
  // they stay in the story args.
  example: { currentTime: 2.1 },
  figma: { nodeId: null },
});
