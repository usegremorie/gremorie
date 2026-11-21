import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { AreaChart } from '@gremorie/ng-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/ng-display';
import {
  Field,
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gremorie/ng-forms';

// Month-end closes, June to November 2026, for three index funds a
// personal-finance user might hold. The chart plots the return since June
// (the y scale starts at zero, so raw prices would read as a flat band).
// One series, so it takes the first slot of the categorical palette; the
// change since June is a status mark.
const TICKERS = {
  VOO: { name: 'S&P 500 ETF', closes: [552, 561, 556, 570, 584, 579] },
  VTI: { name: 'Total Market ETF', closes: [301, 306, 303, 311, 318, 315] },
  QQQ: { name: 'Nasdaq-100 ETF', closes: [528, 541, 533, 556, 571, 563] },
} as const;

type Ticker = keyof typeof TICKERS;

const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const change = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
  signDisplay: 'always',
});

/** Showcase card: six months of closing prices for a chosen fund. */
@Component({
  selector: 'showcase-stock-performance',
  standalone: true,
  imports: [
    AreaChart,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Field,
    FieldLabel,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Stock Performance</gr-card-title>
        <gr-card-description
          >6-month return, month-end close.</gr-card-description
        >
      </gr-card-header>
      <gr-card-content>
        <gr-field>
          <gr-field-label for="stock-ticker">Ticker</gr-field-label>
          <gr-select [(value)]="ticker" [itemToString]="tickerLabel">
            <gr-select-trigger id="stock-ticker" class="w-full">
              <gr-select-value />
            </gr-select-trigger>
            <gr-select-content>
              @for (t of tickers; track t) {
                <gr-select-item [value]="t">{{
                  tickerLabel(t)
                }}</gr-select-item>
              }
            </gr-select-content>
          </gr-select>
        </gr-field>
      </gr-card-content>
      <gr-card-content class="flex flex-col gap-4">
        <div class="flex items-baseline justify-between">
          <span class="font-semibold text-2xl tabular-nums">{{
            latest()
          }}</span>
          <span
            class="font-medium text-sm tabular-nums"
            [style.color]="deltaColor()"
            >{{ deltaLabel() }} since Jun</span
          >
        </div>
        <area-chart
          [config]="config"
          [data]="data()"
          xKey="month"
          [yAxis]="false"
        />
      </gr-card-content>
    </gr-card>
  `,
})
export class StockPerformance {
  protected readonly tickers = Object.keys(TICKERS) as Ticker[];
  protected readonly ticker = signal<Ticker>('VOO');
  protected readonly config = {
    returnPct: { label: 'Return (%)', color: 'var(--chart-cat-1)' },
  };
  protected readonly tickerLabel = (t: string) =>
    `${t} · ${TICKERS[t as Ticker]?.name ?? ''}`;

  private readonly closes = computed(() => TICKERS[this.ticker()].closes);
  private readonly delta = computed(() => {
    const c = this.closes();
    return (c[c.length - 1] - c[0]) / c[0];
  });

  protected readonly data = computed(() => {
    const c = this.closes();
    return MONTHS.map((month, i) => ({
      month,
      returnPct: Math.round(((c[i] - c[0]) / c[0]) * 1000) / 10,
    }));
  });
  protected readonly latest = computed(() =>
    usd.format(this.closes()[this.closes().length - 1]),
  );
  protected readonly deltaLabel = computed(() => change.format(this.delta()));
  protected readonly deltaColor = computed(() =>
    this.delta() >= 0
      ? 'var(--chart-status-success)'
      : 'var(--chart-status-error)',
  );
}
