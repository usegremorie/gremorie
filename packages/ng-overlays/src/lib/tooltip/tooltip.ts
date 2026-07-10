import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  forwardRef,
  inject,
  InjectionToken,
  input,
  Signal,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnTooltip,
  provideBrnTooltipDefaultOptions,
} from '@spartan-ng/brain/tooltip';
import type { BrnTooltipPosition } from '@spartan-ng/brain/tooltip';
import { cn } from '@gremorie/ng-core';

/**
 * Tooltip — short non-essential context on hover/focus. Mirrors React
 * `Tooltip` from `@gremorie/rx-overlays`, which wraps Radix Tooltip.
 *
 * Reserve tooltips for non-critical supporting information — keyboard
 * shortcuts, icon labels, "what does this control do" hints. Touch users may
 * not be able to trigger a tooltip; keyboard users only see one when the
 * trigger holds focus. Critical info belongs visibly in the layout.
 *
 * Anatomy (compound parts kept for API parity with React/Radix):
 * `gn-tooltip-provider` → `gn-tooltip` (root) → `gn-tooltip-trigger`
 * (the hover/focus target) + `gn-tooltip-content` (the styled surface,
 * projected as a template).
 *
 * Divergence vs. React/Radix: Radix is a compound of Provider/Root/Trigger/
 * Content with a shared delay context on the Provider. `@spartan-ng/brain`'s
 * tooltip is a SINGLE directive (`brnTooltip`) placed on the trigger element;
 * the content (string or `TemplateRef`) is passed via the `brnTooltip` input,
 * and timing is configured per-directive via `showDelay`/`hideDelay`. To keep
 * the React API surface, this edition provides all four compound parts:
 * `gn-tooltip-provider` is a no-op pass-through container (there is no shared
 * delay context to host — delay lives per `gn-tooltip`), `gn-tooltip` shares
 * the projected `gn-tooltip-content` template + positioning/timing with its
 * `gn-tooltip-trigger` through a small context token, and the trigger binds
 * them declaratively onto the brain `brnTooltip` directive. The React
 * `tooltip-content` Tailwind classes are applied verbatim to the surface.
 *
 * @example
 * ```html
 * <gn-tooltip-provider>
 *   <gn-tooltip>
 *     <gn-tooltip-trigger>
 *       <button type="button">Hover</button>
 *     </gn-tooltip-trigger>
 *     <gn-tooltip-content>Add to library</gn-tooltip-content>
 *   </gn-tooltip>
 * </gn-tooltip-provider>
 * ```
 */

/** Context shared from `gn-tooltip` down to its trigger and content parts. */
interface TooltipRootState {
  readonly content: Signal<TemplateRef<void> | undefined>;
  readonly position: Signal<BrnTooltipPosition>;
  readonly showDelay: Signal<number>;
  readonly hideDelay: Signal<number>;
  readonly sideOffset: Signal<number>;
}
const TOOLTIP_ROOT = new InjectionToken<TooltipRootState>('TooltipRoot');

/**
 * The brain tooltip positions the overlay a fixed 8px from the trigger (see
 * `BRN_TOOLTIP_POSITIONS_MAP` in `@spartan-ng/brain/tooltip`); there is no
 * offset input. The surface compensates with a CSS `translate` so the visual
 * gap equals the React `sideOffset` (default 4).
 */
const BRN_FIXED_OFFSET = 8;

@Component({
  selector: 'gn-tooltip-provider',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'tooltip-provider',
    class: 'contents',
  },
})
export class TooltipProvider {
  /**
   * Mirrors React `delayDuration`. Brain has no shared delay context, so this
   * is documented for parity but applied per-`gn-tooltip` via `delayDuration`.
   */
  readonly delayDuration = input<number>(0);
}

/**
 * TooltipContent — the styled surface. Mirrors React `TooltipContent`. Its
 * projected content is captured as a template and rendered by the brain
 * tooltip directive; React's `tooltip-content` Tailwind classes are applied
 * to the rendered wrapper verbatim.
 */
@Component({
  selector: 'gn-tooltip-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #tpl>
      <div
        data-slot="tooltip-content"
        [class]="contentClass()"
        [style.translate]="surfaceTranslate()"
      >
        <ng-content />
      </div>
    </ng-template>
  `,
  host: {
    class: 'contents',
  },
})
export class TooltipContent {
  protected readonly root = inject(TOOLTIP_ROOT, { optional: true });

  readonly class = input<string>();

  /** The captured surface template, consumed by the parent `gn-tooltip`. */
  @ViewChild('tpl', { static: true }) readonly template!: TemplateRef<void>;

  protected readonly contentClass = computed(() =>
    cn(
      'z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-md border bg-popover px-3 py-1.5 text-xs text-balance text-popover-foreground shadow-md fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      this.class(),
    ),
  );

  /**
   * Nudges the surface back toward the trigger so the visual gap equals the
   * requested `sideOffset` (React parity: 4px) instead of the brain's fixed
   * 8px. Uses the standalone CSS `translate` property so it composes with the
   * transform-based enter/exit animations. NOTE: computed from the PREFERRED
   * side; if the brain flips the panel at a viewport edge the nudge points
   * the other way (worst case: the 8px gap grows to 12px).
   */
  protected readonly surfaceTranslate = computed(() => {
    const delta = BRN_FIXED_OFFSET - (this.root?.sideOffset() ?? 4);
    if (delta === 0) {
      return null;
    }
    switch (this.root?.position() ?? 'top') {
      case 'bottom':
        return `0 ${-delta}px`;
      case 'left':
        return `${delta}px 0`;
      case 'right':
        return `${-delta}px 0`;
      default:
        return `0 ${delta}px`;
    }
  });
}

/**
 * TooltipTrigger — the hover/focus target carrying the brain `brnTooltip`
 * directive. Mirrors React `TooltipTrigger`. Reads the content template and
 * positioning/timing from the owning `gn-tooltip` and binds them declaratively.
 *
 * The inner span carrying `brnTooltip` is the CDK overlay's position origin,
 * so it MUST produce a real box: `display: contents` elements report an
 * empty `getBoundingClientRect()`, which pins the tooltip panel to the
 * viewport corner instead of the trigger. It defaults to `inline-flex`
 * (visually neutral around the inline icon buttons all current consumers
 * wrap); block-ish consumers can override via the `class` input, e.g.
 * `class="flex w-full items-center gap-2 min-w-0"`.
 */
@Component({
  selector: 'gn-tooltip-trigger',
  standalone: true,
  imports: [BrnTooltip],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [brnTooltip]="root?.content() ?? ''"
      [position]="root?.position() ?? 'top'"
      [showDelay]="root?.showDelay() ?? 0"
      [hideDelay]="root?.hideDelay() ?? 0"
      [class]="triggerClass()"
    >
      <ng-content />
    </span>
  `,
  host: {
    'data-slot': 'tooltip-trigger',
    // The host stays out of layout; the inline style keeps `display: contents`
    // deterministic even if a consumer-provided static class also lands here.
    class: 'contents',
    style: 'display: contents',
  },
  providers: [
    // The brain content component ships its own arrow span + svg polygon.
    // Both editions are arrowless by design, so hide it here (there is no
    // input to remove it from the brain template).
    provideBrnTooltipDefaultOptions({
      arrowClasses: () => 'hidden',
      svgClasses: 'hidden',
    }),
  ],
})
export class TooltipTrigger {
  protected readonly root = inject(TOOLTIP_ROOT, { optional: true });

  /**
   * Class for the inner element that anchors the overlay. Must keep a real
   * box (never `contents`). Default `inline-flex` hugs inline triggers.
   */
  readonly class = input<string>();

  protected readonly triggerClass = computed(() =>
    cn('inline-flex', this.class()),
  );
}

/**
 * Tooltip — the root that shares the projected `gn-tooltip-content` template
 * and positioning/timing with its `gn-tooltip-trigger`. Mirrors React
 * `Tooltip`.
 */
@Component({
  selector: 'gn-tooltip',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'tooltip',
    class: 'contents',
  },
  providers: [
    {
      provide: TOOLTIP_ROOT,
      useFactory: (root: Tooltip): TooltipRootState => ({
        content: root.contentTemplate,
        position: root.side,
        showDelay: root.delayDuration,
        hideDelay: root.hideDelay,
        sideOffset: root.sideOffset,
      }),
      // forwardRef: the provider is declared inside Tooltip's own decorator,
      // and esbuild/AOT (Analog builds) reject the bare class reference here.
      deps: [forwardRef(() => Tooltip)],
    },
  ],
})
export class Tooltip {
  private readonly content = contentChild(TooltipContent);

  /** Distance from the trigger along the main axis. Mirrors React content `sideOffset`. */
  readonly sideOffset = input<number>(4);
  /** Preferred side. Mirrors React content `side`. */
  readonly side = input<BrnTooltipPosition>('top');
  /** Delay before showing. Mirrors React `TooltipProvider` `delayDuration`. */
  readonly delayDuration = input<number>(0);
  /** Delay before hiding. */
  readonly hideDelay = input<number>(0);

  /** The projected content's surface template, shared with the trigger. */
  readonly contentTemplate = computed(() => this.content()?.template);
}
