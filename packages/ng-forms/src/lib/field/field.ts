import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  forwardRef,
  inject,
  InjectionToken,
  input,
  OnDestroy,
  OnInit,
  signal,
  viewChild,
  type WritableSignal,
  ViewEncapsulation,
} from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@gremorie/ng-core';

import { LABEL_CLASS } from '../label/label';

/**
 * Field - the form-layout family. Angular parity port of the React `Field`
 * family from `@gremorie/rx-forms` (a port of shadcn/ui `Field`): it composes a
 * label, a control, helper text and a validation message into one accessible
 * unit, and groups units into sets.
 *
 * Parts (React name -> Angular selector): `Field` -> `gr-field`,
 * `FieldLabel` -> `gr-field-label`, `FieldTitle` -> `gr-field-title`,
 * `FieldDescription` -> `gr-field-description`, `FieldError` ->
 * `gr-field-error`, `FieldContent` -> `gr-field-content`, `FieldGroup` ->
 * `gr-field-group`, `FieldSet` -> `gr-field-set`, `FieldLegend` ->
 * `gr-field-legend`, `FieldSeparator` -> `gr-field-separator`.
 *
 * ## React -> Angular mapping
 *
 * - Every part except `FieldLabel` carries its `data-slot` and its classes on
 *   the host element, so the React sibling and child selectors keep working
 *   unchanged. The hosts are block-level through those classes.
 * - `FieldLabel` renders a native `<label>` inside a `display: contents` host,
 *   exactly like `gr-label`, so the whole box (a choice card) stays the click
 *   target. Its React `[&>[data-slot=field-label]]` selectors gain a
 *   `gr-field-label>` hop in the Field variants for that reason.
 * - `FieldSet` is `role="group"` labelled by its `FieldLegend` (the native
 *   `<fieldset>` + `<legend>` pairing, rebuilt with ARIA).
 * - `FieldError` takes `errors` or projected content; projected content wins,
 *   as in React (it is the `<ng-content>` fallback).
 * - `data-invalid` / `data-disabled` are plain attributes on `gr-field`,
 *   same as React: `<gr-field data-invalid="true">`.
 * - A selected choice card gets the `--primary` border and the `--accent`
 *   fill, both semantic tokens (no literal opacity). The radio item exposes
 *   `data-state` so the one selector `has-data-[state=checked]` serves React
 *   and Angular alike.
 *
 * @example
 * ```html
 * <gr-field>
 *   <gr-field-label for="email">Email</gr-field-label>
 *   <gr-input id="email" />
 *   <gr-field-description>We never share it.</gr-field-description>
 * </gr-field>
 * ```
 */

const fieldVariants = cva(
  'group/field flex w-full gap-3 data-[invalid=true]:text-destructive',
  {
    variants: {
      orientation: {
        vertical: [
          'flex-col [&>*]:w-full [&>.sr-only]:w-auto [&>gr-field-label>*]:w-full',
        ],
        horizontal: [
          'flex-row items-center',
          '[&>[data-slot=field-label]]:flex-auto [&>gr-field-label>[data-slot=field-label]]:flex-auto',
          'has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>gr-checkbox]:mt-px has-[>[data-slot=field-content]]:[&>gr-radio-group-item]:mt-px',
        ],
        responsive: [
          'flex-col @md/field-group:flex-row @md/field-group:items-center [&>*]:w-full @md/field-group:[&>*]:w-auto [&>.sr-only]:w-auto [&>gr-field-label>*]:w-full @md/field-group:[&>gr-field-label>*]:w-auto',
          '@md/field-group:[&>[data-slot=field-label]]:flex-auto @md/field-group:[&>gr-field-label>[data-slot=field-label]]:flex-auto',
          '@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>gr-checkbox]:mt-px @md/field-group:has-[>[data-slot=field-content]]:[&>gr-radio-group-item]:mt-px',
        ],
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  },
);

export type FieldOrientation = NonNullable<
  VariantProps<typeof fieldVariants>['orientation']
>;

export type FieldLegendVariant = 'legend' | 'label';

/** A validation error, the shape `FieldError` reads from `errors`. */
export interface FieldErrorItem {
  message?: string;
}

/** What a `FieldSet` shares with its `FieldLegend` (the legend labels it). */
interface FieldSetContext {
  readonly legendId: WritableSignal<string | null>;
}

const FIELD_SET = new InjectionToken<FieldSetContext>('FIELD_SET');

let fieldLegendId = 0;

/**
 * FieldSet - semantic grouping of related fields (a `role="group"` labelled by
 * its `FieldLegend`). Mirrors React `FieldSet`.
 */
@Component({
  selector: 'gr-field-set',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'field-set',
    role: 'group',
    '[attr.aria-labelledby]': 'legendId()',
    '[class]': 'computedClass()',
  },
  providers: [
    {
      provide: FIELD_SET,
      useExisting: forwardRef(() => FieldSet),
    },
  ],
})
export class FieldSet implements FieldSetContext {
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  /** Id of the projected `FieldLegend`, set by the legend itself. */
  readonly legendId = signal<string | null>(null);

  protected readonly computedClass = computed(() =>
    cn(
      // The gap lives in a variable so the legend can cancel it (see
      // FieldLegend): React's native <legend> sits outside the flex gap.
      'flex flex-col gap-(--field-set-gap) [--field-set-gap:calc(var(--spacing)*6)]',
      'has-[>[data-slot=checkbox-group]]:[--field-set-gap:calc(var(--spacing)*3)] has-[>[data-slot=radio-group]]:[--field-set-gap:calc(var(--spacing)*3)]',
      this.class(),
    ),
  );
}

/**
 * FieldLegend - the title of a `FieldSet`. `variant="legend"` is the larger
 * heading, `variant="label"` the smaller caption. Mirrors React `FieldLegend`.
 */
@Component({
  selector: 'gr-field-legend',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'field-legend',
    '[attr.data-variant]': 'variant()',
    '[attr.id]': 'id',
    '[class]': 'computedClass()',
  },
})
export class FieldLegend implements OnInit, OnDestroy {
  private readonly fieldSet = inject(FIELD_SET, { optional: true });

  protected readonly id = `gr-field-legend-${++fieldLegendId}`;

  /** Heading size. Mirrors React `variant`. */
  readonly variant = input<FieldLegendVariant>('legend');
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      // React renders a native <legend>, which is shrink-wrapped and outside
      // the fieldset's flex gap. Here it is a flex item, so it shrink-wraps
      // (w-fit) and its bottom margin is 0.75rem minus the set's gap: the
      // distance to the next item stays the legend's own mb-3, as in React.
      'block w-fit mb-[calc(var(--spacing)*3-var(--field-set-gap,0px))] font-medium',
      'data-[variant=legend]:text-base',
      'data-[variant=label]:text-sm',
      this.class(),
    ),
  );

  ngOnInit() {
    this.fieldSet?.legendId.set(this.id);
  }

  ngOnDestroy() {
    if (this.fieldSet?.legendId() === this.id) {
      this.fieldSet.legendId.set(null);
    }
  }
}

/**
 * FieldGroup - stacks `Field`s (and nested groups) and is the container query
 * root the `responsive` orientation reads. Mirrors React `FieldGroup`.
 */
@Component({
  selector: 'gr-field-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'field-group',
    '[class]': 'computedClass()',
  },
})
export class FieldGroup {
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4',
      this.class(),
    ),
  );
}

/**
 * Field - one control with its label, helper text and error. `orientation`
 * lays the parts out vertically (default), horizontally, or responsively
 * (vertical until its `FieldGroup` is `md` wide). Mirrors React `Field`.
 */
@Component({
  selector: 'gr-field',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'group',
    'data-slot': 'field',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
  },
})
export class Field {
  /** Layout of the parts. Mirrors React `orientation`. */
  readonly orientation = input<FieldOrientation>('vertical');
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(fieldVariants({ orientation: this.orientation() }), this.class()),
  );
}

/**
 * FieldContent - the column that holds a label and a description beside a
 * control in a horizontal `Field`. Mirrors React `FieldContent`.
 */
@Component({
  selector: 'gr-field-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'field-content',
    '[class]': 'computedClass()',
  },
})
export class FieldContent {
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'group/field-content flex flex-1 flex-col gap-1.5 leading-snug',
      this.class(),
    ),
  );
}

/**
 * FieldLabel - the label of a field. Wrapping a whole `Field` in it makes a
 * choice card: the card is one click target, the selected one takes the
 * `--primary` border and the `--accent` fill. Mirrors React `FieldLabel`.
 *
 * The host is `display: contents` (see `gr-label`): the native label carries
 * the box, so a passed `class` does not draw twice.
 */
@Component({
  selector: 'gr-field-label',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <label
      data-slot="field-label"
      [class]="labelClass()"
      [attr.for]="for() || null"
    >
      <ng-content />
    </label>
  `,
})
export class FieldLabel {
  /** Associates the label with a control `id`. Mirrors React `htmlFor`. */
  readonly for = input<string>('');
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly labelClass = computed(() =>
    cn(
      LABEL_CLASS,
      'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50',
      'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4',
      // Choice card: the border never changes; selection
      // and hover lift the fill (--accent), and keyboard focus draws the ring.
      'has-data-[state=checked]:bg-accent has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-accent',
      'has-[>[data-slot=field]]:has-[:focus-visible]:border-ring has-[>[data-slot=field]]:has-[:focus-visible]:ring-[3px] has-[>[data-slot=field]]:has-[:focus-visible]:ring-ring/50',
      this.class(),
    ),
  );
}

/**
 * FieldTitle - a label-looking title that is not a `<label>` (the heading of a
 * choice card's content). Mirrors React `FieldTitle`.
 */
@Component({
  selector: 'gr-field-title',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'field-label',
    '[class]': 'computedClass()',
  },
})
export class FieldTitle {
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50',
      this.class(),
    ),
  );
}

/**
 * FieldDescription - muted helper text for a field. Mirrors React
 * `FieldDescription`.
 */
@Component({
  selector: 'gr-field-description',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'field-description',
    '[class]': 'computedClass()',
  },
})
export class FieldDescription {
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly computedClass = computed(() =>
    cn(
      'block text-sm leading-normal font-normal text-muted-foreground group-has-[[data-orientation=horizontal]]/field:text-balance',
      'last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5',
      '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
      this.class(),
    ),
  );
}

/**
 * FieldSeparator - a rule between fields, with optional centered text.
 * Mirrors React `FieldSeparator`. The rule is drawn inline: ng-forms does not
 * depend on ng-display.
 */
@Component({
  selector: 'gr-field-separator',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      data-slot="separator"
      role="none"
      class="absolute inset-0 top-1/2 h-px w-full shrink-0 bg-border"
    ></div>
    <span
      #content
      data-slot="field-separator-content"
      class="relative mx-auto block w-fit bg-background px-2 text-muted-foreground empty:hidden"
      ><ng-content
    /></span>
  `,
  host: {
    'data-slot': 'field-separator',
    '[attr.data-content]': 'hasContent()',
    '[class]': 'computedClass()',
  },
})
export class FieldSeparator implements AfterContentChecked {
  private readonly content =
    viewChild.required<ElementRef<HTMLElement>>('content');

  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  /** Whether text was projected. Mirrors React `data-content`. */
  protected readonly hasContent = signal(false);

  protected readonly computedClass = computed(() =>
    cn(
      'relative block -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2',
      this.class(),
    ),
  );

  ngAfterContentChecked() {
    const filled = this.content().nativeElement.childNodes.length > 0;
    if (filled !== this.hasContent()) this.hasContent.set(filled);
  }
}

/**
 * FieldError - the validation message. Pass `errors` (one message renders as
 * text, several as a list) or project your own content, which wins over
 * `errors`. Empty, it is hidden. Mirrors React `FieldError`.
 */
@Component({
  selector: 'gr-field-error',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // The fallback of <ng-content> renders only when nothing is projected.
  template: `
    <ng-content>
      @if (messages().length === 1) {
        {{ messages()[0] }}
      } @else if (messages().length > 1) {
        <ul class="ml-4 flex list-disc flex-col gap-1">
          @for (message of messages(); track message) {
            <li>{{ message }}</li>
          }
        </ul>
      }
    </ng-content>
  `,
  host: {
    role: 'alert',
    'data-slot': 'field-error',
    '[class]': 'computedClass()',
  },
})
export class FieldError {
  /** Errors to show. Mirrors React `errors`. */
  readonly errors = input<ReadonlyArray<FieldErrorItem | undefined>>([]);
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  /** The unique, non-empty messages, in order. */
  protected readonly messages = computed(() => [
    ...new Set(
      this.errors()
        .map((error) => error?.message)
        .filter((message): message is string => !!message),
    ),
  ]);

  protected readonly computedClass = computed(() =>
    cn('block text-sm font-normal text-destructive empty:hidden', this.class()),
  );
}
