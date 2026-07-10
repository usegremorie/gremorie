import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from './utils';

/**
 * The Button primitive — used across Gremorie NG components and freely composable
 * by consumers. Exposes 6 visual variants and 4 size presets to keep parity
 * between Gremorie's Angular and React editions. (See NOTICE.md for attribution.)
 */
const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline bg-transparent',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>['variant']
>;
export type ButtonSize = NonNullable<
  VariantProps<typeof buttonVariants>['size']
>;

@Component({
  selector: 'ai-button',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      [attr.type]="type()"
      [class]="buttonClass()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-pressed]="ariaPressed()"
      [attr.title]="title() || null"
      [disabled]="disabled()"
      (click)="handleClick($event)"
    >
      <ng-content />
    </button>
  `,
})
export class Button {
  readonly variant = input<ButtonVariant>('default');
  readonly size = input<ButtonSize>('default');
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly disabled = input<boolean>(false);
  readonly pressed = input<boolean | null>(null);
  readonly ariaLabel = input<string>('');
  readonly title = input<string>('');

  readonly pressedChange = output<MouseEvent>();

  protected readonly ariaPressed = computed(() => {
    const value = this.pressed();
    return value === null ? null : value ? 'true' : 'false';
  });

  // cn (tailwind-merge) collapses intra-variant conflicts the same way the
  // React edition's cn() does (e.g. the destructive focus-visible ring
  // overriding the base ring-ring), keeping the winning classes identical.
  protected readonly buttonClass = computed(() =>
    cn(buttonVariants({ variant: this.variant(), size: this.size() })),
  );

  handleClick(event: MouseEvent): void {
    this.pressedChange.emit(event);
  }
}

export { buttonVariants };
