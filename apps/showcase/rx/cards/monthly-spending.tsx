import { PieChart } from '@gremorie/rx-data';
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';

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

const CONFIG = { amount: { label: 'Spent' } };

/** Showcase card: a month of personal spending by category. */
export function MonthlySpending() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
        <CardDescription>November, by category</CardDescription>
      </CardHeader>
      <CardContent>
        <PieChart
          centerLabel={`${percent.format(SPENT / BUDGET)} of ${usd.format(BUDGET)} budget`}
          centerValue={usd.format(SPENT)}
          config={CONFIG}
          data={CATEGORIES}
          dataKey="amount"
          donut
          framed={false}
          legend={false}
          nameKey="category"
        />
      </CardContent>
      <CardContent>
        <ul className="divide-y divide-border text-sm">
          {CATEGORIES.map((c) => (
            <li
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              key={c.category}
            >
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: c.fill }}
              />
              <span className="text-muted-foreground">{c.category}</span>
              <span className="ml-auto font-medium tabular-nums">
                {usd.format(c.amount)}
              </span>
              <span className="w-10 text-right text-muted-foreground tabular-nums">
                {percent.format(c.amount / SPENT)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
