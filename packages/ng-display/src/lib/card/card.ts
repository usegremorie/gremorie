import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Card — surface primitive for grouping related content. Mirrors React
 * `Card` from `@gremorie/rx-display`.
 *
 * Compound surface: a rounded surface with a structured
 * `Header → Content → Footer` rhythm. Each sub-component is a thin
 * styled host element; the API is composable, not configurative — you
 * opt in to the parts you need.
 *
 * The `has-data-[slot=card-action]:grid` host class flips layout to a
 * grid when a `gr-card-action` is present, so the action lands top-right
 * without disturbing the default flex stack.
 *
 * @example
 * ```html
 * <gr-card>
 *   <gr-card-header>
 *     <gr-card-title>Notifications</gr-card-title>
 *     <gr-card-description>You have 3 unread messages.</gr-card-description>
 *   </gr-card-header>
 *   <gr-card-content>...</gr-card-content>
 *   <gr-card-footer>...</gr-card-footer>
 * </gr-card>
 * ```
 */
@Component({
  selector: 'gr-card',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'card',
    class:
      'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm has-data-[slot=card-action]:grid',
  },
})
export class Card {}

/**
 * CardHeader — header block of a Card. Mirrors React `CardHeader`.
 *
 * Uses a self-contained grid with auto rows so title and description
 * stack cleanly; reserves a column for `gr-card-action` when present.
 */
@Component({
  selector: 'gr-card-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'card-header',
    class:
      '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
  },
})
export class CardHeader {}

/**
 * CardTitle — title text inside a CardHeader. Mirrors React `CardTitle`.
 */
@Component({
  selector: 'gr-card-title',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'card-title',
    class: 'leading-none font-semibold',
  },
})
export class CardTitle {}

/**
 * CardDescription — secondary text inside a CardHeader. Mirrors React
 * `CardDescription`.
 */
@Component({
  selector: 'gr-card-description',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'card-description',
    class: 'text-muted-foreground text-sm',
  },
})
export class CardDescription {}

/**
 * CardAction — top-right action slot inside a CardHeader. Mirrors React
 * `CardAction`. The host Card flips to grid layout when this is present
 * so the action lands at column 2 row 1.
 */
@Component({
  selector: 'gr-card-action',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'card-action',
    class: 'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
  },
})
export class CardAction {}

/**
 * CardContent — primary body slot. Mirrors React `CardContent`.
 */
@Component({
  selector: 'gr-card-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'card-content',
    class: 'px-6',
  },
})
export class CardContent {}

/**
 * CardFooter — footer block. Mirrors React `CardFooter`. When the prior
 * sibling has `.border-t`, pads to keep the visual rhythm.
 */
@Component({
  selector: 'gr-card-footer',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'card-footer',
    class: 'flex items-center px-6 [.border-t]:pt-6',
  },
})
export class CardFooter {}
