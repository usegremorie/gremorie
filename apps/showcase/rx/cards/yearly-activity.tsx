import { BarChart } from '@gremorie/rx-data';
import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';

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

const DATA = MONTHS.map(([month, cashBack], i) => ({
  month,
  cashBack,
  fill: i === MONTHS.length - 1 ? 'var(--chart-seq-4)' : 'var(--chart-seq-2)',
}));

const TOTAL = MONTHS.reduce((sum, [, v]) => sum + v, 0);

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const CONFIG = {
  cashBack: { label: 'Cash back', color: 'var(--chart-seq-2)' },
};

/** Showcase card: a year of cash back earned on a credit card. */
export function YearlyActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Activity</CardTitle>
        <CardAction>
          <Badge className="tabular-nums" variant="secondary">
            +{usd.format(TOTAL)} cash back
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <BarChart
          className="h-24 w-full"
          config={CONFIG}
          data={DATA}
          framed={false}
          grid={false}
          radius={4}
          xKey="month"
          yAxis={false}
        />
      </CardContent>
    </Card>
  );
}
