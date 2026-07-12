import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import type { BrnTooltipPosition } from '@spartan-ng/brain/tooltip';
import { cva } from 'class-variance-authority';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/ng-overlays';

import { PromptInput } from './prompt-input';

const buttonClass = cva(
  'inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-transparent text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
);

/**
 * PromptInputAttachButton — paperclip button that opens the OS file picker and
 * pushes the chosen files into the parent `PromptInput`.
 *
 * Mirrors React `PromptInputAttachButton`. React lifts the file input into the
 * `PromptInput` root; the Angular `PromptInput` instead exposes `addFiles()` plus
 * drag/paste intake, so this button owns a local hidden `<input type="file">` and
 * forwards the selection to the parent. Honours the parent's `acceptAttachments`
 * allowlist for the native picker. When `tooltip` is set, the button is wrapped
 * in the styled `gr-tooltip` compound from `@gremorie/ng-overlays`, matching the
 * React styled Tooltip surface.
 */
@Component({
  selector: 'prompt-input-attach-button',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  ],
  template: `
    <ng-template #btn>
      <button
        type="button"
        [class]="buttonClass"
        aria-label="Attach files"
        (click)="open()"
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
          <path
            d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
          />
        </svg>
      </button>
    </ng-template>

    @if (tooltip()) {
      <gr-tooltip-provider>
        <gr-tooltip [side]="side()">
          <gr-tooltip-trigger>
            <ng-container [ngTemplateOutlet]="btn" />
          </gr-tooltip-trigger>
          <gr-tooltip-content>{{ tooltip() }}</gr-tooltip-content>
        </gr-tooltip>
      </gr-tooltip-provider>
    } @else {
      <ng-container [ngTemplateOutlet]="btn" />
    }
    <input
      #fileInput
      type="file"
      class="hidden"
      [attr.accept]="accept()"
      [attr.multiple]="multiple() ? '' : null"
      aria-hidden="true"
      tabindex="-1"
      (change)="onChange($event)"
    />
  `,
  host: { class: 'inline-flex' },
})
export class PromptInputAttachButton {
  private readonly parent = inject(PromptInput, { optional: true });

  @ViewChild('fileInput', { static: true })
  private readonly fileInput!: ElementRef<HTMLInputElement>;

  readonly tooltip = input<string | null | undefined>(null);
  readonly side = input<BrnTooltipPosition>('top');
  readonly multiple = input<boolean>(true);

  protected readonly buttonClass = buttonClass();

  protected readonly accept = () => {
    const accept = this.parent?.acceptAttachments();
    return accept && accept.length > 0 ? accept.join(',') : null;
  };

  open(): void {
    this.fileInput.nativeElement.click();
  }

  onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.parent?.addFiles(Array.from(input.files));
    }
    input.value = '';
  }
}
