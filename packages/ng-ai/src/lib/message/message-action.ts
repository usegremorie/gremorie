import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import type { BrnTooltipPosition } from '@spartan-ng/brain/tooltip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/ng-overlays';

/**
 * MessageAction — single icon-button slot inside `<message-actions>`.
 *
 * Mirrors React `MessageAction` (rx-ai): a ghost-style icon button with
 * an optional tooltip. When `tooltip` is set, the button is wrapped in the
 * styled `gn-tooltip` compound from `@gremorie/ng-overlays` (the same
 * primitive the React side uses from `@gremorie/rx-overlays`), so the
 * surface matches the styled tooltip (popover card + arrow), not the bare
 * brain overlay.
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
  imports: [
    NgClass,
    NgTemplateOutlet,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  ],
  template: `
    <ng-template #btn>
      <button
        type="button"
        [disabled]="disabled()"
        [attr.aria-label]="accessibleName()"
        [ngClass]="buttonClass()"
      >
        <ng-content />
        <span class="sr-only">{{ accessibleName() }}</span>
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
export class MessageAction {
  /** Optional tooltip text shown on hover/focus via the styled gn-tooltip. */
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

  /** Disables the button (and with it the tooltip trigger). */
  readonly disabled = input<boolean>(false);

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
