import { Component, input, signal, type OnInit } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { WordTimeline, type WordTimelineLabels } from './word-timeline';
import type { TimelineWord } from './word-timeline.logic';

/**
 * # WordTimeline
 *
 * Transcript words as a clickable strip (Angular edition). Mirrors React
 * `WordTimeline` from `@gremorie/rx-display`. In "Seek" mode a click emits
 * `seek` for the paired player; in "Set in" / "Set out" mode it moves the clip
 * boundary to that word's start or end. The range can never invert.
 *
 * ## Anatomy
 *
 * ```text
 * gr-word-timeline        host (data-slot="word-timeline")
 * ├─ mode                 gr-toggle-group: seek | set in | set out
 * └─ words (role=group)
 *    ├─ speaker label     at each speaker turn
 *    └─ word button       data-in-range, data-edge, data-current
 * ```
 *
 * ## Inputs and outputs
 *
 * | Name | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `words` | `TimelineWord[]` | required | Words with start/end seconds and speaker. |
 * | `value` | `[number, number]` | required | Selected in/out; `[(value)]` works. |
 * | `currentTime` | `number` | - | Highlights the spoken word. |
 * | `speakerNames` | `Record<string, string>` | - | Display names per speaker id. |
 * | `labels` | `Partial<WordTimelineLabels>` | English | Mode, group and screen-reader clip-state labels. |
 * | `followPlayhead` | `boolean` | `true` | Keep the spoken word visible (skipped while focus is in the strip). |
 * | `(valueChange)` | `[number, number]` | - | New in/out after a boundary click (React `onValueChange`). |
 * | `(seek)` | `number` | - | Word start, in seek mode (React `onSeek`). |
 *
 * ## Accessibility
 *
 * Every word is a real button (`type="button"`, safe inside forms). The strip
 * is one tab stop (roving tabindex): Tab enters on the last focused word, else
 * the word at the playhead; Arrow keys move word by word, Home and End jump to
 * the ends; Enter or Space activates. The mode is a single-select toggle group
 * that always keeps one mode pressed. The words sit in a `role="group"`
 * labelled by `labels.group`.
 *
 * The clip never relies on color alone: the first and last words carry a
 * `--primary` border on the outer side, and each in-clip word has hidden text
 * (`clip start`, `in clip`, `clip end`, overridable in `labels`). The spoken
 * word is underlined and has `aria-current="true"`.
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--primary` | in-range word background (15%, 25% on hover), clip edge borders |
 * | `--accent` | hover |
 * | `--ring` | focus ring |
 * | `--foreground` / `--border` | word text and strip border |
 */

const TEXT =
  'Good morning everyone. Thanks for having me. Today we talk about labor law and where it came from.';
const WORDS: TimelineWord[] = TEXT.split(' ').map((w, i) => ({
  w,
  start: i * 0.5,
  end: i * 0.5 + 0.4,
  speaker: i < 3 ? 'host' : 'guest',
}));

/** Controlled wrapper, like the React story's: keeps value and shows it. */
@Component({
  selector: 'gr-word-timeline-controlled',
  standalone: true,
  imports: [WordTimeline],
  template: `
    <div class="flex w-[520px] flex-col gap-2">
      <gr-word-timeline
        [words]="words()"
        [(value)]="value"
        [currentTime]="currentTime()"
        [speakerNames]="speakerNames()"
        [labels]="labels()"
      />
      <code
        data-slot="word-timeline-demo-value"
        class="text-xs text-muted-foreground"
      >
        in {{ value()[0].toFixed(2) }} s, out {{ value()[1].toFixed(2) }} s
      </code>
    </div>
  `,
})
class WordTimelineControlled implements OnInit {
  readonly words = input<TimelineWord[]>(WORDS);
  readonly initial = input<[number, number]>([1.5, 4.4]);
  readonly currentTime = input<number | undefined>(undefined);
  readonly speakerNames = input<Record<string, string> | undefined>(undefined);
  readonly labels = input<Partial<WordTimelineLabels>>({});
  readonly value = signal<[number, number]>([1.5, 4.4]);

  ngOnInit(): void {
    this.value.set(this.initial());
  }
}

const meta: Meta<WordTimeline> = {
  title: 'Layout & display/Display/WordTimeline',
  component: WordTimeline,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [WordTimelineControlled] })],
};

export default meta;
type Story = StoryObj<WordTimeline>;

/** Workbench preset, same args as the React edition. */
export const Workbench: Story = {
  args: {
    words: WORDS,
    value: [1.5, 4.4],
    currentTime: 2.1,
    speakerNames: { host: 'Host', guest: 'Guest' },
  },
  render: (args) => ({
    props: args,
    template: `
      <gr-word-timeline-controlled
        [words]="words"
        [initial]="value"
        [currentTime]="currentTime"
        [speakerNames]="speakerNames"
      />
    `,
  }),
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
      clipStart: 'início do trecho',
      clipEnd: 'fim do trecho',
      inClip: 'no trecho',
    },
  },
  render: (args) => ({
    props: args,
    template: `
      <gr-word-timeline-controlled
        [words]="words"
        [initial]="value"
        [speakerNames]="speakerNames"
        [labels]="labels"
      />
    `,
  }),
};
