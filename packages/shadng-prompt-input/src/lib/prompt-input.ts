import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  output,
  ViewEncapsulation,
} from '@angular/core';

import {
  PromptInputSize,
  PromptInputState,
  PromptInputSubmitEvent,
  PromptInputVariant,
} from './prompt-input.types';
import { cn } from './utils';

@Component({
  selector: 'prompt-input',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'form',
    '[class]': 'hostClass()',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.data-state]': 'state()',
    '[attr.data-disabled]': 'disabled() ? "" : null',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class PromptInput {
  private readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef);

  readonly value = model<string>('');

  readonly state = input<PromptInputState>('ready');
  readonly size = input<PromptInputSize>('md');
  readonly variant = input<PromptInputVariant>('default');
  readonly disabled = input<boolean>(false);
  readonly submitOnEnter = input<boolean>(true);
  readonly ariaLabel = input<string>('AI prompt input');

  readonly submitted = output<PromptInputSubmitEvent>();
  readonly canceled = output<void>();
  readonly retried = output<void>();

  readonly hostClass = computed(() => {
    const sizeMap: Record<PromptInputSize, string> = {
      sm: 'gap-1.5 p-2.5 text-sm',
      md: 'gap-2 p-3 text-sm',
      lg: 'gap-3 p-4 text-base',
    };
    const variantMap: Record<PromptInputVariant, string> = {
      default: 'border border-input bg-background',
      ghost: 'border border-transparent bg-transparent',
      bordered: 'border-2 border-input bg-background',
    };
    return cn(
      'flex w-full flex-col rounded-md transition-colors',
      'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
      sizeMap[this.size()],
      variantMap[this.variant()],
      this.state() === 'error' && 'border-destructive focus-within:ring-destructive',
      this.disabled() && 'pointer-events-none opacity-50',
    );
  });

  handleKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    const isEnter = event.key === 'Enter';
    const isMod = event.metaKey || event.ctrlKey;

    if (isEnter && isMod) {
      event.preventDefault();
      this.submit();
      return;
    }

    if (isEnter && !event.shiftKey && this.submitOnEnter()) {
      event.preventDefault();
      this.submit();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.handleEscape();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleGlobalKeydown(event: KeyboardEvent): void {
    const isMod = event.metaKey || event.ctrlKey;
    if (isMod && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.focusTextarea();
    }
  }

  submit(): void {
    if (this.disabled()) {
      return;
    }

    const currentState = this.state();

    if (currentState === 'streaming') {
      this.canceled.emit();
      return;
    }

    if (currentState === 'error') {
      this.retried.emit();
      return;
    }

    const event: PromptInputSubmitEvent = {
      value: this.value(),
      preventDefault: () => {
        /* Consumer can short-circuit clearing/UI by calling this. */
      },
    };
    this.submitted.emit(event);
  }

  clear(): void {
    this.value.set('');
  }

  focusTextarea(): void {
    const textarea = this.elementRef.nativeElement.querySelector('textarea');
    textarea?.focus();
  }

  private handleEscape(): void {
    const currentState = this.state();
    if (currentState === 'streaming') {
      this.canceled.emit();
      return;
    }
    this.clear();
  }
}
