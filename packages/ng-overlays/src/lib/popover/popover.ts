import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { BrnPopover, BrnPopoverTrigger } from '@spartan-ng/brain/popover';
import { cn } from '@gremorie/ng-core';

/**
 * Popover — anchored interactive content overlay. Mirrors React `Popover`
 * from `@gremorie/rx-overlays`, which wraps Radix Popover.
 *
 * Triggers on click (intentional) and hosts interactive content — date
 * pickers, color pickers, mini forms, command palettes, share menus.
 * Distinct from Tooltip (hover-only, simple text label, never interactive)
 * and HoverCard (hover-only previews of non-critical content). When the
 * content is too long for a popover or warrants blocking the page, escalate
 * to Dialog or Sheet.
 *
 * Anatomy: `gr-popover` (root) → `gr-popover-trigger` (the button) +
 * `<ng-template brnPopoverContent>` wrapping `gr-popover-content` (the styled
 * surface). Optional parts: `gr-popover-anchor`, `gr-popover-header`,
 * `gr-popover-title`, `gr-popover-description`.
 *
 * Divergence vs. React/Radix: Radix renders content through a Portal child of
 * the root. `@spartan-ng/brain`'s popover renders its content from a
 * `<ng-template brnPopoverContent>` referenced by the trigger via
 * `brnPopoverTriggerFor` (CDK overlay). The consumer wires those two; the
 * compound content anatomy inside the template is identical.
 *
 * @example
 * ```html
 * <gr-popover>
 *   <gr-popover-trigger [content]="content">Open</gr-popover-trigger>
 *   <ng-template #content brnPopoverContent>
 *     <gr-popover-content>
 *       <gr-popover-header>
 *         <gr-popover-title>Dimensions</gr-popover-title>
 *         <gr-popover-description>Set the layout.</gr-popover-description>
 *       </gr-popover-header>
 *     </gr-popover-content>
 *   </ng-template>
 * </gr-popover>
 * ```
 */
@Component({
  selector: 'gr-popover',
  standalone: true,
  hostDirectives: [
    { directive: BrnPopover, inputs: ['align', 'sideOffset', 'offsetX'] },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'popover',
    class: 'contents',
  },
})
export class Popover {
  // `align` ('start' | 'center' | 'end'), `sideOffset` (number) and `offsetX`
  // (number) are exposed straight from the `BrnPopover` host directive (same
  // names as React `align` / `sideOffset`), so consumers bind them on
  // `gr-popover` directly. No re-declaration needed.
}

/**
 * PopoverTrigger — the click target that opens the popover. Mirrors React
 * `PopoverTrigger`. Renders a `<button [brnPopoverTriggerFor]>` taking the
 * `<ng-template brnPopoverContent>` ref as a required `content` input.
 */
@Component({
  selector: 'gr-popover-trigger',
  standalone: true,
  imports: [BrnPopoverTrigger],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" [brnPopoverTriggerFor]="content()">
      <ng-content />
    </button>
  `,
  host: {
    'data-slot': 'popover-trigger',
    class: 'contents',
  },
})
export class PopoverTrigger {
  /** Template ref of the `<ng-template brnPopoverContent>` to open. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly content = input.required<any>();
}

/**
 * PopoverContent — the styled overlay surface. Mirrors React `PopoverContent`.
 * Place inside a `<ng-template brnPopoverContent>`; the brain popover renders
 * the template into a CDK overlay. Tailwind classes match React verbatim.
 */
@Component({
  selector: 'gr-popover-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'popover-content',
    '[class]': 'hostClass()',
  },
})
export class PopoverContent {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
      this.class(),
    ),
  );
}

/**
 * PopoverAnchor — optional positioning anchor. Mirrors React `PopoverAnchor`.
 */
@Component({
  selector: 'gr-popover-anchor',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'popover-anchor',
    class: 'contents',
  },
})
export class PopoverAnchor {}

/**
 * PopoverHeader — title/description grouping. Mirrors React `PopoverHeader`.
 */
@Component({
  selector: 'gr-popover-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'popover-header',
    '[class]': 'hostClass()',
  },
})
export class PopoverHeader {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('flex flex-col gap-1 text-sm', this.class()),
  );
}

/**
 * PopoverTitle — the popover heading. Mirrors React `PopoverTitle`.
 */
@Component({
  selector: 'gr-popover-title',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'popover-title',
    '[class]': 'hostClass()',
  },
})
export class PopoverTitle {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('font-medium', this.class()),
  );
}

/**
 * PopoverDescription — supporting copy under the title. Mirrors React
 * `PopoverDescription`.
 */
@Component({
  selector: 'gr-popover-description',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'popover-description',
    '[class]': 'hostClass()',
  },
})
export class PopoverDescription {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('text-muted-foreground', this.class()),
  );
}
