import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  InjectionToken,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gremorie/ng-display';
import { cn } from '@gremorie/ng-core';

import { Shimmer } from '../shimmer/shimmer';

/**
 * Plan — a collapsible Card that presents an agent's proposed plan. Mirrors
 * React `Plan` from `@gremorie/rx-ai`.
 *
 * React parity:
 * - React composes `Collapsible` + `Card` and shares an `isStreaming` flag via
 *   context; `PlanTitle` / `PlanDescription` swap to `<Shimmer>` while
 *   streaming. The Angular edition shares the same `isStreaming` plus the
 *   collapsible open-state through `PLAN` (InjectionToken), mirroring the
 *   self-managed open-state idiom used by `Task` / `Tool` (robust under
 *   content projection — see Reasoning notes).
 * - `data-slot` names match React exactly (`plan`, `plan-header`,
 *   `plan-title`, `plan-description`, `plan-action`, `plan-content`,
 *   `plan-footer`, `plan-trigger`).
 */
export interface PlanState {
  isStreaming: () => boolean;
  isOpen: () => boolean;
  setOpen(open: boolean): void;
  toggle(): void;
}

export const PLAN = new InjectionToken<PlanState>('PlanState');

@Component({
  selector: 'plan',
  standalone: true,
  imports: [Card],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card [class]="cardClass()">
      <ng-content />
    </gr-card>
  `,
  host: {
    'data-slot': 'plan',
    class: 'block',
    '[attr.data-state]': 'open() ? "open" : "closed"',
  },
  providers: [{ provide: PLAN, useExisting: forwardRef(() => Plan) }],
})
export class Plan implements PlanState {
  /** Mirrors React `isStreaming` — drives the shimmer on title/description. */
  readonly isStreaming = input<boolean>(false);
  /** Mirrors React Collapsible `defaultOpen` via a two-way `open` model. */
  readonly open = model<boolean>(false);
  readonly class = input<string>();

  readonly isOpen = () => this.open();
  setOpen(open: boolean): void {
    this.open.set(open);
  }
  toggle(): void {
    this.open.update((v) => !v);
  }

  protected readonly cardClass = computed(() =>
    cn('shadow-none', this.class()),
  );
}

@Component({
  selector: 'plan-header',
  standalone: true,
  imports: [CardHeader],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<gr-card-header [class]="headerClass()"
    ><ng-content
  /></gr-card-header>`,
  host: { 'data-slot': 'plan-header', class: 'contents' },
})
export class PlanHeader {
  readonly class = input<string>();
  protected readonly headerClass = computed(() =>
    cn('flex items-start justify-between', this.class()),
  );
}

@Component({
  selector: 'plan-title',
  standalone: true,
  imports: [CardTitle, Shimmer],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card-title>
      @if (isStreaming()) {
        <span ngShimmer>{{ children() }}</span>
      } @else {
        {{ children() }}
      }
    </gr-card-title>
  `,
  host: { 'data-slot': 'plan-title', class: 'contents' },
})
export class PlanTitle {
  private readonly state = inject(PLAN);
  /** Title text (React `children: string`). */
  readonly children = input.required<string>();
  protected readonly isStreaming = computed(() => this.state.isStreaming());
}

@Component({
  selector: 'plan-description',
  standalone: true,
  imports: [CardDescription, Shimmer],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card-description [class]="descClass()">
      @if (isStreaming()) {
        <span ngShimmer>{{ children() }}</span>
      } @else {
        {{ children() }}
      }
    </gr-card-description>
  `,
  host: { 'data-slot': 'plan-description', class: 'contents' },
})
export class PlanDescription {
  private readonly state = inject(PLAN);
  /** Description text (React `children: string`). */
  readonly children = input.required<string>();
  readonly class = input<string>();
  protected readonly isStreaming = computed(() => this.state.isStreaming());
  protected readonly descClass = computed(() =>
    cn('text-balance', this.class()),
  );
}

@Component({
  selector: 'plan-action',
  standalone: true,
  imports: [CardAction],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<gr-card-action><ng-content /></gr-card-action>`,
  host: { 'data-slot': 'plan-action', class: 'contents' },
})
export class PlanAction {}

@Component({
  selector: 'plan-content',
  standalone: true,
  imports: [CardContent],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <gr-card-content><ng-content /></gr-card-content>
    }
  `,
  host: { 'data-slot': 'plan-content', class: 'contents' },
})
export class PlanContent {
  private readonly state = inject(PLAN);
  protected readonly open = computed(() => this.state.isOpen());
}

@Component({
  selector: 'plan-footer',
  standalone: true,
  imports: [CardFooter],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<gr-card-footer><ng-content /></gr-card-footer>`,
  host: { 'data-slot': 'plan-footer', class: 'contents' },
})
export class PlanFooter {}

@Component({
  selector: 'plan-trigger',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="toggle()"
      [attr.aria-expanded]="open()"
      [class]="buttonClass()"
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
        <path d="m7 15 5 5 5-5" />
        <path d="m7 9 5-5 5 5" />
      </svg>
      <span class="sr-only">Toggle plan</span>
    </button>
  `,
  host: { 'data-slot': 'plan-trigger', class: 'contents' },
})
export class PlanTrigger {
  private readonly state = inject(PLAN);
  readonly class = input<string>();
  protected readonly open = computed(() => this.state.isOpen());
  protected toggle(): void {
    this.state.toggle();
  }
  protected readonly buttonClass = computed(() =>
    cn(
      'inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      this.class(),
    ),
  );
}
