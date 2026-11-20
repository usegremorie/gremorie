import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  signal,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { cva } from 'class-variance-authority';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/ng-overlays';
import { cn } from '@gremorie/ng-core';

/**
 * TabBar - the app's top-level destinations, docked to the bottom of a phone
 * screen. Mirrors React `TabBar` from `@gremorie/rx-navigation`.
 *
 * Anatomy: `gr-tab-bar` (a `<nav>`, fixed to the bottom, safe-area aware)
 * → `gr-tab-bar-item` (one destination: icon, label, optional badge).
 *
 * Three looks, one API:
 * - `material`: full-width bar; the active icon sits on a pill indicator
 * - `ios`: floating translucent capsule, icon over label
 * - `floating`: compact floating pill, icons only (labels become the
 *   accessible name and a tooltip)
 *
 * The floating looks paint with the floating-surface tokens
 * (`--surface-opacity`, `--surface-backdrop`). Items are destinations, so the
 * root is a `<nav>` and the active item carries `aria-current="page"`; for
 * panels inside one page use Tabs.
 *
 * The bar is `fixed` to the viewport. To show it inside a frame (a preview, a
 * phone mock-up), pass `class="absolute"` on a positioned parent.
 *
 * Icons: project the glyph (an inline `<svg>` or an `<ng-icon>`) as content of
 * the item; it is wrapped in the `tab-bar-icon` slot and sized to `size-6`
 * unless it carries its own `size-*` class.
 *
 * Router links: `gr-tab-bar-item` also works as an attribute on `a` or
 * `button`. In that form the host element IS the single focusable control
 * (no nested button), so `<a gr-tab-bar-item routerLink="/home" ...>` keeps
 * native link behavior. The element form renders an inner `<button>`.
 *
 * Divergence vs. React: Angular has no `onValueChange` callback; `value` is a
 * two-way model (`[(value)]`). There is no `asChild`; use the attribute form.
 * With the attribute form the tooltip wraps the icon (not the whole control).
 *
 * @example
 * ```html
 * <gr-tab-bar [(value)]="tab">
 *   <gr-tab-bar-item value="home" label="Home"><svg …/></gr-tab-bar-item>
 *   <a gr-tab-bar-item value="inbox" label="Inbox" [badge]="3" routerLink="/inbox"><svg …/></a>
 * </gr-tab-bar>
 * ```
 */

export type TabBarVariant = 'material' | 'ios' | 'floating';
export type TabBarLabels = 'always' | 'active' | 'never';

export const tabBarVariants = cva(
  'fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-out data-[hidden=true]:translate-y-[calc(100%+1.5rem)] motion-reduce:transition-none',
  {
    variants: {
      variant: {
        material:
          'border-t border-border bg-background-surface pb-[env(safe-area-inset-bottom)]',
        ios: 'pointer-events-none px-4 pb-[max(env(safe-area-inset-bottom),1rem)]',
        floating:
          'pointer-events-none flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),1rem)]',
      },
    },
  },
);

const tabBarListVariants = cva('flex items-stretch', {
  variants: {
    variant: {
      material: 'mx-auto h-20 max-w-2xl',
      ios: 'pointer-events-auto mx-auto h-16 max-w-md rounded-full border border-border bg-popover-surface p-1 shadow-lg',
      floating:
        'pointer-events-auto gap-1 rounded-full border border-border bg-popover-surface p-1.5 shadow-lg',
    },
  },
});

@Component({
  selector: 'gr-tab-bar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav
      [attr.aria-label]="ariaLabel()"
      [attr.data-hidden]="hidden()"
      [attr.data-labels]="resolvedLabels()"
      data-slot="tab-bar"
      [attr.data-variant]="variant()"
      [class]="navClass()"
    >
      <div data-slot="tab-bar-list" [class]="listClass()">
        <ng-content />
      </div>
    </nav>
  `,
  host: { class: 'contents' },
})
export class TabBar {
  /** The look: full-width bar, floating capsule, or icon-only pill. */
  readonly variant = input<TabBarVariant>('material');
  /** When item labels show. `floating` always hides them visually. */
  readonly labels = input<TabBarLabels>('always');
  /** Active item. Two-way: `[(value)]`. */
  readonly value = model<string | undefined>(undefined);
  /** Initially active item (seeds `value` when it is not set). */
  readonly defaultValue = input<string | undefined>(undefined);
  /** Slide the bar away while scrolling down, back on scrolling up. */
  readonly hideOnScroll = input(false, { transform: booleanAttribute });
  /** Extra classes merged onto the `<nav>`. */
  readonly class = input<string>('');
  /** Accessible name of the navigation landmark. */
  readonly ariaLabel = input<string>('Main');

  protected readonly hidden = signal(false);

  readonly resolvedLabels = computed<TabBarLabels>(() =>
    this.variant() === 'floating' ? 'never' : this.labels(),
  );

  protected readonly navClass = computed(() =>
    cn(tabBarVariants({ variant: this.variant() }), this.class()),
  );
  protected readonly listClass = computed(() =>
    tabBarListVariants({ variant: this.variant() }),
  );

  constructor() {
    effect(() => {
      const initial = this.defaultValue();
      if (
        initial !== undefined &&
        untracked(() => this.value()) === undefined
      ) {
        this.value.set(initial);
      }
    });

    // Small moves (under 8px) and the top of the page never hide the bar.
    effect((onCleanup) => {
      if (!this.hideOnScroll() || typeof window === 'undefined') {
        this.hidden.set(false);
        return;
      }
      let last = window.scrollY;
      const onScroll = () => {
        const y = window.scrollY;
        const delta = y - last;
        if (Math.abs(delta) < 8) return;
        this.hidden.set(delta > 0 && y > 56);
        last = y;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onCleanup(() => window.removeEventListener('scroll', onScroll));
    });
  }

  /** Marks `next` as the active item. Called by `gr-tab-bar-item`. */
  select(next: string): void {
    this.value.set(next);
  }
}

const tabBarItemVariants = cva(
  "group/tab-bar-item relative flex items-center justify-center text-muted-foreground transition-colors outline-none select-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        material:
          'min-w-0 flex-1 flex-col gap-1 rounded-md data-[active=true]:text-foreground',
        ios: 'min-w-0 flex-1 flex-col gap-0.5 rounded-full data-[active=true]:bg-accent data-[active=true]:text-primary',
        floating:
          'size-11 rounded-full data-[active=true]:bg-accent data-[active=true]:text-foreground',
      },
    },
  },
);

const tabBarIconVariants = cva(
  'relative inline-flex items-center justify-center',
  {
    variants: {
      variant: {
        material:
          'h-8 w-16 rounded-full transition-colors group-data-[active=true]/tab-bar-item:bg-accent',
        ios: '',
        floating: '',
      },
    },
  },
);

const tabBarLabelVariants = cva('truncate font-medium', {
  variants: {
    variant: {
      material: 'text-xs',
      ios: 'text-[0.625rem]',
      floating: '',
    },
  },
});

/**
 * TabBarItem - one destination. Mirrors React `TabBarItem`. Project the icon
 * as content. Use as `<gr-tab-bar-item>` (renders an inner button) or as
 * `a[gr-tab-bar-item]` / `button[gr-tab-bar-item]` (the host is the control).
 */
@Component({
  selector: 'gr-tab-bar-item, a[gr-tab-bar-item], button[gr-tab-bar-item]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  ],
  template: `
    <ng-template #icon>
      <span data-slot="tab-bar-icon" [class]="iconClass()">
        <span class="contents" aria-hidden="true"><ng-content /></span>
        @if (badge()) {
          <span
            aria-hidden="true"
            data-slot="tab-bar-badge"
            [class]="badgeClass()"
          >
            {{ badgeText() }}
          </span>
        }
      </span>
    </ng-template>

    <ng-template #inner>
      <ng-container [ngTemplateOutlet]="icon" />
      @if (showLabel()) {
        <span data-slot="tab-bar-label" [class]="labelClass()">{{
          label()
        }}</span>
      }
    </ng-template>

    <ng-template #control>
      @if (hostIsControl) {
        <ng-container [ngTemplateOutlet]="inner" />
      } @else {
        <button
          type="button"
          data-slot="tab-bar-item"
          [attr.data-active]="active()"
          [attr.aria-current]="ariaCurrent()"
          [attr.aria-label]="ariaLabel()"
          [disabled]="disabled()"
          [class]="itemClass()"
        >
          <ng-container [ngTemplateOutlet]="inner" />
        </button>
      }
    </ng-template>

    @if (showLabel()) {
      <ng-container [ngTemplateOutlet]="control" />
    } @else {
      <gr-tooltip-provider>
        <gr-tooltip side="top">
          <gr-tooltip-trigger [class]="triggerClass()">
            <ng-container [ngTemplateOutlet]="control" />
          </gr-tooltip-trigger>
          <gr-tooltip-content>{{ label() }}</gr-tooltip-content>
        </gr-tooltip>
      </gr-tooltip-provider>
    }
  `,
  host: {
    '[attr.data-slot]': 'hostIsControl ? "tab-bar-item" : null',
    '[attr.data-active]': 'hostIsControl ? active() : null',
    '[attr.aria-current]': 'hostIsControl ? ariaCurrent() : null',
    '[attr.aria-label]': 'hostIsControl ? ariaLabel() : null',
    '[attr.aria-disabled]': 'hostIsControl && disabled() ? "true" : null',
    '[attr.disabled]': 'hostIsControl && isButton && disabled() ? "" : null',
    '[attr.type]': 'hostIsControl && isButton ? "button" : null',
    '[class]': 'hostIsControl ? itemClass() : "contents"',
    '(click)': 'onClick($event)',
  },
})
export class TabBarItem {
  private readonly bar = inject(TabBar);
  private readonly tagName =
    inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName;

  /** True when used as `a[gr-tab-bar-item]` / `button[gr-tab-bar-item]`. */
  protected readonly hostIsControl = this.tagName !== 'GR-TAB-BAR-ITEM';
  protected readonly isButton = this.tagName === 'BUTTON';

  /** Identifies the item; the bar is active on the item whose value matches. */
  readonly value = input.required<string>();
  /** Visible text, and the accessible name when labels are hidden. */
  readonly label = input.required<string>();
  /** A count, or `true` for a dot. Hidden when `0` or `false`. */
  readonly badge = input<number | boolean | undefined>(undefined);
  /** Force the active state, e.g. from the router's current path. */
  // Public name `active` matches React; the class keeps `active` for the
  // resolved state, so the input is aliased.
  readonly activeOverride = input<boolean | undefined>(undefined, {
    // eslint-disable-next-line @angular-eslint/no-input-rename
    alias: 'active',
  });
  /** Disables the item. */
  readonly disabled = input<boolean>(false);

  protected readonly active = computed(
    () => this.activeOverride() ?? this.bar.value() === this.value(),
  );
  protected readonly ariaCurrent = computed(() =>
    this.active() ? 'page' : null,
  );

  protected readonly showLabel = computed(() => {
    const labels = this.bar.resolvedLabels();
    return labels === 'always' || (labels === 'active' && this.active());
  });

  private readonly badgeSuffix = computed(() => {
    const badge = this.badge();
    return typeof badge === 'number' && badge > 0 ? `, ${badge} new` : '';
  });

  protected readonly ariaLabel = computed(() =>
    this.showLabel() && !this.badgeSuffix()
      ? null
      : `${this.label()}${this.badgeSuffix()}`,
  );

  protected readonly badgeText = computed(() => {
    const badge = this.badge();
    if (badge === true || typeof badge !== 'number') return '';
    return badge > 99 ? '99+' : String(badge);
  });

  protected readonly itemClass = computed(() =>
    tabBarItemVariants({ variant: this.bar.variant() }),
  );
  protected readonly iconClass = computed(() =>
    tabBarIconVariants({ variant: this.bar.variant() }),
  );
  protected readonly labelClass = computed(() =>
    tabBarLabelVariants({ variant: this.bar.variant() }),
  );
  protected readonly badgeClass = computed(() =>
    cn(
      'absolute top-0 rounded-full bg-destructive text-destructive-foreground ring-2 ring-background',
      this.bar.variant() === 'material' ? 'left-1/2 ml-1.5' : '-right-1.5',
      this.badge() === true
        ? 'size-2'
        : 'flex h-4 min-w-4 items-center justify-center px-1 text-[0.625rem] leading-none font-semibold tabular-nums',
    ),
  );

  /** Anchors the tooltip around the control (or the icon in host form). */
  protected readonly triggerClass = computed(() =>
    this.hostIsControl
      ? 'inline-flex'
      : this.bar.variant() === 'floating'
        ? 'inline-flex'
        : 'flex min-w-0 flex-1',
  );

  protected onClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();
      return;
    }
    if (!event.defaultPrevented) this.bar.select(this.value());
  }
}
