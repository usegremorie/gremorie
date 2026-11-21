import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BarChart } from '@gremorie/ng-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@gremorie/ng-display';
import { Progress } from '@gremorie/ng-feedback';

// Whole-home draw in kW, every two hours of a weekday. Each bar takes a step
// of the sequential palette by load (light, moderate, heavy), so the evening
// peak reads at a glance.
const HOURS = [
  ['6a', 1.1],
  ['8a', 2.6],
  ['10a', 2.2],
  ['12p', 1.7],
  ['2p', 1.9],
  ['4p', 2.8],
  ['6p', 4.1],
  ['8p', 3.4],
] as const;

const loadFill = (kw: number) =>
  kw >= 3
    ? 'var(--chart-seq-4)'
    : kw >= 2
      ? 'var(--chart-seq-3)'
      : 'var(--chart-seq-2)';

/** Showcase card: a smart-home energy view with draw, solar and battery. */
@Component({
  selector: 'showcase-power-usage',
  standalone: true,
  imports: [
    BarChart,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Progress,
    Separator,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Power Usage</gr-card-title>
        <gr-card-description>Whole home, today</gr-card-description>
      </gr-card-header>
      <gr-card-content>
        <bar-chart
          class="h-40 w-full"
          [config]="config"
          [data]="data"
          [framed]="false"
          [grid]="false"
          [radius]="4"
          xKey="hour"
          [yAxis]="false"
        />
      </gr-card-content>
      <gr-card-content>
        <gr-separator />
      </gr-card-content>
      <gr-card-content>
        <dl class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <dt class="text-muted-foreground text-sm">Currently Using</dt>
            <dd class="font-semibold text-lg tabular-nums">3.4 kW</dd>
          </div>
          <div class="flex flex-col gap-1">
            <dt class="text-muted-foreground text-sm">Solar Generation</dt>
            <dd class="font-semibold text-lg tabular-nums">+1.2 kW</dd>
          </div>
        </dl>
      </gr-card-content>
      <gr-card-content class="flex flex-col gap-2">
        <span class="text-muted-foreground text-sm" id="battery-level"
          >Battery Level</span
        >
        <div class="flex items-center gap-3">
          <gr-progress
            aria-labelledby="battery-level"
            class="[&_[data-slot=progress-indicator]]:bg-(--chart-status-success)"
            [value]="battery"
          />
          <span class="font-medium text-sm tabular-nums">{{ battery }}%</span>
        </div>
      </gr-card-content>
    </gr-card>
  `,
})
export class PowerUsage {
  protected readonly battery = 85;
  protected readonly config = {
    kw: { label: 'kW', color: 'var(--chart-seq-3)' },
  };
  protected readonly data = HOURS.map(([hour, kw]) => ({
    hour,
    kw,
    fill: loadFill(kw),
  }));
}
