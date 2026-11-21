import { BarChart } from '@gremorie/rx-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from '@gremorie/rx-display';
import { Progress } from '@gremorie/rx-feedback';

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

const DATA = HOURS.map(([hour, kw]) => ({ hour, kw, fill: loadFill(kw) }));

const CONFIG = { kw: { label: 'kW', color: 'var(--chart-seq-3)' } };

const BATTERY = 85;

/** Showcase card: a smart-home energy view with draw, solar and battery. */
export function PowerUsage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Power Usage</CardTitle>
        <CardDescription>Whole home, today</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          className="h-40 w-full"
          config={CONFIG}
          data={DATA}
          framed={false}
          grid={false}
          radius={4}
          xKey="hour"
          yAxis={false}
        />
      </CardContent>
      <CardContent>
        <Separator />
      </CardContent>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-sm">Currently Using</dt>
            <dd className="font-semibold text-lg tabular-nums">3.4 kW</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-sm">Solar Generation</dt>
            <dd className="font-semibold text-lg tabular-nums">+1.2 kW</dd>
          </div>
        </dl>
      </CardContent>
      <CardContent className="flex flex-col gap-2">
        <span className="text-muted-foreground text-sm" id="battery-level">
          Battery Level
        </span>
        <div className="flex items-center gap-3">
          <Progress
            aria-labelledby="battery-level"
            className="[&_[data-slot=progress-indicator]]:bg-(--chart-status-success)"
            value={BATTERY}
          />
          <span className="font-medium text-sm tabular-nums">{BATTERY}%</span>
        </div>
      </CardContent>
    </Card>
  );
}
