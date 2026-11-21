import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BarChart } from '@gremorie/ng-data';
import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@gremorie/ng-display';

// Twelve months of card cash back, December 2025 to November 2026. Past
// months sit on a light step of the sequential palette; the current month
// takes a darker step so it reads as "now".
const MONTHS = [
  ['Dec', 31.4],
  ['Jan', 18.2],
  ['Feb', 14.9],
  ['Mar', 22.6],
  ['Apr', 19.8],
  ['May', 24.1],
  ['Jun', 27.5],
  ['Jul', 21.3],
  ['Aug', 25.7],
  ['Sep', 23.9],
  ['Oct', 29.4],
  ['Nov', 33.8],
] as const;

const TOTAL = MONTHS.reduce((sum, [, v]) => sum + v, 0);

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Showcase card: a year of cash back earned on a credit card. */
@Component({
  selector: 'showcase-yearly-activity',
  standalone: true,
  imports: [
    Badge,
    BarChart,
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Yearly Activity</gr-card-title>
        <gr-card-action>
          <gr-badge class="tabular-nums" variant="secondary"
            >+{{ total }} cash back</gr-badge
          >
        </gr-card-action>
      </gr-card-header>
      <gr-card-content>
        <bar-chart
          class="h-24 w-full"
          [config]="config"
          [data]="data"
          [framed]="false"
          [grid]="false"
          [radius]="4"
          xKey="month"
          [yAxis]="false"
        />
      </gr-card-content>
    </gr-card>
  `,
})
export class YearlyActivity {
  protected readonly total = usd.format(TOTAL);
  protected readonly config = {
    cashBack: { label: 'Cash back', color: 'var(--chart-seq-2)' },
  };
  protected readonly data = MONTHS.map(([month, cashBack], i) => ({
    month,
    cashBack,
    fill: i === MONTHS.length - 1 ? 'var(--chart-seq-4)' : 'var(--chart-seq-2)',
  }));
}
