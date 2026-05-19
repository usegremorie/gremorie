import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';

import { PromptInput } from './prompt-input';
import { cn } from './utils';

export type PromptInputButtonVariant = 'ghost' | 'subtle';
export type PromptInputButtonSize = 'sm' | 'md';

@Component({
  selector: 'prompt-input-button',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="buttonClass()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-pressed]="ariaPressed()"
      [attr.title]="title() || ariaLabel()"
      [disabled]="isDisabled()"
      (click)="handleClick($event)"
    >
      <ng-content />
    </button>
  `,
})
export class PromptInputButton {
  /**
   * Parent context is optional — the button works as a standalone toolbar
   * action even if used outside of a <prompt-input>.
   */
  private readonly parent = inject(PromptInput, { optional: true });

  readonly disabled = input<boolean>(false);
  readonly variant = input<PromptInputButtonVariant>('ghost');
  readonly size = input<PromptInputButtonSize>('md');
  readonly pressed = input<boolean | null>(null);
  readonly ariaLabel = input.required<string>();
  readonly title = input<string>('');

  readonly pressedChange = output<MouseEvent>();

  protected readonly isDisabled = computed(
    () => this.disabled() || (this.parent?.disabled() ?? false),
  );

  protected readonly ariaPressed = computed(() => {
    const value = this.pressed();
    return value === null ? null : value ? 'true' : 'false';
  });

  protected readonly buttonClass = computed(() => {
    const base = cn(
      'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md',
      'text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      'disabled:pointer-events-none disabled:opacity-50',
    );

    const sizeMap: Record<PromptInputButtonSize, string> = {
      sm: 'size-7 [&_svg]:size-3.5',
      md: 'size-9 [&_svg]:size-4',
    };

    const variantMap: Record<PromptInputButtonVariant, string> = {
      ghost:
        'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
      subtle:
        'bg-muted text-foreground hover:bg-accent hover:text-accent-foreground',
    };

    return cn(base, sizeMap[this.size()], variantMap[this.variant()]);
  });

  handleClick(event: MouseEvent): void {
    this.pressedChange.emit(event);
  }
}
