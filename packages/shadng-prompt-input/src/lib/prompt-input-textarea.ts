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

import { PromptInput } from './prompt-input';
import { cn } from './utils';

@Component({
  selector: 'prompt-input-textarea',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <textarea
      #textarea
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

  protected readonly textareaClass = () =>
    cn(
      'min-h-[2.5rem] w-full resize-none border-0 bg-transparent text-foreground',
      'placeholder:text-muted-foreground',
      'focus:outline-none focus-visible:outline-none',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'overflow-y-auto',
      'field-sizing-content',
    );

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.applyMaxHeight();
    this.autoExpand(); // initial fit

    // Fallback: on browsers without field-sizing, observe value changes
    if (!this.hasFieldSizingSupport()) {
      // No-op — auto-expand happens on input.
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.autoExpand();
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
