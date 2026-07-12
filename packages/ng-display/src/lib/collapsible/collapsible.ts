import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  model,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnCollapsible,
  BrnCollapsibleContent,
  BrnCollapsibleTrigger,
} from '@spartan-ng/brain/collapsible';

/**
 * Collapsible — single-section expandable region. Mirrors React `Collapsible`
 * from `@gremorie/rx-display`, which wraps `@radix-ui/react-collapsible`.
 *
 * Three parts: `gr-collapsible` (Root), `gr-collapsible-trigger`,
 * `gr-collapsible-content`. The open/close behavior is delegated to the
 * spartan brain `BrnCollapsible` host directive — the Angular equivalent of
 * the Radix Collapsible.
 *
 * Use Collapsible when you have **one** thing that expands. For multiple
 * coordinated sections use Accordion (which is built on this primitive).
 *
 * `brnCollapsible` lives on the HOST (not an inner div) so the
 * content-projected trigger/content directives — whose injector chain runs
 * through this host element — can resolve their owning `BrnCollapsible`.
 *
 * @example
 * ```html
 * <gr-collapsible [(open)]="isOpen">
 *   <gr-collapsible-trigger>Toggle</gr-collapsible-trigger>
 *   <gr-collapsible-content>Hidden content</gr-collapsible-content>
 * </gr-collapsible>
 * ```
 */
@Component({
  selector: 'gr-collapsible',
  standalone: true,
  hostDirectives: [{ directive: BrnCollapsible, inputs: ['disabled'] }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'collapsible',
  },
})
export class Collapsible {
  /** The host BrnCollapsible — single source of truth for expanded state. */
  private readonly collapsible = inject(BrnCollapsible, { self: true });

  /** Two-way open state. Mirrors React `open` / `onOpenChange`. */
  readonly open = model<boolean>(false);
  /** Uncontrolled initial state. Mirrors React `defaultOpen`. */
  readonly defaultOpen = model<boolean>(false);

  constructor() {
    // Apply defaultOpen on init.
    effect(() => {
      const d = this.defaultOpen();
      untracked(() => this.open.set(d));
    });

    // Mirror public `open` onto host collapsible's `expanded` (and back).
    effect(() => {
      const o = this.open();
      untracked(() => {
        if (this.collapsible.expanded() !== o) this.collapsible.expanded.set(o);
      });
    });
    effect(() => {
      const e = this.collapsible.expanded();
      untracked(() => {
        if (this.open() !== e) this.open.set(e);
      });
    });
  }
}

/**
 * CollapsibleTrigger — clickable toggle for the Collapsible. Mirrors React
 * `CollapsibleTrigger`. Renders a `<button>` carrying the brain trigger
 * directive so a click toggles the owning collapsible.
 */
@Component({
  selector: 'gr-collapsible-trigger',
  standalone: true,
  imports: [BrnCollapsibleTrigger],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" brnCollapsibleTrigger data-slot="collapsible-trigger">
      <ng-content />
    </button>
  `,
})
export class CollapsibleTrigger {}

/**
 * CollapsibleContent — the collapsible body. Mirrors React
 * `CollapsibleContent`. The brain content directive measures and animates the
 * region open/closed.
 */
@Component({
  selector: 'gr-collapsible-content',
  standalone: true,
  imports: [BrnCollapsibleContent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div brnCollapsibleContent data-slot="collapsible-content">
      <ng-content />
    </div>
  `,
})
export class CollapsibleContent {}
