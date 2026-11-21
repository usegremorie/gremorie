import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@gremorie/ng-display';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  ToggleGroup,
  ToggleGroupItem,
} from '@gremorie/ng-forms';

// A brokerage portfolio. Asset class is a category, so each class owns a
// slot of the categorical data-viz palette (stock, ETF, REIT); the return
// since purchase is a status mark (success up, error down).
const CLASSES = [
  {
    value: 'stock',
    label: 'Stocks',
    badge: 'Stock',
    color: 'var(--chart-cat-1)',
  },
  { value: 'etf', label: 'ETFs', badge: 'ETF', color: 'var(--chart-cat-2)' },
  {
    value: 'reit',
    label: 'REITs',
    badge: 'REIT',
    color: 'var(--chart-cat-3)',
  },
];

const HOLDINGS = [
  {
    ticker: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    shares: 112,
    since: 'Jan 2021',
    assetClass: 'etf',
    value: 62384.0,
    change: 0.482,
  },
  {
    ticker: 'VIG',
    name: 'Vanguard Dividend Appreciation',
    shares: 450,
    since: 'Mar 2022',
    assetClass: 'etf',
    value: 92407.5,
    change: 0.271,
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    shares: 85,
    since: 'Nov 2020',
    assetClass: 'stock',
    value: 23618.95,
    change: 0.912,
  },
  {
    ticker: 'O',
    name: 'Realty Income Corp',
    shares: 320,
    since: 'Jun 2023',
    assetClass: 'reit',
    value: 18604.8,
    change: -0.034,
  },
];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
  signDisplay: 'always',
});

const ROWS = HOLDINGS.map((h) => {
  const assetClass = CLASSES.find((c) => c.value === h.assetClass);
  return {
    ...h,
    badge: assetClass?.badge,
    color: assetClass?.color,
    value: usd.format(h.value),
    change: percent.format(h.change),
    changeColor:
      h.change >= 0
        ? 'var(--chart-status-success)'
        : 'var(--chart-status-error)',
  };
});

/** Showcase card: portfolio holdings, searchable and filtered by class. */
@Component({
  selector: 'showcase-stock-holdings',
  standalone: true,
  imports: [
    Badge,
    Card,
    CardContent,
    CardHeader,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemMedia,
    ItemTitle,
    NgIcon,
    ToggleGroup,
    ToggleGroupItem,
  ],
  providers: [provideIcons({ lucideSearch })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <!-- The group input has no value output; the native input
               event bubbles to the group, which is enough here. -->
          <gr-input-group class="w-full sm:w-96" (input)="onQuery($event)">
            <gr-input-group-addon>
              <ng-icon name="lucideSearch" size="16" aria-hidden="true" />
            </gr-input-group-addon>
            <gr-input-group-input
              placeholder="Search holdings or tickers..."
              [value]="query()"
            />
          </gr-input-group>
          <gr-toggle-group
            type="multiple"
            variant="outline"
            [spacing]="2"
            [value]="classes()"
            (valueChange)="onClasses($event)"
            aria-label="Filter by asset class"
          >
            @for (c of assetClasses; track c.value) {
              <gr-toggle-group-item [value]="c.value">{{
                c.label
              }}</gr-toggle-group-item>
            }
          </gr-toggle-group>
        </div>
      </gr-card-header>
      <gr-card-content class="flex flex-col gap-3">
        @for (h of rows(); track h.ticker) {
          <gr-item variant="muted">
            <gr-item-media
              variant="featured"
              class="font-semibold text-foreground text-xs tracking-tight"
              >{{ h.ticker }}</gr-item-media
            >
            <gr-item-content>
              <gr-item-title>{{ h.name }}</gr-item-title>
              <gr-item-description class="uppercase tracking-wider"
                >{{ h.shares }} shares · {{ h.since }}</gr-item-description
              >
            </gr-item-content>
            <gr-item-actions class="gap-6">
              <!-- gr-badge joins its classes without merging, so the base
                   border-transparent beats the outline border-border; the
                   important modifier restores the outline. -->
              <gr-badge variant="outline" class="border-border!">
                <span
                  aria-hidden="true"
                  class="size-1.5 rounded-full"
                  [style.background-color]="h.color"
                ></span>
                {{ h.badge }}
              </gr-badge>
              <div class="flex w-28 flex-col items-end gap-0.5">
                <span class="font-medium text-sm tabular-nums">{{
                  h.value
                }}</span>
                <span
                  class="text-xs tabular-nums"
                  [style.color]="h.changeColor"
                  >{{ h.change }}</span
                >
              </div>
            </gr-item-actions>
          </gr-item>
        } @empty {
          <p class="py-6 text-center text-muted-foreground text-sm">
            No holdings match your search.
          </p>
        }
      </gr-card-content>
    </gr-card>
  `,
})
export class StockHoldings {
  protected readonly assetClasses = CLASSES;
  protected readonly query = signal('');
  protected readonly classes = signal<string[]>([]);
  protected readonly rows = computed(() => {
    const q = this.query().trim().toLowerCase();
    const classes = this.classes();
    return ROWS.filter(
      (h) =>
        (classes.length === 0 || classes.includes(h.assetClass)) &&
        (!q ||
          h.ticker.toLowerCase().includes(q) ||
          h.name.toLowerCase().includes(q)),
    );
  });

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onClasses(value: unknown): void {
    this.classes.set(Array.isArray(value) ? (value as string[]) : []);
  }
}
