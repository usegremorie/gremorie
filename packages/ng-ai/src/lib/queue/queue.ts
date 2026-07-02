import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  InjectionToken,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

/**
 * Queue — a list of queued messages / todos. Mirrors React `Queue` from
 * `@gremorie/rx-ai`.
 *
 * Anatomy (React parity, same `data-slot` names):
 * - `queue`                 → `Queue` (rounded card container)
 * - `queue-list`            → `QueueList` (scrollable `ul` region)
 * - `queue-item`            → `QueueItem` (`li`)
 * - `queue-item-indicator`  → `QueueItemIndicator` (status dot)
 * - `queue-item-content`    → `QueueItemContent` (truncated title)
 * - `queue-item-description`→ `QueueItemDescription`
 * - `queue-item-actions` / `queue-item-action` → hover action buttons
 * - `queue-item-attachment` / `queue-item-image` / `queue-item-file`
 * - `queue-section` (+ trigger / label / content) → collapsible group
 *
 * Divergence: React `QueueList` wraps a `ScrollArea` (from `rx-containers`).
 * `@gremorie/ng-containers` is not a peer of `ng-ai`, so the Angular edition
 * reproduces the same scroll affordance with a native `overflow-y-auto
 * max-h-40` region — identical visual/behavioral result without adding a peer
 * dependency.
 */
export type QueueMessagePart = {
  type: string;
  text?: string;
  url?: string;
  filename?: string;
  mediaType?: string;
};

export type QueueMessage = {
  id: string;
  parts: QueueMessagePart[];
};

export type QueueTodo = {
  id: string;
  title: string;
  description?: string;
  status?: 'pending' | 'completed';
};

@Component({
  selector: 'queue',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'queue',
    '[class]': 'hostClass()',
  },
})
export class Queue {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'flex flex-col gap-2 rounded-xl border border-border bg-background px-3 pt-2 pb-2 shadow-xs',
      this.class(),
    ),
  );
}

@Component({
  selector: 'queue-list',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="wrapperClass()">
      <div class="max-h-40 overflow-y-auto pr-4">
        <ul>
          <ng-content />
        </ul>
      </div>
    </div>
  `,
  host: { 'data-slot': 'queue-list', class: 'block' },
})
export class QueueList {
  readonly class = input<string>();
  protected readonly wrapperClass = computed(() =>
    cn('-mb-1 mt-2', this.class()),
  );
}

@Component({
  selector: 'queue-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'queue-item',
    '[class]': 'hostClass()',
  },
})
export class QueueItem {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'group flex flex-col gap-1 rounded-md px-3 py-1 text-sm transition-colors hover:bg-muted',
      this.class(),
    ),
  );
}

@Component({
  selector: 'queue-item-indicator',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ``,
  host: {
    'data-slot': 'queue-item-indicator',
    '[class]': 'hostClass()',
  },
})
export class QueueItemIndicator {
  readonly completed = input<boolean>(false);
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'mt-0.5 inline-block size-2.5 rounded-full border',
      this.completed()
        ? 'border-muted-foreground/20 bg-muted-foreground/10'
        : 'border-muted-foreground/50',
      this.class(),
    ),
  );
}

@Component({
  selector: 'queue-item-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'queue-item-content',
    '[class]': 'hostClass()',
  },
})
export class QueueItemContent {
  readonly completed = input<boolean>(false);
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'line-clamp-1 grow break-words',
      this.completed()
        ? 'text-muted-foreground/50 line-through'
        : 'text-muted-foreground',
      this.class(),
    ),
  );
}

@Component({
  selector: 'queue-item-description',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'queue-item-description',
    '[class]': 'hostClass()',
  },
})
export class QueueItemDescription {
  readonly completed = input<boolean>(false);
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'ml-6 text-xs',
      this.completed()
        ? 'text-muted-foreground/40 line-through'
        : 'text-muted-foreground',
      this.class(),
    ),
  );
}

@Component({
  selector: 'queue-item-actions',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'queue-item-actions',
    '[class]': 'hostClass()',
  },
})
export class QueueItemActions {
  readonly class = input<string>();
  protected readonly hostClass = computed(() => cn('flex gap-1', this.class()));
}

@Component({
  selector: 'queue-item-action',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" [disabled]="disabled()" [class]="buttonClass()">
      <ng-content />
    </button>
  `,
  host: { 'data-slot': 'queue-item-action', class: 'contents' },
})
export class QueueItemAction {
  readonly disabled = input<boolean>(false);
  readonly class = input<string>();
  protected readonly buttonClass = computed(() =>
    cn(
      'inline-flex size-auto cursor-pointer items-center justify-center rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100',
      this.class(),
    ),
  );
}

@Component({
  selector: 'queue-item-attachment',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'queue-item-attachment',
    '[class]': 'hostClass()',
  },
})
export class QueueItemAttachment {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('mt-1 flex flex-wrap gap-2', this.class()),
  );
}

@Component({
  selector: 'queue-item-image',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<img [src]="src()" alt="" [class]="imgClass()" width="32" height="32" />`,
  host: { 'data-slot': 'queue-item-image', class: 'contents' },
})
export class QueueItemImage {
  readonly src = input.required<string>();
  readonly class = input<string>();
  protected readonly imgClass = computed(() =>
    cn('h-8 w-8 rounded border object-cover', this.class()),
  );
}

@Component({
  selector: 'queue-item-file',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      width="12"
      height="12"
    >
      <path
        d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
      />
    </svg>
    <span class="max-w-[100px] truncate"><ng-content /></span>
  `,
  host: {
    'data-slot': 'queue-item-file',
    '[class]': 'hostClass()',
  },
})
export class QueueItemFile {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'flex items-center gap-1 rounded border bg-muted px-2 py-1 text-xs',
      this.class(),
    ),
  );
}

// ---- Collapsible section --------------------------------------------------

export interface QueueSectionState {
  isOpen: () => boolean;
  toggle(): void;
}

export const QUEUE_SECTION = new InjectionToken<QueueSectionState>(
  'QueueSectionState',
);

@Component({
  selector: 'queue-section',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'queue-section',
    '[class]': 'class()',
    '[attr.data-state]': 'open() ? "open" : "closed"',
  },
  providers: [
    { provide: QUEUE_SECTION, useExisting: forwardRef(() => QueueSection) },
  ],
})
export class QueueSection implements QueueSectionState {
  /** React Collapsible `defaultOpen` (defaults to true). Seeds the open state. */
  readonly defaultOpen = input<boolean>(true);
  readonly open = model<boolean>(true);
  readonly class = input<string>();

  constructor() {
    // Seed the uncontrolled open state from `defaultOpen` (React parity).
    // Runs once in injection context before the first render.
    effect(() => {
      this.open.set(this.defaultOpen());
    });
  }

  readonly isOpen = () => this.open();
  toggle(): void {
    this.open.update((v) => !v);
  }
}

@Component({
  selector: 'queue-section-trigger',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="toggle()"
      [attr.aria-expanded]="open()"
      [attr.data-state]="open() ? 'open' : 'closed'"
      [class]="buttonClass()"
    >
      <ng-content />
    </button>
  `,
  host: { 'data-slot': 'queue-section-trigger', class: 'group block' },
})
export class QueueSectionTrigger {
  private readonly state = inject(QUEUE_SECTION);
  readonly class = input<string>();
  protected readonly open = computed(() => this.state.isOpen());
  protected toggle(): void {
    this.state.toggle();
  }
  protected readonly buttonClass = computed(() =>
    cn(
      'group flex w-full cursor-pointer items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-left font-medium text-muted-foreground text-sm transition-colors hover:bg-muted',
      this.class(),
    ),
  );
}

@Component({
  selector: 'queue-section-label',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      class="size-4 transition-transform group-data-[state=closed]:-rotate-90"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
    <ng-content select="[queue-section-icon]" />
    <span>{{ count() }} {{ label() }}</span>
  `,
  host: {
    'data-slot': 'queue-section-label',
    '[class]': 'hostClass()',
  },
})
export class QueueSectionLabel {
  readonly count = input<number>();
  readonly label = input.required<string>();
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('flex items-center gap-2', this.class()),
  );
}

@Component({
  selector: 'queue-section-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open()) {
      <ng-content />
    }
  `,
  host: {
    'data-slot': 'queue-section-content',
    '[class]': 'class()',
    '[attr.data-state]': 'open() ? "open" : "closed"',
  },
})
export class QueueSectionContent {
  private readonly state = inject(QUEUE_SECTION);
  readonly class = input<string>();
  protected readonly open = computed(() => this.state.isOpen());
}
