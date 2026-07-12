import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnDialog,
  BrnDialogClose,
  BrnDialogDescription,
  BrnDialogTitle,
  BrnDialogTrigger,
} from '@spartan-ng/brain/dialog';
import { cn } from '@gremorie/ng-core';

/**
 * Dialog — modal overlay anchored at viewport center. Mirrors React `Dialog`
 * from `@gremorie/rx-overlays`, which wraps Radix Dialog. Behavior is delegated
 * to the spartan brain `BrnDialog` host directive (CDK overlay).
 *
 * Use Dialog for focused decisions or short flows that interrupt the user's
 * context — confirmations, single-step forms, detail cards. For longer flows
 * use Sheet; for inline contextual content use Popover.
 *
 * Anatomy: `gr-dialog` (root, hosts `brnDialog`) → `gr-dialog-trigger`
 * (`<button brnDialogTrigger>`) + `<ng-template brnDialogContent>` wrapping
 * `gr-dialog-content` (the styled panel) → `gr-dialog-header` /
 * `gr-dialog-footer` / `gr-dialog-title` / `gr-dialog-description` /
 * `gr-dialog-close`.
 *
 * Divergence vs. React/Radix: Radix renders content through a portal that is a
 * direct child of the JSX tree, so React composes `DialogContent` inline.
 * `@spartan-ng/brain` renders content from a `<ng-template brnDialogContent>`
 * into a CDK overlay — so the consumer wraps the panel markup in that template
 * (see `@example`). `DialogPortal` / `DialogOverlay` are not exposed as Angular
 * parts: the brain `BrnDialog` owns the backdrop/overlay, and `gr-dialog-content`
 * carries the overlay panel classes (the React overlay's `bg-black/50` backdrop
 * is the brain default backdrop). The internal close button is rendered eagerly
 * inside `gr-dialog-content` when `showCloseButton` is true, matching React.
 *
 * @example
 * ```html
 * <gr-dialog>
 *   <button gr-dialog-trigger>Open</button>
 *   <ng-template brnDialogContent>
 *     <gr-dialog-content>
 *       <gr-dialog-header>
 *         <h2 gr-dialog-title>Title</h2>
 *         <p gr-dialog-description>Description</p>
 *       </gr-dialog-header>
 *       <gr-dialog-footer />
 *     </gr-dialog-content>
 *   </ng-template>
 * </gr-dialog>
 * ```
 */
@Component({
  selector: 'gr-dialog',
  standalone: true,
  hostDirectives: [{ directive: BrnDialog, inputs: ['closeOnBackdropClick'] }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'dialog', class: 'contents' },
})
export class Dialog {}

/**
 * DialogTrigger — opens the dialog. Mirrors React `DialogTrigger`. Renders a
 * `<button brnDialogTrigger>` that resolves the ancestor `BrnDialog` via DI.
 */
@Component({
  selector: 'gr-dialog-trigger, button[gr-dialog-trigger]',
  standalone: true,
  hostDirectives: [BrnDialogTrigger],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'dialog-trigger' },
})
export class DialogTrigger {}

/**
 * DialogContent — the styled center panel. Mirrors React `DialogContent`.
 * Place inside a `<ng-template brnDialogContent>`. When `showCloseButton` is
 * true (default) it renders the lucide `X` close button wired to
 * `brnDialogClose`.
 */
@Component({
  selector: 'gr-dialog-content',
  standalone: true,
  imports: [BrnDialogClose],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    @if (showCloseButton()) {
      <button
        type="button"
        brnDialogClose
        data-slot="dialog-close"
        class="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span class="sr-only">Close</span>
      </button>
    }
  `,
  host: {
    'data-slot': 'dialog-content',
    '[class]': 'hostClass()',
  },
})
export class DialogContent {
  readonly class = input<string>();
  /** Whether to render the internal close button. Mirrors React `showCloseButton`. */
  readonly showCloseButton = input<boolean>(true);
  protected readonly hostClass = computed(() =>
    cn(
      'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg',
      this.class(),
    ),
  );
}

/** DialogHeader — vertical stack for title + description. Mirrors React `DialogHeader`. */
@Component({
  selector: 'gr-dialog-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'dialog-header',
    '[class]': 'hostClass()',
  },
})
export class DialogHeader {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('flex flex-col gap-2 text-center sm:text-left', this.class()),
  );
}

/**
 * DialogFooter — action row. Mirrors React `DialogFooter`. When
 * `showCloseButton` is true it appends an outline "Close" button wired to
 * `brnDialogClose` (React delegates this to the Button primitive).
 */
@Component({
  selector: 'gr-dialog-footer',
  standalone: true,
  imports: [BrnDialogClose],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content />
    @if (showCloseButton()) {
      <button
        type="button"
        brnDialogClose
        class="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50"
      >
        Close
      </button>
    }
  `,
  host: {
    'data-slot': 'dialog-footer',
    '[class]': 'hostClass()',
  },
})
export class DialogFooter {
  readonly class = input<string>();
  /** Whether to append an outline "Close" button. Mirrors React `showCloseButton`. */
  readonly showCloseButton = input<boolean>(false);
  protected readonly hostClass = computed(() =>
    cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', this.class()),
  );
}

/** DialogTitle — accessible heading. Mirrors React `DialogTitle`. */
@Component({
  selector: 'gr-dialog-title, [gr-dialog-title]',
  standalone: true,
  hostDirectives: [BrnDialogTitle],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'dialog-title',
    '[class]': 'hostClass()',
  },
})
export class DialogTitle {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('text-lg leading-none font-semibold', this.class()),
  );
}

/** DialogDescription — supporting copy. Mirrors React `DialogDescription`. */
@Component({
  selector: 'gr-dialog-description, [gr-dialog-description]',
  standalone: true,
  hostDirectives: [BrnDialogDescription],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'dialog-description',
    '[class]': 'hostClass()',
  },
})
export class DialogDescription {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('text-sm text-muted-foreground', this.class()),
  );
}

/**
 * DialogClose — dismisses the dialog. Mirrors React `DialogClose`. Renders a
 * `<button brnDialogClose>` for consumer-placed close actions.
 */
@Component({
  selector: 'gr-dialog-close, button[gr-dialog-close]',
  standalone: true,
  hostDirectives: [BrnDialogClose],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'dialog-close' },
})
export class DialogClose {}
