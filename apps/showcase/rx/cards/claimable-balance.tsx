import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  Separator,
} from '@gremorie/rx-display';

// October streaming royalties for an independent artist, held until a bank
// account is connected. The processing fee is 3% of net royalties.
const NET_ROYALTIES = 1284.6;
const PROCESSING_FEE = -38.54;
const TOTAL = NET_ROYALTIES + PROCESSING_FEE;

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const ROWS = [
  { label: 'Net Royalties', value: usd.format(NET_ROYALTIES) },
  { label: 'Processing Fee', value: usd.format(PROCESSING_FEE) },
];

/** Showcase card: a royalty balance that is ready but not yet claimable. */
export function ClaimableBalance() {
  return (
    <Card>
      <CardHeader className="gap-2">
        <CardDescription>Claimable Balance</CardDescription>
        <p className="font-semibold text-5xl tabular-nums tracking-tight">
          {usd.format(TOTAL)}
        </p>
        <Badge variant="outline">
          {/* Status dot from the data-viz status scale. */}
          <span
            aria-hidden="true"
            className="size-2 rounded-full"
            style={{ backgroundColor: 'var(--chart-status-warning)' }}
          />
          Pending Setup
        </Badge>
      </CardHeader>
      <CardContent>
        <dl className="flex flex-col gap-3 rounded-xl bg-muted/50 p-4 text-sm">
          {ROWS.map((r) => (
            <div className="flex items-center justify-between" key={r.label}>
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd className="font-medium tabular-nums">{r.value}</dd>
            </div>
          ))}
          <Separator />
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">Total Ready to Claim</dt>
            <dd className="font-semibold tabular-nums">
              {usd.format(TOTAL)} USD
            </dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm">
        Once your bank is connected, balances over $10.00 are paid out
        automatically on the 15th of each month. Your next payout is December
        15.
      </CardFooter>
    </Card>
  );
}
