import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
} from '@gremorie/rx-display';
import { Progress } from '@gremorie/rx-feedback';
import { Button } from '@gremorie/rx-forms';
import type { CSSProperties } from 'react';

// Two long-term goals for 2026. Each bar is a status mark, so it takes the
// status slot of the data-viz palette: on track reads as success, behind
// schedule as warning. The bar recolors by scoping --primary to the slot.
const TARGETS = [
  {
    goal: 'Retirement',
    target: 420000,
    saved: 273000,
    status: 'On track',
    color: 'var(--chart-status-success)',
  },
  {
    goal: 'Home Down Payment',
    target: 85000,
    saved: 27200,
    status: 'Behind',
    color: 'var(--chart-status-warning)',
  },
];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Showcase card: yearly savings milestones and how far along each one is. */
export function SavingsTargets() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Targets</CardTitle>
        <CardDescription>Active milestones for 2026</CardDescription>
        <CardAction>
          <Button variant="outline">New Goal</Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {TARGETS.map((t) => {
          const percent = Math.round((t.saved / t.target) * 100);
          return (
            <Item className="gap-3" key={t.goal} variant="muted">
              <ItemHeader>
                <ItemDescription className="font-medium text-xs uppercase tracking-wider">
                  {t.goal}
                </ItemDescription>
                <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full"
                    style={{ backgroundColor: t.color }}
                  />
                  {t.status}
                </span>
              </ItemHeader>
              <ItemContent className="gap-3">
                <span className="font-semibold text-3xl tabular-nums">
                  {usd.format(t.target)}
                </span>
                <Progress
                  aria-label={`${t.goal} progress`}
                  style={{ '--primary': t.color } as CSSProperties}
                  value={percent}
                />
              </ItemContent>
              <ItemFooter className="text-sm">
                <span className="text-muted-foreground">
                  {percent}% achieved
                </span>
                <span className="font-medium tabular-nums">
                  {usd.format(t.saved)}
                </span>
              </ItemFooter>
            </Item>
          );
        })}
      </CardContent>
      <CardFooter>
        <p className="text-muted-foreground text-sm">
          1 of 2 targets is behind schedule this year.
        </p>
      </CardFooter>
    </Card>
  );
}
