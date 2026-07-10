import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import type { BrnTooltipPosition } from '@spartan-ng/brain/tooltip';
import { cva } from 'class-variance-authority';
import { cn } from '@gremorie/ng-core';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/ng-overlays';

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
 * projects an icon and, when `tooltip` is set, wraps the button in the styled
 * `gn-tooltip` compound from `@gremorie/ng-overlays` (the same primitive the
 * React side uses from `@gremorie/rx-overlays`), so the surface matches the
 * styled tooltip (arrowless popover card), not the bare brain overlay. Reserve
 * the tooltip for non-critical hints.
 */
@Component({
  selector: 'prompt-input-button',
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
        [attr.type]="type()"
        [class]="buttonClass()"
        [disabled]="disabled()"
        [attr.aria-label]="ariaLabel() || null"
        (click)="pressed.emit($event)"
      >
        <ng-content />
      </button>
    </ng-template>

    @if (tooltip()) {
      <gn-tooltip-provider>
        <gn-tooltip [side]="side()">
          <gn-tooltip-trigger>
            <ng-container [ngTemplateOutlet]="btn" />
          </gn-tooltip-trigger>
          <gn-tooltip-content>{{ tooltip() }}</gn-tooltip-content>
        </gn-tooltip>
      </gn-tooltip-provider>
    } @else {
      <ng-container [ngTemplateOutlet]="btn" />
    }
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

  /** Tooltip side (default 'top', matching the React TooltipContent default). */
  readonly side = input<BrnTooltipPosition>('top');

  /** Class overrides merged onto the button. */
  readonly class = input<string>('');

  readonly pressed = output<MouseEvent>();

  protected readonly buttonClass = computed(() =>
    cn(
      buttonVariants({ variant: this.variant(), size: this.size() }),
      this.class(),
    ),
  );
}
