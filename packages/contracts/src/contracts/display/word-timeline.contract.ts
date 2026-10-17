import { defineContract } from '../../types';

/**
 * WordTimeline - transcript words as a clickable strip to pick clip in/out at
 * word boundaries. React: `@gremorie/rx-display`. Angular: not built yet
 * (status preview).
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
       └─ word button (data-in-range, data-current)`,
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
      desc: 'Mode and group labels (defaults in English).',
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
    ],
    example:
      '<WordTimeline words={words} value={[12.3, 58.1]} onValueChange={setValue} />',
  },
  preview: { rx: 'layout-display-display-wordtimeline--workbench' },
  tag: { rx: 'WordTimeline', ng: 'gr-word-timeline' },
  // `value` is a tuple and `words` an array, not scalar control values, so
  // they stay in the story args.
  example: { currentTime: 2.1 },
  figma: { nodeId: null },
});
