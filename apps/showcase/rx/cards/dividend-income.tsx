import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { XIcon } from 'lucide-react';

// The last four quarters, oldest to newest. Quarters are an ordered scale,
// so each one takes a step of the sequential palette and the latest quarter
// (the one this card is about) gets the strongest step.
const QUARTERS = [
  { label: 'Q4 2025', fill: 'var(--chart-seq-2)' },
  { label: 'Q1 2026', fill: 'var(--chart-seq-3)' },
  { label: 'Q2 2026', fill: 'var(--chart-seq-4)' },
  { label: 'Q3 2026', fill: 'var(--chart-seq-5)' },
];

// Payouts per quarter, in USD: shares held times the dividend per share.
const HOLDINGS = [
  {
    name: 'Vanguard VIG',
    shares: 450,
    payouts: [376.2, 372.15, 380.7, 389.25],
  },
  {
    name: 'S&P 500 VOO',
    shares: 112,
    payouts: [207.2, 202.72, 194.88, 200.48],
  },
  { name: 'Coca-Cola KO', shares: 300, payouts: [153.0, 159.0, 159.0, 159.0] },
  {
    name: 'Realty Income',
    shares: 320,
    payouts: [257.28, 258.24, 258.72, 259.2],
  },
];

// One scale for every row, so bar heights compare across holdings too.
const MAX_PAYOUT = Math.max(...HOLDINGS.flatMap((h) => h.payouts));
const LATEST = QUARTERS.length - 1;
const TOTAL = HOLDINGS.reduce((sum, h) => sum + (h.payouts[LATEST] ?? 0), 0);

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Showcase card: one quarter of dividend income, per holding. */
export function DividendIncome() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Q3 Dividend Income</CardTitle>
        <CardDescription>
          {usd.format(TOTAL)} paid July to September across your portfolio
          holdings.
        </CardDescription>
        <CardAction>
          <Button
            aria-label="Close"
            className="bg-muted"
            size="icon"
            variant="ghost"
          >
            <XIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup className="gap-3">
          {HOLDINGS.map((h) => (
            <Item key={h.name} variant="muted">
              <ItemContent>
                <ItemTitle>{h.name}</ItemTitle>
                <ItemDescription>{h.shares} shares</ItemDescription>
              </ItemContent>
              <div
                aria-label={`Last four quarters: ${h.payouts
                  .map((p, i) => `${QUARTERS[i]?.label} ${usd.format(p)}`)
                  .join(', ')}`}
                className="flex h-10 items-end gap-1"
                role="img"
              >
                {h.payouts.map((p, i) => (
                  <span
                    className="w-4 rounded-xs"
                    key={QUARTERS[i]?.label}
                    style={{
                      backgroundColor: QUARTERS[i]?.fill,
                      height: `${(p / MAX_PAYOUT) * 100}%`,
                    }}
                  />
                ))}
              </div>
              <ItemActions className="w-20 justify-end font-semibold tabular-nums">
                {usd.format(h.payouts[LATEST] ?? 0)}
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      </CardContent>
      <CardFooter className="text-muted-foreground text-xs">
        Bars show the last four quarterly payouts, Q4 2025 to Q3 2026.
      </CardFooter>
    </Card>
  );
}
