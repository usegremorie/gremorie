import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  RadialChart,
  ScatterChart,
} from '@gremorie/ng-data';
import type { ChartConfig, Datum } from '@gremorie/ng-data';

/** Visual smoke test of the full @gremorie/ng-data charts set in a responsive grid. */
@Component({
  selector: 'app-charts-demo',
  imports: [
    AreaChart,
    BarChart,
    LineChart,
    PieChart,
    RadarChart,
    RadialChart,
    ScatterChart,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-col gap-4">
      <h2 class="text-lg font-medium text-foreground">
        @gremorie/ng-data - all charts
      </h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <area-chart [data]="monthly()" [config]="duo()" xKey="month" />
        <line-chart [data]="monthly()" [config]="duo()" xKey="month" />
        <bar-chart [data]="monthly()" [config]="duo()" xKey="month" />
        <scatter-chart [data]="scatter()" [config]="scatterConfig()" xKey="x" />
        <pie-chart
          [data]="browsers()"
          nameKey="browser"
          dataKey="visitors"
          [donut]="true"
        />
        <radial-chart
          [data]="browsers()"
          nameKey="browser"
          dataKey="visitors"
        />
        <radar-chart [data]="metrics()" [config]="duo()" xKey="metric" />
      </div>
    </section>
  `,
})
export class ChartsDemo {
  protected readonly monthly = signal<Datum[]>([
    { month: 'Jan', sales: 186, profit: 80 },
    { month: 'Feb', sales: 305, profit: 200 },
    { month: 'Mar', sales: 237, profit: 120 },
    { month: 'Apr', sales: 173, profit: 90 },
    { month: 'May', sales: 209, profit: 130 },
    { month: 'Jun', sales: 264, profit: 140 },
  ]);

  protected readonly duo = signal<ChartConfig>({
    sales: { label: 'Sales', color: 'var(--chart-1)' },
    profit: { label: 'Profit', color: 'var(--chart-2)' },
  });

  protected readonly scatter = signal<Datum[]>([
    { x: 12, weight: 40 },
    { x: 25, weight: 95 },
    { x: 38, weight: 60 },
    { x: 47, weight: 130 },
    { x: 58, weight: 85 },
    { x: 70, weight: 160 },
    { x: 82, weight: 110 },
  ]);

  protected readonly scatterConfig = signal<ChartConfig>({
    weight: { label: 'Weight', color: 'var(--chart-1)' },
  });

  protected readonly browsers = signal<Datum[]>([
    { browser: 'Chrome', visitors: 275 },
    { browser: 'Safari', visitors: 200 },
    { browser: 'Firefox', visitors: 187 },
    { browser: 'Edge', visitors: 173 },
    { browser: 'Other', visitors: 90 },
  ]);

  protected readonly metrics = signal<Datum[]>([
    { metric: 'Speed', sales: 120, profit: 90 },
    { metric: 'Quality', sales: 98, profit: 130 },
    { metric: 'Comfort', sales: 86, profit: 70 },
    { metric: 'Safety', sales: 99, profit: 110 },
    { metric: 'Price', sales: 85, profit: 60 },
    { metric: 'Design', sales: 65, profit: 125 },
  ]);
}
