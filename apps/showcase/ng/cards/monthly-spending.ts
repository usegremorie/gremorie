import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PieChart } from '@gremorie/ng-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/ng-display';

// A personal-finance month: four spending categories, each painted with a
// slot of the categorical chart palette (--chart-cat-1..4), so the donut and
// the list below read as one key.
const CATEGORIES = [
  { category: 'Housing', amount: 1450, fill: 'var(--chart-cat-1)' },
  { category: 'Groceries', amount: 620, fill: 'var(--chart-cat-2)' },
  { category: 'Transport', amount: 380, fill: 'var(--chart-cat-3)' },
  { category: 'Leisure', amount: 790, fill: 'var(--chart-cat-4)' },
];

const BUDGET = 4000;
const SPENT = CATEGORIES.reduce((sum, c) => sum + c.amount, 0);

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const percent = new Intl.NumberFormat('en-US', { style: 'percent' });

/** Showcase card: a month of personal spending by category. */
@Component({
  selector: 'showcase-monthly-spending',
  standalone: true,
  imports: [
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    PieChart,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Monthly Spending</gr-card-title>
        <gr-card-description>November, by category</gr-card-description>
      </gr-card-header>
      <gr-card-content>
        <pie-chart
          [centerLabel]="centerLabel"
          [centerValue]="centerValue"
          [config]="config"
          [data]="categories"
          dataKey="amount"
          [donut]="true"
          [framed]="false"
          [legend]="false"
          nameKey="category"
        />
      </gr-card-content>
      <gr-card-content>
        <ul class="divide-y divide-border text-sm">
          @for (c of rows; track c.category) {
            <li class="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span
                aria-hidden="true"
                class="size-2.5 shrink-0 rounded-full"
                [style.background-color]="c.fill"
              ></span>
              <span class="text-muted-foreground">{{ c.category }}</span>
              <span class="ml-auto font-medium tabular-nums">{{
                c.amount
              }}</span>
              <span
                class="w-10 text-right text-muted-foreground tabular-nums"
                >{{ c.share }}</span
              >
            </li>
          }
        </ul>
      </gr-card-content>
    </gr-card>
  `,
})
export class MonthlySpending {
  protected readonly categories = CATEGORIES;
  protected readonly config = { amount: { label: 'Spent' } };
  protected readonly centerValue = usd.format(SPENT);
  protected readonly centerLabel = `${percent.format(SPENT / BUDGET)} of ${usd.format(BUDGET)} budget`;
  protected readonly rows = CATEGORIES.map((c) => ({
    category: c.category,
    fill: c.fill,
    amount: usd.format(c.amount),
    share: percent.format(c.amount / SPENT),
  }));
}
