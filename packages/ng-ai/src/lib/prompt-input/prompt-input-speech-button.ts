import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { BrnTooltip, type BrnTooltipPosition } from '@spartan-ng/brain/tooltip';
import { cn } from '@gremorie/ng-core';

import { PromptInput } from './prompt-input';

// Minimal portable Web Speech API surface (not standardized across browsers).
interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((ev: Event) => unknown) | null;
  onend: ((ev: Event) => unknown) | null;
  onerror: ((ev: Event) => unknown) | null;
  onresult: ((ev: SpeechRecognitionResultEventLike) => unknown) | null;
}

interface SpeechRecognitionResultEventLike extends Event {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: { transcript: string };
    };
  };
}

type SpeechRecognitionCtor = { new (): SpeechRecognitionLike };

type WindowWithSpeech = Window & {
  SpeechRecognition?: SpeechRecognitionCtor;
  webkitSpeechRecognition?: SpeechRecognitionCtor;
};

const baseClass =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-transparent text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50';

/**
 * PromptInputSpeechButton — microphone button wired to the Web Speech API.
 *
 * Mirrors React `PromptInputSpeechButton`: toggles browser speech recognition and
 * appends the final transcript to the parent `PromptInput`'s value. APPROXIMATION:
 * recognition is created lazily on first click (rather than in an effect) and the
 * transcript is written through `parent.value` instead of dispatching a synthetic
 * input event on a textarea ref. The button self-disables when the browser lacks
 * `SpeechRecognition`. Behaviour parity for capture/append is preserved; review if
 * exact streaming-interim semantics are required.
 */
@Component({
  selector: 'prompt-input-speech-button',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrnTooltip],
  template: `
    <button
      type="button"
      [class]="buttonClass()"
      aria-label="Toggle voice input"
      [attr.aria-pressed]="listening()"
      [disabled]="!supported()"
      [brnTooltip]="tooltip() ?? null"
      [tooltipDisabled]="!tooltip()"
      [position]="side()"
      (click)="toggle()"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-4"
      >
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    </button>
  `,
  host: { class: 'inline-flex' },
})
export class PromptInputSpeechButton {
  private readonly parent = inject(PromptInput, { optional: true });

  readonly tooltip = input<string | null | undefined>(null);
  readonly side = input<BrnTooltipPosition>('top');
  readonly lang = input<string>('en-US');

  protected readonly listening = signal(false);
  protected readonly supported = signal(this.detectSupport());

  private recognition: SpeechRecognitionLike | null = null;

  protected readonly buttonClass = computed(() =>
    cn(
      baseClass,
      'transition-all duration-200',
      this.listening() && 'animate-pulse bg-accent text-accent-foreground',
    ),
  );

  private detectSupport(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    const w = window as WindowWithSpeech;
    return Boolean(w.SpeechRecognition ?? w.webkitSpeechRecognition);
  }

  private ensureRecognition(): SpeechRecognitionLike | null {
    if (this.recognition || typeof window === 'undefined') {
      return this.recognition;
    }
    const w = window as WindowWithSpeech;
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!Ctor) {
      return null;
    }
    const rec = new Ctor();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = this.lang();
    rec.onstart = () => this.listening.set(true);
    rec.onend = () => this.listening.set(false);
    rec.onerror = () => this.listening.set(false);
    rec.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result?.isFinal) {
          finalTranscript += result[0]?.transcript ?? '';
        }
      }
      if (finalTranscript && this.parent) {
        const current = this.parent.value();
        this.parent.value.set(current + (current ? ' ' : '') + finalTranscript);
      }
    };
    this.recognition = rec;
    return rec;
  }

  toggle(): void {
    const rec = this.ensureRecognition();
    if (!rec) {
      return;
    }
    if (this.listening()) {
      rec.stop();
    } else {
      rec.start();
    }
  }
}
