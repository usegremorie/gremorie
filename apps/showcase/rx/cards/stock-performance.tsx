import { AreaChart } from '@gremorie/rx-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import {
  Field,
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gremorie/rx-forms';
import { useState } from 'react';

// Month-end closes, June to November 2026, for three index funds a
// personal-finance user might hold. The chart plots the return since June
// (the y scale starts at zero, so raw prices would read as a flat band).
// One series, so it takes the first slot of the categorical palette; the
// change since June is a status mark.
const TICKERS = {
  VOO: { name: 'S&P 500 ETF', closes: [552, 561, 556, 570, 584, 579] },
  VTI: { name: 'Total Market ETF', closes: [301, 306, 303, 311, 318, 315] },
  QQQ: { name: 'Nasdaq-100 ETF', closes: [528, 541, 533, 556, 571, 563] },
} as const;

type Ticker = keyof typeof TICKERS;

const MONTHS = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];

const CONFIG = {
  returnPct: { label: 'Return (%)', color: 'var(--chart-cat-1)' },
};

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const change = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
  signDisplay: 'always',
});

/** Showcase card: six months of closing prices for a chosen fund. */
export function StockPerformance() {
  const [ticker, setTicker] = useState<Ticker>('VOO');
  const closes = TICKERS[ticker].closes;
  const first = closes[0];
  const last = closes[closes.length - 1];
  const delta = (last - first) / first;
  const data = MONTHS.map((month, i) => ({
    month,
    returnPct: Math.round(((closes[i] - first) / first) * 1000) / 10,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock Performance</CardTitle>
        <CardDescription>6-month return, month-end close.</CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <FieldLabel htmlFor="stock-ticker">Ticker</FieldLabel>
          <Select
            onValueChange={(value) => setTicker(value as Ticker)}
            value={ticker}
          >
            <SelectTrigger className="w-full" id="stock-ticker">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(TICKERS) as Ticker[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {t} · {TICKERS[t].name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </CardContent>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <span className="font-semibold text-2xl tabular-nums">
            {usd.format(last)}
          </span>
          <span
            className="font-medium text-sm tabular-nums"
            style={{
              color:
                delta >= 0
                  ? 'var(--chart-status-success)'
                  : 'var(--chart-status-error)',
            }}
          >
            {change.format(delta)} since Jun
          </span>
        </div>
        <AreaChart config={CONFIG} data={data} xKey="month" yAxis={false} />
      </CardContent>
    </Card>
  );
}
