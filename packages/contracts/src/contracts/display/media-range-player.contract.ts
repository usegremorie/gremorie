import { defineContract } from '../../types';

/**
 * MediaRangePlayer - a video player scoped to one clip of a longer source.
 * React: `@gremorie/rx-display` (`MediaRangePlayer`). Angular:
 * `@gremorie/ng-display` (`gr-media-range-player`), where the React ref handle
 * is the component instance (`#player`, then `player.seek(t)`).
 *
 * Storybook only, on purpose: no page on the docs site, no registry entry, no
 * workbench nav (Kal, 2026-11-13). Both editions live in their Storybooks.
 * Ask before adding docs for it.
 */
export const mediaRangePlayer = defineContract({
  name: 'media-range-player',
  category: 'display',
  status: 'preview',
  anatomy: `
    <media-range-player>
    ├─ video (preload metadata, HTTP Range)
    ├─ track (context window)
    │  ├─ range (clip band)
    │  └─ playhead
    └─ controls (play clip | pause, play with context, time)`,
  props: [
    { name: 'src', type: 'string', required: true, desc: 'Media URL.' },
    {
      name: 'range',
      type: '[number, number]',
      required: true,
      desc: 'Clip in/out in seconds.',
    },
    {
      name: 'context',
      type: 'number',
      default: 30,
      desc: 'Seconds shown and played around the clip.',
    },
    {
      name: 'preload',
      type: "'none' | 'metadata'",
      default: 'metadata',
      desc: 'What to fetch before the first play or seek (none for lists).',
    },
    {
      name: 'controls',
      type: 'boolean',
      default: false,
      desc: 'Also show the native video controls (keyboard seeking, volume, fullscreen).',
    },
    {
      name: 'labels',
      type: 'Partial<MediaRangePlayerLabels>',
      desc: 'Button, time label and video aria-label text (defaults in English).',
    },
    {
      name: 'onTimeUpdate',
      type: '(t: number) => void',
      adapts: { ng: 'output: timeUpdate' },
      desc: 'Current time while playing.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the root.',
    },
  ],
  guidance: {
    summary: 'Review one clip of a long recording, with context around it.',
    whenToUse: [
      'Approving or trimming a clip cut from a long video (podcast, lecture, meeting).',
    ],
    whenNotToUse: [
      { text: 'Plain playback of a whole video', use: 'native video element' },
    ],
    rules: [
      'Serve src with HTTP Range: the player seeks into long sources.',
      'Pair with WordTimeline through the ref handle to seek from words.',
    ],
    example:
      '<MediaRangePlayer src="/media/ep.mp4" range={[754, 812]} context={30} />',
  },
  preview: {
    rx: 'layout-display-display-mediarangeplayer--workbench',
    ng: 'layout-display-display-mediarangeplayer--workbench',
  },
  tag: { rx: 'MediaRangePlayer', ng: 'gr-media-range-player' },
  // `range` is a tuple, not a scalar control value, so it stays in the story args.
  example: { src: '', context: 1, controls: false },
  figma: { nodeId: null },
});
