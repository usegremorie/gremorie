import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@gremorie/rx-display';
import { Calendar } from '@gremorie/rx-forms';
import { useState } from 'react';

// Scheduled bills around late November 2026. The list shows the next three
// due on or after the selected day.
const PAYMENTS = [
  { name: 'Phone Plan', due: new Date(2026, 10, 18), amount: 65 },
  { name: 'Streaming Bundle', due: new Date(2026, 10, 24), amount: 22.99 },
  { name: 'Auto Insurance', due: new Date(2026, 10, 28), amount: 142 },
  { name: 'Rent', due: new Date(2026, 11, 1), amount: 2150 },
  { name: 'Electricity', due: new Date(2026, 11, 4), amount: 96.4 },
  { name: 'Gym Membership', due: new Date(2026, 11, 9), amount: 39 },
];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const day = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const upcoming = (from: Date) =>
  PAYMENTS.filter((p) => p.due >= from).slice(0, 3);

/** Showcase card: pick a day on the calendar to see the bills coming up. */
export function UpcomingPayments() {
  const [selected, setSelected] = useState<Date>(new Date(2026, 10, 21));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Payments</CardTitle>
        <CardDescription>
          Select a date to view scheduled payments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center rounded-xl border border-border">
          <Calendar
            className="relative"
            defaultMonth={selected}
            mode="single"
            onSelect={(d) => d && setSelected(d)}
            required
            selected={selected}
          />
        </div>
      </CardContent>
      <CardContent>
        <ItemGroup className="gap-3">
          {upcoming(selected).map((p) => (
            <Item key={p.name} variant="muted">
              <ItemContent>
                <ItemTitle>{p.name}</ItemTitle>
                <ItemDescription>{day.format(p.due)}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge className="tabular-nums" variant="secondary">
                  {usd.format(p.amount)}
                </Badge>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
