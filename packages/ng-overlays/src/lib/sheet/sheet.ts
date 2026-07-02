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

type SheetSide = 'top' | 'right' | 'bottom' | 'left';

/**
 * Sheet — side-anchored panel for longer flows. Mirrors React `Sheet` from
 * `@gremorie/rx-overlays`, which wraps Radix Dialog with a directional slide.
 * Behavior is delegated to the spartan brain `BrnSheet` host directive.
 *
 * Use for filters, settings panels, multi-section edit forms — content that
 * does not deserve full focus the way a Dialog does, but is too rich for a
 * Popover. `right` is the default; `left` for navigation; `bottom` for mobile;
 * `top` for global notifications.
 *
 * Anatomy: `gn-sheet` (root, hosts `brnSheet`, takes `side`) →
 * `gn-sheet-trigger` + `<ng-template brnSheetContent>` wrapping
 * `gn-sheet-content` (the styled panel) → `gn-sheet-header` / `gn-sheet-footer`
 * / `gn-sheet-title` / `gn-sheet-description` / `gn-sheet-close`.
 *
 * Divergence vs. React/Radix: brain renders content from a
 * `<ng-template brnSheetContent>` into a CDK overlay. The slide direction lives
 * on the brain `BrnSheet` root (`side` input) — React keeps `side` on
 * `SheetContent`. For class parity, `gn-sheet-content` also takes a `side`
 * input (default `right`) that drives the per-side Tailwind classes verbatim;
 * pass the same `side` to `gn-sheet` so the animation matches. `SheetPortal` /
 * `SheetOverlay` are not exposed as Angular parts (brain owns them).
 *
 * @example
 * ```html
 * <gn-sheet side="right">
 *   <button gn-sheet-trigger>Open</button>
 *   <ng-template brnSheetContent>
 *     <gn-sheet-content side="right">
 *       <gn-sheet-header>
 *         <h2 gn-sheet-title>Title</h2>
 *         <p gn-sheet-description>Description</p>
 *       </gn-sheet-header>
 *     </gn-sheet-content>
 *   </ng-template>
 * </gn-sheet>
 * ```
 */
@Component({
  selector: 'gn-sheet',
  standalone: true,
  hostDirectives: [{ directive: BrnSheet, inputs: ['side'] }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'sheet', class: 'contents' },
})
export class Sheet {}

/**
 * SheetTrigger — opens the sheet. Mirrors React `SheetTrigger`. Renders a
 * `<button brnSheetTrigger>` that resolves the ancestor `BrnSheet` via DI.
 */
@Component({
  selector: 'gn-sheet-trigger, button[gn-sheet-trigger]',
  standalone: true,
  hostDirectives: [BrnSheetTrigger],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'sheet-trigger' },
})
export class SheetTrigger {}

/**
 * SheetContent — the styled side panel. Mirrors React `SheetContent`. Place
 * inside `<ng-template brnSheetContent>`. When `showCloseButton` is true
 * (default) it renders the lucide `X` close button wired to `brnSheetClose`.
 */
@Component({
  selector: 'gn-sheet-content',
  standalone: true,
  imports: [BrnSheetClose],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    @if (showCloseButton()) {
      <button
        type="button"
        brnSheetClose
        class="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="size-4"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span class="sr-only">Close</span>
      </button>
    }
  `,
  host: {
    'data-slot': 'sheet-content',
    '[class]': 'hostClass()',
  },
})
export class SheetContent {
  readonly class = input<string>();
  /** Side the panel slides from (drives the per-side classes). Mirrors React `side`. */
  readonly side = input<SheetSide>('right');
  /** Whether to render the internal close button. Mirrors React `showCloseButton`. */
  readonly showCloseButton = input<boolean>(true);
  protected readonly hostClass = computed(() => {
    const side = this.side();
    return cn(
      'fixed z-50 flex flex-col gap-4 bg-background shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500',
      side === 'right' &&
        'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
      side === 'left' &&
        'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
      side === 'top' &&
        'inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
      side === 'bottom' &&
        'inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
      this.class(),
    );
  });
}

/** SheetHeader — title/description stack. Mirrors React `SheetHeader`. */
@Component({
  selector: 'gn-sheet-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sheet-header',
    '[class]': 'hostClass()',
  },
})
export class SheetHeader {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('flex flex-col gap-1.5 p-4', this.class()),
  );
}

/** SheetFooter — bottom-anchored action row. Mirrors React `SheetFooter`. */
@Component({
  selector: 'gn-sheet-footer',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sheet-footer',
    '[class]': 'hostClass()',
  },
})
export class SheetFooter {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('mt-auto flex flex-col gap-2 p-4', this.class()),
  );
}

/** SheetTitle — accessible heading. Mirrors React `SheetTitle`. */
@Component({
  selector: 'gn-sheet-title, [gn-sheet-title]',
  standalone: true,
  hostDirectives: [BrnSheetTitle],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sheet-title',
    '[class]': 'hostClass()',
  },
})
export class SheetTitle {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('font-semibold text-foreground', this.class()),
  );
}

/** SheetDescription — supporting copy. Mirrors React `SheetDescription`. */
@Component({
  selector: 'gn-sheet-description, [gn-sheet-description]',
  standalone: true,
  hostDirectives: [BrnSheetDescription],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'sheet-description',
    '[class]': 'hostClass()',
  },
})
export class SheetDescription {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('text-sm text-muted-foreground', this.class()),
  );
}

/**
 * SheetClose — dismisses the sheet. Mirrors React `SheetClose`. Renders a
 * `<button brnSheetClose>` for consumer-placed close actions.
 */
@Component({
  selector: 'gn-sheet-close, button[gn-sheet-close]',
  standalone: true,
  hostDirectives: [BrnSheetClose],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'sheet-close' },
})
export class SheetClose {}
