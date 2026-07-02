import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnAlertDialog,
  BrnAlertDialogDescription,
  BrnAlertDialogTitle,
  BrnAlertDialogTrigger,
} from '@spartan-ng/brain/alert-dialog';
import { BrnDialogClose } from '@spartan-ng/brain/dialog';
import {
  buttonVariants,
  cn,
  type ButtonSize,
  type ButtonVariant,
} from '@gremorie/ng-core';

/**
 * AlertDialog — modal-blocking confirmation dialog. Mirrors React `AlertDialog`
 * from `@gremorie/rx-overlays`, which wraps Radix AlertDialog. Behavior is
 * delegated to the spartan brain `BrnAlertDialog` host directive.
 *
 * Differs from Dialog in two ways: it is **modal + blocking** (no
 * close-on-overlay, no close-on-escape by default) and the user **must
 * choose**. Use only for moments where doing nothing would be wrong —
 * destructive confirmations, irreversible actions, account deletion.
 *
 * Anatomy: `gn-alert-dialog` (root) → `gn-alert-dialog-trigger` + a
 * `<ng-template brnAlertDialogContent>` wrapping `gn-alert-dialog-content`
 * (carries the `size` variant via `data-size`) → `gn-alert-dialog-header`
 * (+ optional `gn-alert-dialog-media`) / `gn-alert-dialog-footer` /
 * `gn-alert-dialog-title` / `gn-alert-dialog-description` /
 * `gn-alert-dialog-action` / `gn-alert-dialog-cancel`.
 *
 * Divergence vs. React/Radix: brain renders content from a
 * `<ng-template brnAlertDialogContent>` into a CDK overlay (no Radix portal),
 * so the consumer wraps the panel in that template. `AlertDialogAction` /
 * `AlertDialogCancel` delegate to the `Button` primitive in React; the Angular
 * `Button` (`ai-button`) renders its own inner `<button>` and cannot host the
 * brain `brnDialogClose` directive, so `gn-alert-dialog-action` /
 * `gn-alert-dialog-cancel` are real `<button brnDialogClose>` elements styled
 * with the shared `buttonVariants(...)` class string — identical visual parity,
 * default variants matched (action: `default`, cancel: `outline`).
 *
 * @example
 * ```html
 * <gn-alert-dialog>
 *   <button gn-alert-dialog-trigger>Delete</button>
 *   <ng-template brnAlertDialogContent>
 *     <gn-alert-dialog-content size="sm">
 *       <gn-alert-dialog-header>
 *         <h2 gn-alert-dialog-title>Are you sure?</h2>
 *         <p gn-alert-dialog-description>This cannot be undone.</p>
 *       </gn-alert-dialog-header>
 *       <gn-alert-dialog-footer>
 *         <button gn-alert-dialog-cancel>Cancel</button>
 *         <button gn-alert-dialog-action variant="destructive">Delete</button>
 *       </gn-alert-dialog-footer>
 *     </gn-alert-dialog-content>
 *   </ng-template>
 * </gn-alert-dialog>
 * ```
 */
@Component({
  selector: 'gn-alert-dialog',
  standalone: true,
  hostDirectives: [BrnAlertDialog],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'alert-dialog', class: 'contents' },
})
export class AlertDialog {}

/**
 * AlertDialogTrigger — opens the alert dialog. Mirrors React
 * `AlertDialogTrigger`. Renders a `<button brnAlertDialogTrigger>` that resolves
 * the ancestor `BrnAlertDialog` via DI.
 */
@Component({
  selector: 'gn-alert-dialog-trigger, button[gn-alert-dialog-trigger]',
  standalone: true,
  hostDirectives: [BrnAlertDialogTrigger],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'alert-dialog-trigger' },
})
export class AlertDialogTrigger {}

/**
 * AlertDialogContent — the styled center panel. Mirrors React
 * `AlertDialogContent`. Place inside `<ng-template brnAlertDialogContent>`. The
 * `size` input drives the `data-size` attribute and the responsive `max-w`
 * group classes, exactly as React.
 */
@Component({
  selector: 'gn-alert-dialog-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'alert-dialog-content',
    '[attr.data-size]': 'size()',
    '[class]': 'hostClass()',
  },
})
export class AlertDialogContent {
  readonly class = input<string>();
  /** Panel width preset. Mirrors React `size`. */
  readonly size = input<'default' | 'sm'>('default');
  protected readonly hostClass = computed(() =>
    cn(
      'group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[size=sm]:max-w-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[size=default]:sm:max-w-lg',
      this.class(),
    ),
  );
}

/** AlertDialogHeader — title/description grid. Mirrors React `AlertDialogHeader`. */
@Component({
  selector: 'gn-alert-dialog-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'alert-dialog-header',
    '[class]': 'hostClass()',
  },
})
export class AlertDialogHeader {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
      this.class(),
    ),
  );
}

/** AlertDialogFooter — action row. Mirrors React `AlertDialogFooter`. */
@Component({
  selector: 'gn-alert-dialog-footer',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'alert-dialog-footer',
    '[class]': 'hostClass()',
  },
})
export class AlertDialogFooter {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end',
      this.class(),
    ),
  );
}

/** AlertDialogTitle — accessible heading. Mirrors React `AlertDialogTitle`. */
@Component({
  selector: 'gn-alert-dialog-title, [gn-alert-dialog-title]',
  standalone: true,
  hostDirectives: [BrnAlertDialogTitle],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'alert-dialog-title',
    '[class]': 'hostClass()',
  },
})
export class AlertDialogTitle {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'text-lg font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
      this.class(),
    ),
  );
}

/** AlertDialogDescription — supporting copy. Mirrors React `AlertDialogDescription`. */
@Component({
  selector: 'gn-alert-dialog-description, [gn-alert-dialog-description]',
  standalone: true,
  hostDirectives: [BrnAlertDialogDescription],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'alert-dialog-description',
    '[class]': 'hostClass()',
  },
})
export class AlertDialogDescription {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('text-sm text-muted-foreground', this.class()),
  );
}

/** AlertDialogMedia — icon/illustration slot above the title. Mirrors React `AlertDialogMedia`. */
@Component({
  selector: 'gn-alert-dialog-media',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'alert-dialog-media',
    '[class]': 'hostClass()',
  },
})
export class AlertDialogMedia {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      "mb-2 inline-flex size-16 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-8",
      this.class(),
    ),
  );
}

/**
 * AlertDialogAction — confirms and closes. Mirrors React `AlertDialogAction`.
 * Real `<button brnDialogClose>` styled via `buttonVariants` (default variant).
 */
@Component({
  selector: 'gn-alert-dialog-action, button[gn-alert-dialog-action]',
  standalone: true,
  hostDirectives: [BrnDialogClose],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'alert-dialog-action',
    type: 'button',
    '[class]': 'hostClass()',
  },
})
export class AlertDialogAction {
  readonly class = input<string>();
  /** Button visual variant. Mirrors React `variant` (default: `default`). */
  readonly variant = input<ButtonVariant>('default');
  /** Button size preset. Mirrors React `size`. */
  readonly size = input<ButtonSize>('default');
  protected readonly hostClass = computed(() =>
    cn(
      buttonVariants({ variant: this.variant(), size: this.size() }),
      this.class(),
    ),
  );
}

/**
 * AlertDialogCancel — dismisses without acting. Mirrors React
 * `AlertDialogCancel`. Real `<button brnDialogClose>` styled via `buttonVariants`
 * (default variant: `outline`).
 */
@Component({
  selector: 'gn-alert-dialog-cancel, button[gn-alert-dialog-cancel]',
  standalone: true,
  hostDirectives: [BrnDialogClose],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'alert-dialog-cancel',
    type: 'button',
    '[class]': 'hostClass()',
  },
})
export class AlertDialogCancel {
  readonly class = input<string>();
  /** Button visual variant. Mirrors React `variant` (default: `outline`). */
  readonly variant = input<ButtonVariant>('outline');
  /** Button size preset. Mirrors React `size`. */
  readonly size = input<ButtonSize>('default');
  protected readonly hostClass = computed(() =>
    cn(
      buttonVariants({ variant: this.variant(), size: this.size() }),
      this.class(),
    ),
  );
}
