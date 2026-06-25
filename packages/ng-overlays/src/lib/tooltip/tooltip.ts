import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  inject,
  InjectionToken,
  input,
  Signal,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { BrnTooltip } from '@spartan-ng/brain/tooltip';
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

/** Context shared from `gn-tooltip` down to its `gn-tooltip-trigger`. */
interface TooltipRootState {
  readonly content: Signal<TemplateRef<void> | undefined>;
  readonly position: Signal<BrnTooltipPosition>;
  readonly showDelay: Signal<number>;
  readonly hideDelay: Signal<number>;
}
const TOOLTIP_ROOT = new InjectionToken<TooltipRootState>('TooltipRoot');

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
      <div data-slot="tooltip-content" [class]="contentClass()">
        <ng-content />
        <span
          class="z-50 size-2.5 translate-y-[calc(-50%_-_3px)] rotate-45 rounded-[2px] border-r border-b bg-popover fill-popover"
        ></span>
      </div>
    </ng-template>
  `,
  host: {
    class: 'contents',
  },
})
export class TooltipContent {
  readonly class = input<string>();

  /** The captured surface template, consumed by the parent `gn-tooltip`. */
  @ViewChild('tpl', { static: true }) readonly template!: TemplateRef<void>;

  protected readonly contentClass = computed(() =>
    cn(
      'z-50 w-fit origin-(--radix-tooltip-content-transform-origin) animate-in rounded-md border bg-popover px-3 py-1.5 text-xs text-balance text-popover-foreground shadow-md fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      this.class(),
    ),
  );
}

/**
 * TooltipTrigger — the hover/focus target carrying the brain `brnTooltip`
 * directive. Mirrors React `TooltipTrigger`. Reads the content template and
 * positioning/timing from the owning `gn-tooltip` and binds them declaratively.
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
      class="contents"
    >
      <ng-content />
    </span>
  `,
  host: {
    'data-slot': 'tooltip-trigger',
    class: 'contents',
  },
})
export class TooltipTrigger {
  protected readonly root = inject(TOOLTIP_ROOT, { optional: true });
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
      }),
      deps: [Tooltip],
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
