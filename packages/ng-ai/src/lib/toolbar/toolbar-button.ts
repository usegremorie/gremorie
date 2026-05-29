import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

export type ToolbarButtonVariant = 'ghost' | 'outline' | 'default';

/**
 * ToolbarButton — small action button for a toolbar row.
 *
 * Optional `pressed` mirrors a toggle state; emits `(pressedChange)` on
 * click so consumers can drive a controlled toggle group.
 */
@Component({
  selector: 'toolbar-button',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="buttonClass()"
      [disabled]="disabled()"
      [attr.aria-pressed]="pressed() ? 'true' : null"
      [attr.aria-label]="ariaLabel()"
      (click)="handleClick()"
    >
      <ng-content />
    </button>
  `,
  host: {
    class: 'inline-flex',
  },
})
export class ToolbarButton {
  readonly variant = input<ToolbarButtonVariant>('ghost');
  readonly pressed = input<boolean>(false);
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>();

  readonly clicked = output<void>();
  readonly pressedChange = output<boolean>();

  protected readonly buttonClass = computed(() => {
    const variantClass: Record<ToolbarButtonVariant, string> = {
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      outline: 'border border-input bg-background hover:bg-accent',
      default:
        'bg-primary text-primary-foreground hover:bg-primary/90',
    };
    return cn(
      'inline-flex size-8 items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
      variantClass[this.variant()],
      this.pressed() && 'bg-accent text-accent-foreground',
    );
  });

  protected handleClick(): void {
    this.clicked.emit();
    this.pressedChange.emit(!this.pressed());
  }
}
