import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { cn } from '@gremorie/ng-core';

import { PromptInput } from './prompt-input';

@Component({
  selector: 'prompt-input-textarea',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <textarea
      #textarea
      data-slot="input-group-control"
      [class]="textareaClass()"
      [value]="parent.value()"
      [disabled]="isDisabled()"
      [attr.aria-disabled]="isDisabled() ? 'true' : null"
      [attr.aria-label]="ariaLabel()"
      [placeholder]="placeholder()"
      [rows]="rows()"
      [attr.maxlength]="maxLength() ?? null"
      [attr.data-state]="parent.state()"
      aria-multiline="true"
      (input)="handleInput($event)"
    ></textarea>
  `,
  host: {
    // The textarea itself must be the flex child of the composer column
    // (React renders it as a direct InputGroup child).
    class: 'contents',
  },
})
export class PromptInputTextarea implements AfterViewInit, OnDestroy {
  protected readonly parent = inject(PromptInput);

  @ViewChild('textarea', { static: true })
  private readonly textareaRef!: ElementRef<HTMLTextAreaElement>;

  readonly placeholder = input<string>('Ask anything…');
  readonly rows = input<number>(1);
  readonly maxLength = input<number | null>(null);
  readonly ariaLabel = input<string>('Prompt');
  readonly maxHeightPx = input<number>(192); // 12rem default

  protected readonly isDisabled = (): boolean =>
    this.parent.disabled() || this.parent.state() === 'submitted';

  // React renders Textarea (rx-forms) + the rx-ai InputGroupTextarea and
  // PromptInputTextarea overrides. Keep the three strings in lock-step with
  // `packages/rx-forms/src/lib/textarea/textarea.tsx`,
  // `packages/rx-forms/src/lib/input-group/input-group.tsx` and
  // `packages/rx-ai/src/lib/prompt-input/prompt-input.tsx`.
  protected readonly textareaClass = () =>
    cn(
      'flex field-sizing-content min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
      'flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent',
      'field-sizing-content max-h-48 min-h-16',
    );

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    // With native `field-sizing: content` the CSS `min-h-16`/`max-h-48` pair
    // drives sizing (matching React); an inline height would freeze it.
    if (!this.hasFieldSizingSupport()) {
      this.applyMaxHeight();
      this.autoExpand(); // initial fit
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.hasFieldSizingSupport()) {
      this.autoExpand();
    }
  }

  handleInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.parent.value.set(target.value);
    if (!this.hasFieldSizingSupport()) {
      this.autoExpand();
    }
  }

  focus(): void {
    this.textareaRef.nativeElement.focus();
  }

  blur(): void {
    this.textareaRef.nativeElement.blur();
  }

  private applyMaxHeight(): void {
    const el = this.textareaRef.nativeElement;
    el.style.maxHeight = `${this.maxHeightPx()}px`;
  }

  private autoExpand(): void {
    const el = this.textareaRef.nativeElement;
    el.style.height = 'auto';
    const next = Math.min(el.scrollHeight, this.maxHeightPx());
    el.style.height = `${next}px`;
  }

  private hasFieldSizingSupport(): boolean {
    return (
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('field-sizing', 'content')
    );
  }
}
