import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnHoverCard,
  BrnHoverCardTrigger,
} from '@spartan-ng/brain/hover-card';
import { cn } from '@gremorie/ng-core';

/**
 * HoverCard — preview pane shown on hover (non-interactive). Mirrors React
 * `HoverCard` from `@gremorie/rx-overlays`, which wraps Radix HoverCard.
 *
 * Use to **preview** content the user can fully open with a click — user
 * profile cards on `@mentions`, link previews, image teasers. Never put
 * critical info or interactive controls inside a HoverCard — those belong in
 * a Popover (click-driven, intentional).
 *
 * Anatomy: `gn-hover-card` (root) → `gn-hover-card-trigger` (hover target) +
 * `<ng-template brnHoverCardContent>` wrapping `gn-hover-card-content`.
 *
 * Divergence vs. React/Radix: Radix renders content through a Portal child of
 * the root, and exposes `openDelay`/`closeDelay` on the root plus
 * `align`/`sideOffset` on the content. `@spartan-ng/brain` renders content
 * from a `<ng-template brnHoverCardContent>` referenced by the trigger via
 * `brnHoverCardTriggerFor`, and carries the timing/positioning inputs
 * (`showDelay`, `hideDelay`, `align`, `sideOffset`) on the trigger. The
 * compound content anatomy inside the template is identical.
 *
 * @example
 * ```html
 * <gn-hover-card>
 *   <gn-hover-card-trigger [brnHoverCardTriggerFor]="content">@gremorie</gn-hover-card-trigger>
 *   <ng-template #content brnHoverCardContent>
 *     <gn-hover-card-content>The Gremorie design system.</gn-hover-card-content>
 *   </ng-template>
 * </gn-hover-card>
 * ```
 */
@Component({
  selector: 'gn-hover-card',
  standalone: true,
  hostDirectives: [BrnHoverCard],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'hover-card',
    class: 'contents',
  },
})
export class HoverCard {}

/**
 * HoverCardTrigger — the hover target. Mirrors React `HoverCardTrigger`.
 * Carries the brain `brnHoverCardTrigger` directive and exposes its
 * `brnHoverCardTriggerFor` (the `<ng-template brnHoverCardContent>` ref),
 * `align` and `sideOffset` inputs straight through, so consumers bind them on
 * `gn-hover-card-trigger` directly (same names as React content `align` /
 * `sideOffset`). No re-declaration needed.
 */
@Component({
  selector: 'gn-hover-card-trigger',
  standalone: true,
  hostDirectives: [
    {
      directive: BrnHoverCardTrigger,
      inputs: ['brnHoverCardTriggerFor', 'align', 'sideOffset'],
    },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'hover-card-trigger',
  },
})
export class HoverCardTrigger {}

/**
 * HoverCardContent — the styled overlay surface. Mirrors React
 * `HoverCardContent`. Place inside a `<ng-template brnHoverCardContent>`; the
 * brain hover card renders the template into a CDK overlay. Tailwind classes
 * match React verbatim.
 */
@Component({
  selector: 'gn-hover-card-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'hover-card-content',
    '[class]': 'hostClass()',
  },
})
export class HoverCardContent {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'z-50 w-64 origin-(--radix-hover-card-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      this.class(),
    ),
  );
}
