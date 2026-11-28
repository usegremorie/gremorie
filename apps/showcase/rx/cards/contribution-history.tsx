import { BarChart } from '@gremorie/rx-data';
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
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';

const DATA = [
  { month: 'Dec', amount: 800 },
  { month: 'Jan', amount: 1100 },
  { month: 'Feb', amount: 900 },
  { month: 'Mar', amount: 1300 },
  { month: 'Apr', amount: 750 },
  { month: 'May', amount: 1400 },
];

const CONFIG = {
  amount: { label: 'Amount', color: 'var(--color-gray-500)' },
};

const SUMMARY = [
  { label: 'Upcoming', value: 'May 25, 2024', detail: '$1,000 scheduled' },
  { label: 'Auto-Save Plan', value: 'Accelerated', detail: 'Recurring weekly' },
];

/** Showcase card 1 (column 1): six months of contributions. */
export function ContributionHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contribution History</CardTitle>
        <CardDescription>Last 6 months of activity</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          data={DATA}
          config={CONFIG}
          xKey="month"
          yAxis={false}
          radius={6}
          framed={false}
          grid={false}
          className="h-[200px] w-full"
        />
      </CardContent>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {SUMMARY.map((s) => (
            <Item
              key={s.label}
              variant="muted"
              className="flex-col items-stretch"
            >
              <ItemContent className="gap-1">
                <ItemDescription className="font-medium text-xs uppercase tracking-wider">
                  {s.label}
                </ItemDescription>
                <span className="font-semibold text-lg">{s.value}</span>
                <span className="text-muted-foreground text-sm">
                  {s.detail}
                </span>
              </ItemContent>
            </Item>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">View Full Report</Button>
      </CardFooter>
    </Card>
  );
}
