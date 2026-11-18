import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@gremorie/ng-core';
import { BarChart } from '@gremorie/ng-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Item,
  ItemContent,
  ItemDescription,
} from '@gremorie/ng-display';

/** shadcn reference card 1 (column 1): six months of contributions. */
@Component({
  selector: 'showcase-contribution-history',
  standalone: true,
  imports: [
    BarChart,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Item,
    ItemContent,
    ItemDescription,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Contribution History</gr-card-title>
        <gr-card-description>Last 6 months of activity</gr-card-description>
      </gr-card-header>
      <gr-card-content>
        <bar-chart
          [data]="data"
          [config]="config"
          xKey="month"
          [yAxis]="false"
          [radius]="6"
          [framed]="false"
          [grid]="false"
          class="h-[200px] w-full"
        />
      </gr-card-content>
      <gr-card-content>
        <div class="grid grid-cols-2 gap-3">
          @for (s of summary; track s.label) {
            <gr-item variant="muted" class="flex-col items-stretch">
              <gr-item-content class="gap-1">
                <gr-item-description
                  class="font-medium text-xs uppercase tracking-wider"
                >
                  {{ s.label }}
                </gr-item-description>
                <span class="font-semibold text-lg">{{ s.value }}</span>
                <span class="text-muted-foreground text-sm">{{
                  s.detail
                }}</span>
              </gr-item-content>
            </gr-item>
          }
        </div>
      </gr-card-content>
      <gr-card-footer>
        <ai-button class="w-full">View Full Report</ai-button>
      </gr-card-footer>
    </gr-card>
  `,
})
export class ContributionHistory {
  protected readonly data = [
    { month: 'Dec', amount: 800 },
    { month: 'Jan', amount: 1100 },
    { month: 'Feb', amount: 900 },
    { month: 'Mar', amount: 1300 },
    { month: 'Apr', amount: 750 },
    { month: 'May', amount: 1400 },
  ];
  protected readonly config = {
    amount: { label: 'Amount', color: 'var(--color-gray-500)' },
  };
  protected readonly summary = [
    { label: 'Upcoming', value: 'May 25, 2024', detail: '$1,000 scheduled' },
    {
      label: 'Auto-Save Plan',
      value: 'Accelerated',
      detail: 'Recurring weekly',
    },
  ];
}
