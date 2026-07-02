import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { BrnTooltip, type BrnTooltipPosition } from '@spartan-ng/brain/tooltip';
import { cva } from 'class-variance-authority';
import { cn } from '@gremorie/ng-core';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        ghost:
          'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
        outline:
          'border border-input border-solid bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground',
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      },
      size: {
        'icon-sm': 'size-8',
        icon: 'size-9',
        sm: 'h-8 px-3',
      },
    },
    defaultVariants: { variant: 'ghost', size: 'icon-sm' },
  },
);

/**
 * PromptInputButton — generic in-composer icon button with an optional tooltip.
 *
 * Mirrors React `PromptInputButton` (rx-ai): a ghost-style action button that
 * projects an icon and, when `tooltip` is set, surfaces it via the Spartan brain
 * `brnTooltip` directive (CDK overlay) — the same affordance the React side gets
 * from its `TooltipProvider`. Reserve the tooltip for non-critical hints.
 */
@Component({
  selector: 'prompt-input-button',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrnTooltip],
  template: `
    <button
      [attr.type]="type()"
      [class]="buttonClass()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      [brnTooltip]="tooltip() ?? null"
      [tooltipDisabled]="tooltipDisabledResolved()"
      [position]="position()"
      (click)="pressed.emit($event)"
    >
      <ng-content />
    </button>
  `,
})
export class PromptInputButton {
  readonly variant = input<'ghost' | 'outline' | 'default'>('ghost');
  readonly size = input<'icon-sm' | 'icon' | 'sm'>('icon-sm');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input<boolean>(false);
  readonly ariaLabel = input<string>('');

  /** Optional hover/focus tooltip text. */
  readonly tooltip = input<string | null | undefined>(null);

  /** Tooltip side (default 'top'). */
  readonly side = input<BrnTooltipPosition>('top');

  /** Class overrides merged onto the button. */
  readonly class = input<string>('');

  readonly pressed = output<MouseEvent>();

  protected readonly position = computed(() => this.side());

  protected readonly tooltipDisabledResolved = computed(
    () => !this.tooltip() || this.disabled(),
  );

  protected readonly buttonClass = computed(() =>
    cn(
      buttonVariants({ variant: this.variant(), size: this.size() }),
      this.class(),
    ),
  );
}
