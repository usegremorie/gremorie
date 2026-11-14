import type { Meta, StoryObj } from '@storybook/react';

import { MediaRangePlayer } from './media-range-player';

/**
 * # MediaRangePlayer
 *
 * A video player scoped to one clip of a longer source. The clip is a
 * highlighted band inside a context window; the controls play the clip alone
 * or with context. A ref handle (`seek`, `playRange`, `pause`) lets a sibling
 * such as WordTimeline drive playback.
 *
 * ## Anatomy
 *
 * ```text
 * MediaRangePlayer        root (data-slot="media-range-player")
 * ├─ video                preload="metadata", served with HTTP Range
 * ├─ track                context window
 * │  ├─ range             the clip band
 * │  └─ playhead          current time
 * └─ controls             play clip / pause, play with context, time label
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `src` | `string` | required | Media URL. |
 * | `range` | `[number, number]` | required | Clip in/out in seconds. |
 * | `context` | `number` | `30` | Seconds around the clip. |
 * | `preload` | `'none' \| 'metadata'` | `'metadata'` | What to fetch before the first play or seek. |
 * | `controls` | `boolean` | `false` | Also show the native video controls (keyboard seeking, volume, fullscreen). |
 * | `labels` | `Partial<MediaRangePlayerLabels>` | English | Button, time label and video `aria-label` text. |
 * | `onTimeUpdate` | `(t: number) => void` | - | Current time while playing. |
 *
 * ## Ref handle
 *
 * | Method | Description |
 * | --- | --- |
 * | `seek(t)` | Move to `t` seconds; cancels a pending stop point. Works before the metadata loads. |
 * | `playRange(from, to)` | Play from `from` and pause exactly at `to`. |
 * | `pause()` | Pause; cancels a pending stop point. |
 *
 * ## Accessibility
 *
 * The clip controls are real buttons (`type="button"`) reachable with Tab. The
 * track is decorative (`aria-hidden`); the time label carries the same
 * information as text. Pass `controls` when users need keyboard seeking,
 * volume or fullscreen on the video itself.
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--muted` | track and empty video background |
 * | `--primary` | clip band |
 * | `--foreground` | playhead |
 * | `--muted-foreground` | time label |
 */
const meta = {
  title: 'Layout & display/Display/MediaRangePlayer',
  component: MediaRangePlayer,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    context: { control: { type: 'number', min: 0, max: 60, step: 1 } },
    preload: { control: 'inline-radio', options: ['metadata', 'none'] },
    controls: { control: 'boolean' },
  },
} satisfies Meta<typeof MediaRangePlayer>;

export default meta;
type Story = StoryObj<typeof meta>;

// CC0 sample from MDN (5 s).
const SAMPLE =
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

/** Workbench preset; the Angular edition has the same story and args. */
export const Workbench: Story = {
  args: { src: SAMPLE, range: [1.5, 3.5], context: 1 },
  render: (args) => (
    <div className="w-[480px]">
      <MediaRangePlayer {...args} />
    </div>
  ),
};

/** Labels in Portuguese, as the Centelha panel uses it. */
export const Localized: Story = {
  args: {
    src: SAMPLE,
    range: [1, 4],
    context: 1,
    labels: {
      playClip: 'Tocar trecho',
      playContext: 'Tocar com entorno',
      pause: 'Pausar',
      clip: 'trecho',
    },
  },
  render: (args) => (
    <div className="w-[480px]">
      <MediaRangePlayer {...args} />
    </div>
  ),
};
