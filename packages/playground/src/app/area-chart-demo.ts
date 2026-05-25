import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { AreaChart } from '@shadng/charts';
import type { ChartConfig, Datum } from '@shadng/charts';

/** Visual smoke test of the @shadng/charts AreaChart in a real browser. */
@Component({
  selector: 'app-area-chart-demo',
  imports: [AreaChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="flex flex-col gap-3">
      <div class="flex flex-col gap-1">
        <h2 class="text-lg font-medium text-foreground">{{ label }}</h2>
        <p class="text-sm text-muted-foreground">{{ description }}</p>
      </div>
      <area-chart [data]="data()" [config]="config()" xKey="month" />
    </section>
  `,
})
export class AreaChartDemo {
  protected readonly label = 'AreaChart — two series';
  protected readonly description =
    'sales + profit by month, colors from --chart-1 / --chart-2, responsive via ResizeObserver.';

  protected readonly data = signal<Datum[]>([
    { month: 'Jan', sales: 186, profit: 80 },
    { month: 'Feb', sales: 305, profit: 200 },
    { month: 'Mar', sales: 237, profit: 120 },
    { month: 'Apr', sales: 173, profit: 90 },
    { month: 'May', sales: 209, profit: 130 },
    { month: 'Jun', sales: 264, profit: 140 },
  ]);

  protected readonly config = signal<ChartConfig>({
    sales: { label: 'Sales', color: 'var(--chart-1)' },
    profit: { label: 'Profit', color: 'var(--chart-2)' },
  });
}
