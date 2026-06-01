import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { BrnTooltip, type BrnTooltipPosition } from '@spartan-ng/brain/tooltip';

/**
 * MessageAction — single icon-button slot inside `<message-actions>`.
 *
 * Mirrors React `MessageAction` (rx-ai): a ghost-style icon button with
 * an optional tooltip. When `tooltip` is set, wraps the button with
 * Spartan-ng `BrnTooltip` directive (CDK overlay-backed) so the user
 * gets the same affordance as the React side.
 *
 * Children are projected as the icon content. `label` is rendered as
 * sr-only text so the button has an accessible name when only an icon
 * is shown.
 *
 * Pairs with `<message-actions>` (row container).
 */
@Component({
  selector: 'message-action',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrnTooltip, NgClass],
  template: `
    <button
      type="button"
      [disabled]="disabled()"
      [attr.aria-label]="accessibleName()"
      [brnTooltip]="tooltip() ?? null"
      [tooltipDisabled]="tooltipDisabledResolved()"
      [position]="position()"
      [ngClass]="buttonClass()"
    >
      <ng-content />
      <span class="sr-only">{{ accessibleName() }}</span>
    </button>
  `,
})
export class MessageAction {
  /** Optional tooltip text shown on hover/focus via BrnTooltip. */
  readonly tooltip = input<string | null | undefined>(null);

  /** Tooltip side (default 'top'), matches rx-ai TooltipContent side. */
  readonly side = input<BrnTooltipPosition>('top');

  /**
   * Accessible label rendered as sr-only inside the button. Falls back
   * to `tooltip` so a single prop covers both cases.
   */
  readonly label = input<string | null | undefined>(null);

  /** Visual variant (default 'ghost' to match rx-ai default). */
  readonly variant = input<'ghost' | 'outline' | 'default'>('ghost');

  /** Button size (default 'icon-sm'). */
  readonly size = input<'icon-sm' | 'icon' | 'sm'>('icon-sm');

  /** Disable tooltip without removing it from the API surface. */
  readonly disabled = input<boolean>(false);

  /** Alias used internally by BrnTooltip directive. */
  protected readonly position = computed(() => this.side());

  /** Hide tooltip when no text was provided or the button is disabled. */
  protected readonly tooltipDisabledResolved = computed(
    () => !this.tooltip() || this.disabled(),
  );

  protected readonly accessibleName = computed(
    () => this.label() ?? this.tooltip() ?? '',
  );

  protected readonly buttonClass = computed(() => {
    const v = this.variant();
    const s = this.size();
    return [
      'inline-flex items-center justify-center gap-1.5 rounded-md',
      'whitespace-nowrap text-sm font-medium transition-colors',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      v === 'ghost'
        ? 'bg-transparent hover:bg-accent hover:text-accent-foreground'
        : '',
      v === 'outline'
        ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
        : '',
      v === 'default'
        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
        : '',
      s === 'icon-sm' ? 'h-7 w-7' : '',
      s === 'icon' ? 'h-9 w-9' : '',
      s === 'sm' ? 'h-8 px-3' : '',
    ]
      .filter(Boolean)
      .join(' ');
  });
}
