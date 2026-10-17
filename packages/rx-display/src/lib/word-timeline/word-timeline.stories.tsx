import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { WordTimeline } from './word-timeline';
import type { TimelineWord } from './word-timeline.logic';

/**
 * # WordTimeline
 *
 * Transcript words as a clickable strip. In "Seek" mode a click seeks the
 * paired player; in "Set in" / "Set out" mode it moves the clip boundary to
 * that word's start or end. The range can never invert.
 *
 * ## Anatomy
 *
 * ```text
 * WordTimeline            root (data-slot="word-timeline")
 * ├─ mode                 ToggleGroup: seek | set in | set out
 * └─ words (role=group)
 *    ├─ speaker label     at each speaker turn
 *    └─ word button       data-in-range, data-current
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `words` | `TimelineWord[]` | required | Words with start/end seconds and speaker. |
 * | `value` | `[number, number]` | required | Selected in/out. |
 * | `onValueChange` | `(v) => void` | - | New in/out after a boundary click. |
 * | `currentTime` | `number` | - | Highlights the spoken word. |
 * | `onSeek` | `(t) => void` | - | Word start, in seek mode. |
 * | `speakerNames` | `Record<string, string>` | - | Display names per speaker id. |
 * | `labels` | `Partial<WordTimelineLabels>` | English | Mode and group labels. |
 *
 * ## Accessibility
 *
 * Every word is a real button (`type="button"`, safe inside forms) reachable
 * with Tab in reading order; Enter or Space activates it. The mode is a
 * single-select toggle group (arrow keys move between modes). The words sit
 * in a `role="group"` labelled by `labels.group`.
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--primary` | in-range word background (15%) |
 * | `--accent` | hover |
 * | `--ring` | focus ring |
 * | `--foreground` / `--border` | word text and strip border |
 * | `--muted` / `--foreground` | speaker label (background / text) |
 */
const meta = {
  title: 'Layout & display/Display/WordTimeline',
  component: WordTimeline,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof WordTimeline>;

export default meta;
type Story = StoryObj<typeof meta>;

const TEXT =
  'Good morning everyone. Thanks for having me. Today we talk about labor law and where it came from.';
const WORDS: TimelineWord[] = TEXT.split(' ').map((w, i) => ({
  w,
  start: i * 0.5,
  end: i * 0.5 + 0.4,
  speaker: i < 3 ? 'host' : 'guest',
}));

function Controlled(props: React.ComponentProps<typeof WordTimeline>) {
  const [value, setValue] = React.useState(props.value);
  return (
    <div className="flex w-[520px] flex-col gap-2">
      <WordTimeline {...props} value={value} onValueChange={setValue} />
      <code
        data-slot="word-timeline-demo-value"
        className="text-xs text-muted-foreground"
      >
        in {value[0].toFixed(2)} s, out {value[1].toFixed(2)} s
      </code>
    </div>
  );
}

/** Workbench preset (React only for now; the Angular twin is not built yet). */
export const Workbench: Story = {
  args: {
    words: WORDS,
    value: [1.5, 4.4],
    currentTime: 2.1,
    speakerNames: { host: 'Host', guest: 'Guest' },
  },
  render: (args) => <Controlled {...args} />,
};

/** Labels in Portuguese, as the Centelha panel uses it. */
export const Localized: Story = {
  args: {
    words: WORDS,
    value: [1.5, 4.4],
    speakerNames: { host: 'Apresentador', guest: 'Convidada' },
    labels: {
      group: 'Palavras da transcrição',
      seek: 'Ir',
      setIn: 'Marcar início',
      setOut: 'Marcar fim',
    },
  },
  render: (args) => <Controlled {...args} />,
};
