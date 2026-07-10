import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  InjectionToken,
  input,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnAccordion,
  BrnAccordionContent,
  BrnAccordionHeader,
  BrnAccordionItem,
  BrnAccordionTrigger,
  injectBrnAccordion,
} from '@spartan-ng/brain/accordion';
import { cn } from '@gremorie/ng-core';

/**
 * Provides the root's `defaultValue` to descendant `gn-accordion-item`s so
 * each item can decide whether it should start opened — bridging React's
 * string-`value` model onto spartan brain's per-item `isOpened` flag.
 */
interface AccordionRootState {
  readonly defaultValue: () => string | string[] | undefined;
}
const ACCORDION_ROOT = new InjectionToken<AccordionRootState>('AccordionRoot');

/**
 * Accordion — vertical stack of expandable sections. Mirrors React `Accordion`
 * from `@gremorie/rx-display`, which wraps Radix Accordion. Behavior is
 * delegated to the spartan brain `BrnAccordion` host directive.
 *
 * Use `type="single"` for one-open-at-a-time (FAQ, settings groups);
 * `type="multiple"` when several sections may stay open at once.
 *
 * Anatomy: `gn-accordion` (root) → `gn-accordion-item` (one section, keyed by
 * `value`) → `gn-accordion-trigger` (header + chevron) + `gn-accordion-content`
 * (animated body).
 *
 * The `brnAccordion` directive lives on the HOST so content-projected
 * item/trigger/content directives can resolve it through the element injector.
 *
 * Divergence vs. React/Radix: Radix is controllable via `value` /
 * `onValueChange`; spartan brain drives open state through each item's
 * `isOpened` input rather than a root value. `defaultValue` (uncontrolled
 * initial open) is supported; full controlled `value` two-way binding is not
 * exposed here (use the item-level `isOpened` if needed).
 *
 * @example
 * ```html
 * <gn-accordion type="single" defaultValue="a" class="w-96">
 *   <gn-accordion-item value="a">
 *     <gn-accordion-trigger>Question</gn-accordion-trigger>
 *     <gn-accordion-content>Answer</gn-accordion-content>
 *   </gn-accordion-item>
 * </gn-accordion>
 * ```
 */
@Component({
  selector: 'gn-accordion',
  standalone: true,
  hostDirectives: [
    { directive: BrnAccordion, inputs: ['type', 'orientation'] },
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'accordion',
  },
  providers: [
    {
      provide: ACCORDION_ROOT,
      useFactory: (root: Accordion): AccordionRootState => ({
        defaultValue: () => root.defaultValue(),
      }),
      // forwardRef: the provider is declared inside Accordion's own decorator,
      // and esbuild (Analog/Vite builds) rejects the bare class reference here.
      deps: [forwardRef(() => Accordion)],
    },
  ],
})
export class Accordion {
  /** One vs. many open sections. Mirrors React `type`. */
  readonly type = input<'single' | 'multiple'>('single');
  /** Initially-open item(s), keyed by item `value`. Mirrors React `defaultValue`. */
  readonly defaultValue = input<string | string[] | undefined>(undefined);
}

/**
 * AccordionItem — one collapsible section, keyed by `value`. Mirrors React
 * `AccordionItem`. Computes the brain `isOpened` flag from the root
 * `defaultValue` and binds it to the host directive.
 */
@Component({
  selector: 'gn-accordion-item',
  standalone: true,
  hostDirectives: [{ directive: BrnAccordionItem, inputs: ['disabled'] }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'accordion-item',
    '[class]': 'computedClass()',
    '[attr.data-value]': 'value()',
  },
})
export class AccordionItem implements AfterViewInit {
  private readonly root = inject(ACCORDION_ROOT, { optional: true });
  private readonly brnItem = inject(BrnAccordionItem, { self: true });
  private readonly brnAccordion = injectBrnAccordion();

  /** Unique key for this section. Mirrors React `value`. */
  readonly value = input.required<string>();
  /** Whether the item starts opened (uncontrolled). Mirrors brain `isOpened`. */
  readonly isOpened = input<boolean>(false);
  /** Whether the item is disabled. */
  readonly disabled = input<boolean>(false);

  /** True when this item's own `isOpened` or the root `defaultValue` opens it. */
  protected readonly startsOpen = computed(() => {
    if (this.isOpened()) return true;
    const dv = this.root?.defaultValue();
    const value = this.value();
    return Array.isArray(dv) ? dv.includes(value) : dv === value;
  });

  protected readonly computedClass = computed(() =>
    cn('border-b last:border-b-0'),
  );

  ngAfterViewInit(): void {
    // `defaultValue` (and item-level `isOpened`) are uncontrolled initial
    // state: open the matching item once, after the brain accordion has
    // registered its triggers. The brain item exposes a stable numeric `id`
    // and the accordion an imperative `openItem(id)`.
    if (this.startsOpen()) {
      this.brnAccordion.openItem(this.brnItem.id);
    }
  }
}

/**
 * AccordionTrigger — the clickable header (renders the rotating chevron).
 * Mirrors React `AccordionTrigger`. Wraps a `<button brnAccordionTrigger>`
 * inside a `brnAccordionHeader` wrapper as the brain primitive requires.
 */
@Component({
  selector: 'gn-accordion-trigger',
  standalone: true,
  imports: [BrnAccordionTrigger, BrnAccordionHeader],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h3 class="flex" brnAccordionHeader>
      <button
        type="button"
        brnAccordionTrigger
        data-slot="accordion-trigger"
        class="flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180"
      >
        <ng-content />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
    </h3>
  `,
})
export class AccordionTrigger {}

/**
 * AccordionContent — the collapsible body (animated open/close). Mirrors React
 * `AccordionContent`. The brain content directive measures and animates it.
 */
@Component({
  selector: 'gn-accordion-content',
  standalone: true,
  imports: [BrnAccordionContent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      brnAccordionContent
      data-slot="accordion-content"
      class="overflow-hidden text-sm"
    >
      <div [class]="innerClass()"><ng-content /></div>
    </div>
  `,
})
export class AccordionContent {
  protected readonly innerClass = computed(() => cn('pt-0 pb-4'));
}
