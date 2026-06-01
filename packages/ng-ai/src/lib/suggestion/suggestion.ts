import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

export type SuggestionVariant = 'default' | 'outline' | 'ghost' | 'secondary';

export type SuggestionSize = 'sm' | 'md' | 'lg';

/**
 * Suggestion — clickable chip. Mirrors React `Suggestion`.
 *
 * Emits `(selected)` carrying the `value` (which equals the React
 * `suggestion` prop). Visual = rounded-full button with outline variant by
 * default.
 */
@Component({
  selector: 'suggestion',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" [class]="buttonClass()" (click)="handleClick()">
      <ng-content>{{ value() }}</ng-content>
    </button>
  `,
  host: {
    class: 'inline-flex',
  },
})
export class Suggestion {
  /** The suggestion value emitted on click. Mirrors React `suggestion`. */
  readonly value = input.required<string>();
  readonly variant = input<SuggestionVariant>('outline');
  readonly size = input<SuggestionSize>('sm');

  readonly selected = output<string>();

  protected readonly buttonClass = computed(() => {
    const sizeClass: Record<SuggestionSize, string> = {
      sm: 'h-8 px-4 text-xs',
      md: 'h-9 px-4 text-sm',
      lg: 'h-10 px-5 text-sm',
    };
    const variantClass: Record<SuggestionVariant, string> = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline:
        'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
      ghost: 'text-foreground hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    };
    return cn(
      'inline-flex cursor-pointer items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      sizeClass[this.size()],
      variantClass[this.variant()],
    );
  });

  protected handleClick(): void {
    this.selected.emit(this.value());
  }
}
