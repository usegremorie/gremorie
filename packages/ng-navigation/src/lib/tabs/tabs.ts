import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  BrnTabs,
  BrnTabsContent,
  BrnTabsList,
  BrnTabsTrigger,
} from '@spartan-ng/brain/tabs';
import { cn } from '@gremorie/ng-core';

/**
 * Tabs — content switcher within a single view. Mirrors React `Tabs` from
 * `@gremorie/rx-navigation`, which wraps Radix Tabs. Behavior is delegated to
 * the spartan brain `BrnTabs` host directive.
 *
 * Two list variants: a pill-style `default` (rounded background) and a minimal
 * `line` indicator. Honors `orientation` so vertical tabs just work for
 * sidebar-like menus inside a single panel.
 *
 * Use Tabs for **mutually exclusive views of the same scope** —
 * Code/Preview, Overview/Details. For cross-section navigation use Sidebar or
 * NavigationMenu; for filters or formatting choices use ToggleGroup.
 *
 * Anatomy: `gr-tabs` (root) → `gr-tabs-list` (variant pill/line) →
 * `gr-tabs-trigger value="…"` + `gr-tabs-content value="…"`.
 *
 * Divergence vs. React/Radix: Radix's root `defaultValue` (uncontrolled) and
 * `value`/`onValueChange` (controlled) collapse onto brain's single `activeTab`
 * model. `defaultValue` seeds the initial active tab; a `value` input forwards
 * to it for controlled use. Triggers and content are matched by their `value`
 * string (brain's `triggerFor` / `contentFor`).
 *
 * @example
 * ```html
 * <gr-tabs defaultValue="overview" class="w-96">
 *   <gr-tabs-list>
 *     <gr-tabs-trigger value="overview">Overview</gr-tabs-trigger>
 *     <gr-tabs-trigger value="details">Details</gr-tabs-trigger>
 *   </gr-tabs-list>
 *   <gr-tabs-content value="overview">…</gr-tabs-content>
 *   <gr-tabs-content value="details">…</gr-tabs-content>
 * </gr-tabs>
 * ```
 */
@Component({
  selector: 'gr-tabs',
  standalone: true,
  hostDirectives: [{ directive: BrnTabs, inputs: ['orientation'] }],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'tabs',
    '[attr.data-orientation]': 'orientation()',
    '[class]': 'computedClass()',
  },
})
export class Tabs {
  private readonly brnTabs = inject(BrnTabs, { self: true });

  /** Tab layout direction. Mirrors React `orientation`. */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  /** Initially-active tab (uncontrolled). Mirrors React/Radix `defaultValue`. */
  readonly defaultValue = input<string | undefined>(undefined);
  /** Controlled active tab. Mirrors React/Radix `value`. */
  readonly value = input<string | undefined>(undefined);

  protected readonly computedClass = computed(() =>
    cn('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col'),
  );

  constructor() {
    // Seed brain's single `activeTab` model from Radix-style `value`
    // (controlled) falling back to `defaultValue` (uncontrolled initial).
    effect(() => {
      const next = this.value() ?? this.defaultValue();
      if (
        next !== undefined &&
        untracked(() => this.brnTabs.activeTab()) !== next
      ) {
        this.brnTabs.activeTab.set(next);
      }
    });
  }
}

const tabsListVariants = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none',
  {
    variants: {
      variant: {
        default: 'bg-muted',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * TabsList — the row/column of triggers. Mirrors React `TabsList`. The
 * `variant` switches between the pill (`default`) and minimal `line` look.
 */
@Component({
  selector: 'gr-tabs-list',
  standalone: true,
  hostDirectives: [BrnTabsList],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'tabs-list',
    '[attr.data-variant]': 'variant()',
    '[class]': 'computedClass()',
  },
})
export class TabsList {
  /** Pill (`default`) vs minimal `line` indicator. Mirrors React `variant`. */
  readonly variant =
    input<NonNullable<VariantProps<typeof tabsListVariants>['variant']>>(
      'default',
    );

  protected readonly computedClass = computed(() =>
    cn(tabsListVariants({ variant: this.variant() })),
  );
}

/**
 * TabsTrigger — a clickable tab keyed by `value`. Mirrors React `TabsTrigger`.
 * Renders a `<button brnTabsTrigger>` so brain owns keyboard roving + active
 * state; brain matches it to its content by the `value` string.
 */
@Component({
  selector: 'gr-tabs-trigger',
  standalone: true,
  imports: [BrnTabsTrigger],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [brnTabsTrigger]="value()"
      [disabled]="disabled()"
      data-slot="tabs-trigger"
      [class]="triggerClass()"
    >
      <ng-content />
    </button>
  `,
  host: {
    class: 'contents',
  },
})
export class TabsTrigger {
  /** Unique key matching a `gr-tabs-content`. Mirrors React `value`. */
  readonly value = input.required<string>();
  /** Whether the tab is disabled. Mirrors React `disabled`. */
  readonly disabled = input<boolean>(false);

  protected readonly triggerClass = computed(() =>
    cn(
      "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent',
      'data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground',
      'after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100',
    ),
  );
}

/**
 * TabsContent — the panel for a tab keyed by `value`. Mirrors React
 * `TabsContent`. Brain shows/hides it based on the active trigger.
 */
@Component({
  selector: 'gr-tabs-content',
  standalone: true,
  imports: [BrnTabsContent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      [brnTabsContent]="value()"
      data-slot="tabs-content"
      class="flex-1 outline-none"
    >
      <ng-content />
    </div>
  `,
  host: {
    class: 'contents',
  },
})
export class TabsContent {
  /** Key matching a `gr-tabs-trigger`. Mirrors React `value`. */
  readonly value = input.required<string>();
}

export { tabsListVariants };
