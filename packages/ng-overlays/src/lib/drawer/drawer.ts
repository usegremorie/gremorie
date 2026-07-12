import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnSheet,
  BrnSheetClose,
  BrnSheetDescription,
  BrnSheetTitle,
  BrnSheetTrigger,
} from '@spartan-ng/brain/sheet';
import { cn } from '@gremorie/ng-core';

type DrawerDirection = 'top' | 'bottom' | 'left' | 'right';

/**
 * Drawer — bottom-up sheet for mobile contexts. Mirrors React `Drawer` from
 * `@gremorie/rx-overlays`, which is built on `vaul`.
 *
 * Slides up from the bottom by default. Best for mobile confirmations, quick
 * actions, and simple forms. On `md`+ prefer Dialog (focused) or Sheet (longer
 * flow). The recommended responsive pattern is conditional: Drawer below `md`,
 * Dialog or Sheet above.
 *
 * Anatomy: `gr-drawer` (root) → `gr-drawer-trigger` + a
 * `<ng-template brnSheetContent>` wrapping `gr-drawer-content` (which renders
 * the `mx-auto` drag-handle) → `gr-drawer-header` / `gr-drawer-footer` /
 * `gr-drawer-title` / `gr-drawer-description` / `gr-drawer-close`.
 *
 * Divergence vs. React: there is **no Angular `vaul`**. The Angular edition is
 * built on the spartan brain **Sheet** (`BrnSheet`), locked to the requested
 * `direction` via the brain `side` input. Native drag-to-dismiss / momentum
 * gestures from vaul are **not** reproduced. To preserve the React Tailwind
 * class strings verbatim, `gr-drawer-content` sets a
 * `data-vaul-drawer-direction` attribute itself and applies the same
 * `data-[vaul-drawer-direction=...]` and `group/drawer-content` classes — so the
 * directional layout and the bottom-only drag-handle visual match React exactly.
 * Default `direction` is `bottom`.
 *
 * @example
 * ```html
 * <gr-drawer direction="bottom">
 *   <button gr-drawer-trigger>Open</button>
 *   <ng-template brnSheetContent>
 *     <gr-drawer-content direction="bottom">
 *       <gr-drawer-header>
 *         <h2 gr-drawer-title>Title</h2>
 *         <p gr-drawer-description>Description</p>
 *       </gr-drawer-header>
 *       <gr-drawer-footer />
 *     </gr-drawer-content>
 *   </ng-template>
 * </gr-drawer>
 * ```
 */
@Component({
  selector: 'gr-drawer',
  standalone: true,
  hostDirectives: [{ directive: BrnSheet, inputs: ['side'] }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'drawer', class: 'contents' },
})
export class Drawer {}

/**
 * DrawerTrigger — opens the drawer. Mirrors React `DrawerTrigger`. Renders a
 * `<button brnSheetTrigger>` that resolves the ancestor `BrnSheet` via DI.
 */
@Component({
  selector: 'gr-drawer-trigger, button[gr-drawer-trigger]',
  standalone: true,
  hostDirectives: [BrnSheetTrigger],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'drawer-trigger' },
})
export class DrawerTrigger {}

/**
 * DrawerContent — the styled panel + drag handle. Mirrors React
 * `DrawerContent`. Place inside `<ng-template brnSheetContent>`. Renders the
 * `mx-auto` handle that is only visible for the `bottom` direction (matching
 * React's `group-data-[vaul-drawer-direction=bottom]` rule).
 */
@Component({
  selector: 'gr-drawer-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
    ></div>
    <ng-content />
  `,
  host: {
    'data-slot': 'drawer-content',
    '[attr.data-vaul-drawer-direction]': 'direction()',
    '[class]': 'hostClass()',
  },
})
export class DrawerContent {
  readonly class = input<string>();
  /** Edge the drawer slides from. Mirrors vaul `direction` (default `bottom`). */
  readonly direction = input<DrawerDirection>('bottom');
  protected readonly hostClass = computed(() =>
    cn(
      'group/drawer-content fixed z-50 flex h-auto flex-col bg-background',
      'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b',
      'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t',
      'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm',
      'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm',
      this.class(),
    ),
  );
}

/** DrawerHeader — title/description stack. Mirrors React `DrawerHeader`. */
@Component({
  selector: 'gr-drawer-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'drawer-header',
    '[class]': 'hostClass()',
  },
})
export class DrawerHeader {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left',
      this.class(),
    ),
  );
}

/** DrawerFooter — bottom-anchored action row. Mirrors React `DrawerFooter`. */
@Component({
  selector: 'gr-drawer-footer',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'drawer-footer',
    '[class]': 'hostClass()',
  },
})
export class DrawerFooter {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('mt-auto flex flex-col gap-2 p-4', this.class()),
  );
}

/** DrawerTitle — accessible heading. Mirrors React `DrawerTitle`. */
@Component({
  selector: 'gr-drawer-title, [gr-drawer-title]',
  standalone: true,
  hostDirectives: [BrnSheetTitle],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'drawer-title',
    '[class]': 'hostClass()',
  },
})
export class DrawerTitle {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('font-semibold text-foreground', this.class()),
  );
}

/** DrawerDescription — supporting copy. Mirrors React `DrawerDescription`. */
@Component({
  selector: 'gr-drawer-description, [gr-drawer-description]',
  standalone: true,
  hostDirectives: [BrnSheetDescription],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'drawer-description',
    '[class]': 'hostClass()',
  },
})
export class DrawerDescription {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('text-sm text-muted-foreground', this.class()),
  );
}

/**
 * DrawerClose — dismisses the drawer. Mirrors React `DrawerClose`. Renders a
 * `<button brnSheetClose>` for consumer-placed close actions.
 */
@Component({
  selector: 'gr-drawer-close, button[gr-drawer-close]',
  standalone: true,
  hostDirectives: [BrnSheetClose],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'drawer-close' },
})
export class DrawerClose {}
