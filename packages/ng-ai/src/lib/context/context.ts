import {
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
  BrnHoverCard,
  BrnHoverCardTrigger,
} from '@spartan-ng/brain/hover-card';
import { cn } from '@gremorie/ng-core';

const PERCENT_MAX = 100;
const ICON_RADIUS = 10;
const ICON_VIEWBOX = 24;
const ICON_CENTER = 12;
const ICON_STROKE_WIDTH = 2;

/**
 * Mirrors the AI SDK `LanguageModelUsage` fields read by the React component.
 * Inlined so consumers do not need to install `ai`.
 */
export type ContextUsage = {
  inputTokens?: number;
  outputTokens?: number;
  reasoningTokens?: number;
  cachedInputTokens?: number;
  totalTokens?: number;
};

/** Resolves a USD cost for a given usage slice. Mirrors tokenlens `getUsage`. */
export type ContextCostResolver = (
  modelId: string,
  usage: ContextUsage,
) => number | undefined;

/**
 * Context — a token-usage meter that hovers into a usage/cost breakdown.
 * Mirrors React `Context` from `@gremorie/rx-ai`.
 *
 * React parity:
 * - Shares `{ usedTokens, maxTokens, usage, modelId }` via context (here
 *   `CONTEXT`). The trigger renders the used percentage + a ring icon; the
 *   content shows a header (percent + used/total + progress bar), a body slot,
 *   per-slice usage rows (input/output/reasoning/cache) and a footer (total
 *   cost).
 * - `data-slot` is set on each surface for styling parity.
 *
 * Divergences:
 * 1. React uses `BrnHoverCard` content via a `<ng-template brnHoverCardContent>`
 *    (brain idiom) — the consumer wraps `<context-content>` in that template.
 * 2. React derives cost from `tokenlens` (`getUsage`). `tokenlens` is not a peer
 *    of `ng-ai`; pass an optional `costResolver` to reproduce cost output. When
 *    omitted, cost is shown as `$0.00` (same formatting, no external dep).
 */
export interface ContextState {
  usedTokens: () => number;
  maxTokens: () => number;
  usage: () => ContextUsage | undefined;
  modelId: () => string | undefined;
  costResolver: () => ContextCostResolver | undefined;
}

export const CONTEXT = new InjectionToken<ContextState>('ContextState');

const pct = (v: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 1,
  }).format(v);
const compact = (v: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact' }).format(v);
const usd = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    v,
  );

@Component({
  selector: 'context',
  standalone: true,
  hostDirectives: [BrnHoverCard],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: { 'data-slot': 'context', class: 'contents' },
  providers: [{ provide: CONTEXT, useExisting: forwardRef(() => Context) }],
})
export class Context implements ContextState {
  readonly usedTokens = input.required<number>();
  readonly maxTokens = input.required<number>();
  readonly usage = input<ContextUsage>();
  readonly modelId = input<string>();
  /** Optional cost resolver (mirrors tokenlens `getUsage`). */
  readonly costResolver = input<ContextCostResolver>();
}

@Component({
  selector: 'context-trigger',
  standalone: true,
  hostDirectives: [BrnHoverCardTrigger],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content>
      <button type="button" [class]="buttonClass()">
        <span class="font-medium text-muted-foreground">{{ renderedPercent() }}</span>
        <svg
          aria-label="Model context usage"
          height="20"
          width="20"
          role="img"
          [attr.viewBox]="viewBox"
          style="color: currentcolor"
        >
          <circle
            [attr.cx]="center"
            [attr.cy]="center"
            fill="none"
            opacity="0.25"
            [attr.r]="radius"
            stroke="currentColor"
            [attr.stroke-width]="strokeWidth"
          />
          <circle
            [attr.cx]="center"
            [attr.cy]="center"
            fill="none"
            opacity="0.7"
            [attr.r]="radius"
            stroke="currentColor"
            [attr.stroke-dasharray]="dashArray()"
            [attr.stroke-dashoffset]="dashOffset()"
            stroke-linecap="round"
            [attr.stroke-width]="strokeWidth"
            style="transform-origin: center; transform: rotate(-90deg)"
          />
        </svg>
      </button>
    </ng-content>
  `,
  host: { 'data-slot': 'context-trigger', class: 'inline-flex' },
})
export class ContextTrigger {
  private readonly ctx = inject(CONTEXT);
  readonly class = input<string>();

  protected readonly viewBox = `0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`;
  protected readonly center = ICON_CENTER;
  protected readonly radius = ICON_RADIUS;
  protected readonly strokeWidth = ICON_STROKE_WIDTH;

  private readonly circumference = 2 * Math.PI * ICON_RADIUS;
  private readonly usedPercent = computed(
    () => this.ctx.usedTokens() / this.ctx.maxTokens(),
  );

  protected readonly dashArray = () =>
    `${this.circumference} ${this.circumference}`;
  protected readonly dashOffset = computed(
    () => this.circumference * (1 - this.usedPercent()),
  );
  protected readonly renderedPercent = computed(() => pct(this.usedPercent()));
  protected readonly buttonClass = computed(() =>
    cn(
      'inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
      this.class(),
    ),
  );
}

@Component({
  selector: 'context-content',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'context-content',
    '[class]': 'hostClass()',
  },
})
export class ContextContent {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn(
      'block min-w-60 divide-y overflow-hidden rounded-md border bg-popover p-0 text-popover-foreground shadow-md',
      this.class(),
    ),
  );
}

@Component({
  selector: 'context-content-header',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content>
      <div class="flex items-center justify-between gap-3 text-xs">
        <p>{{ displayPct() }}</p>
        <p class="font-mono text-muted-foreground">{{ used() }} / {{ total() }}</p>
      </div>
      <div class="space-y-2">
        <div class="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            class="h-full rounded-full bg-primary transition-all"
            [style.width.%]="barWidth()"
          ></div>
        </div>
      </div>
    </ng-content>
  `,
  host: {
    'data-slot': 'context-content-header',
    '[class]': 'hostClass()',
  },
})
export class ContextContentHeader {
  private readonly ctx = inject(CONTEXT);
  readonly class = input<string>();
  private readonly usedPercent = computed(
    () => this.ctx.usedTokens() / this.ctx.maxTokens(),
  );
  protected readonly displayPct = computed(() => pct(this.usedPercent()));
  protected readonly used = computed(() => compact(this.ctx.usedTokens()));
  protected readonly total = computed(() => compact(this.ctx.maxTokens()));
  protected readonly barWidth = computed(() => this.usedPercent() * PERCENT_MAX);
  protected readonly hostClass = computed(() =>
    cn('block w-full space-y-2 p-3', this.class()),
  );
}

@Component({
  selector: 'context-content-body',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'context-content-body',
    '[class]': 'hostClass()',
  },
})
export class ContextContentBody {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('block w-full p-3', this.class()),
  );
}

@Component({
  selector: 'context-content-footer',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content>
      <span class="text-muted-foreground">Total cost</span>
      <span>{{ totalCost() }}</span>
    </ng-content>
  `,
  host: {
    'data-slot': 'context-content-footer',
    '[class]': 'hostClass()',
  },
})
export class ContextContentFooter {
  private readonly ctx = inject(CONTEXT);
  readonly class = input<string>();
  protected readonly totalCost = computed(() => {
    const modelId = this.ctx.modelId();
    const resolver = this.ctx.costResolver();
    const usage = this.ctx.usage();
    const cost =
      modelId && resolver
        ? resolver(modelId, {
            inputTokens: usage?.inputTokens ?? 0,
            outputTokens: usage?.outputTokens ?? 0,
          })
        : undefined;
    return usd(cost ?? 0);
  });
  protected readonly hostClass = computed(() =>
    cn(
      'flex w-full items-center justify-between gap-3 bg-secondary p-3 text-xs',
      this.class(),
    ),
  );
}

const rowClassBase = 'flex items-center justify-between text-xs';

@Component({
  selector: 'context-input-usage',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tokens()) {
      <span class="text-muted-foreground">Input</span>
      <span>
        {{ tokensText() }}
        @if (costText()) {
          <span class="ml-2 text-muted-foreground">• {{ costText() }}</span>
        }
      </span>
    }
  `,
  host: {
    'data-slot': 'context-input-usage',
    '[class]': 'tokens() ? rowClass() : ""',
  },
})
export class ContextInputUsage {
  private readonly ctx = inject(CONTEXT);
  readonly class = input<string>();
  protected readonly tokens = computed(
    () => this.ctx.usage()?.inputTokens ?? 0,
  );
  protected readonly tokensText = computed(() => compact(this.tokens()));
  protected readonly costText = computed(() => {
    const t = this.tokens();
    const m = this.ctx.modelId();
    const r = this.ctx.costResolver();
    if (!t || !m || !r) {
      return undefined;
    }
    return usd(r(m, { inputTokens: t, outputTokens: 0 }) ?? 0);
  });
  protected readonly rowClass = computed(() => cn(rowClassBase, this.class()));
}

@Component({
  selector: 'context-output-usage',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tokens()) {
      <span class="text-muted-foreground">Output</span>
      <span>
        {{ tokensText() }}
        @if (costText()) {
          <span class="ml-2 text-muted-foreground">• {{ costText() }}</span>
        }
      </span>
    }
  `,
  host: {
    'data-slot': 'context-output-usage',
    '[class]': 'tokens() ? rowClass() : ""',
  },
})
export class ContextOutputUsage {
  private readonly ctx = inject(CONTEXT);
  readonly class = input<string>();
  protected readonly tokens = computed(
    () => this.ctx.usage()?.outputTokens ?? 0,
  );
  protected readonly tokensText = computed(() => compact(this.tokens()));
  protected readonly costText = computed(() => {
    const t = this.tokens();
    const m = this.ctx.modelId();
    const r = this.ctx.costResolver();
    if (!t || !m || !r) {
      return undefined;
    }
    return usd(r(m, { inputTokens: 0, outputTokens: t }) ?? 0);
  });
  protected readonly rowClass = computed(() => cn(rowClassBase, this.class()));
}

@Component({
  selector: 'context-reasoning-usage',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tokens()) {
      <span class="text-muted-foreground">Reasoning</span>
      <span>
        {{ tokensText() }}
        @if (costText()) {
          <span class="ml-2 text-muted-foreground">• {{ costText() }}</span>
        }
      </span>
    }
  `,
  host: {
    'data-slot': 'context-reasoning-usage',
    '[class]': 'tokens() ? rowClass() : ""',
  },
})
export class ContextReasoningUsage {
  private readonly ctx = inject(CONTEXT);
  readonly class = input<string>();
  protected readonly tokens = computed(
    () => this.ctx.usage()?.reasoningTokens ?? 0,
  );
  protected readonly tokensText = computed(() => compact(this.tokens()));
  protected readonly costText = computed(() => {
    const t = this.tokens();
    const m = this.ctx.modelId();
    const r = this.ctx.costResolver();
    if (!t || !m || !r) {
      return undefined;
    }
    return usd(r(m, { reasoningTokens: t }) ?? 0);
  });
  protected readonly rowClass = computed(() => cn(rowClassBase, this.class()));
}

@Component({
  selector: 'context-cache-usage',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (tokens()) {
      <span class="text-muted-foreground">Cache</span>
      <span>
        {{ tokensText() }}
        @if (costText()) {
          <span class="ml-2 text-muted-foreground">• {{ costText() }}</span>
        }
      </span>
    }
  `,
  host: {
    'data-slot': 'context-cache-usage',
    '[class]': 'tokens() ? rowClass() : ""',
  },
})
export class ContextCacheUsage {
  private readonly ctx = inject(CONTEXT);
  readonly class = input<string>();
  protected readonly tokens = computed(
    () => this.ctx.usage()?.cachedInputTokens ?? 0,
  );
  protected readonly tokensText = computed(() => compact(this.tokens()));
  protected readonly costText = computed(() => {
    const t = this.tokens();
    const m = this.ctx.modelId();
    const r = this.ctx.costResolver();
    if (!t || !m || !r) {
      return undefined;
    }
    return usd(r(m, { inputTokens: 0, outputTokens: 0, cachedInputTokens: t }) ?? 0);
  });
  protected readonly rowClass = computed(() => cn(rowClassBase, this.class()));
}
