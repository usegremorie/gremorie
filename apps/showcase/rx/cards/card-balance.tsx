import { Card, CardContent } from '@gremorie/rx-display';

const CREDIT_LIMIT = 7500;
const BALANCE = 1284.6;

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Showcase card (half width): the statement balance of a credit card. */
export function CardBalance() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1">
        <span className="text-muted-foreground text-sm">Card Balance</span>
        <span className="font-semibold text-2xl tabular-nums">
          {usd.format(BALANCE)}
        </span>
        <span className="text-muted-foreground text-sm tabular-nums">
          {usd.format(CREDIT_LIMIT - BALANCE)} available
        </span>
      </CardContent>
    </Card>
  );
}
