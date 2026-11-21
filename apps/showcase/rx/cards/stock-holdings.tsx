import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@gremorie/rx-display';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  ToggleGroup,
  ToggleGroupItem,
} from '@gremorie/rx-forms';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

// A brokerage portfolio. Asset class is a category, so each class owns a
// slot of the categorical data-viz palette (stock, ETF, REIT); the return
// since purchase is a status mark (success up, error down).
const CLASSES = [
  {
    value: 'stock',
    label: 'Stocks',
    badge: 'Stock',
    color: 'var(--chart-cat-1)',
  },
  { value: 'etf', label: 'ETFs', badge: 'ETF', color: 'var(--chart-cat-2)' },
  { value: 'reit', label: 'REITs', badge: 'REIT', color: 'var(--chart-cat-3)' },
];

const HOLDINGS = [
  {
    ticker: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    shares: 112,
    since: 'Jan 2021',
    assetClass: 'etf',
    value: 62384.0,
    change: 0.482,
  },
  {
    ticker: 'VIG',
    name: 'Vanguard Dividend Appreciation',
    shares: 450,
    since: 'Mar 2022',
    assetClass: 'etf',
    value: 92407.5,
    change: 0.271,
  },
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    shares: 85,
    since: 'Nov 2020',
    assetClass: 'stock',
    value: 23618.95,
    change: 0.912,
  },
  {
    ticker: 'O',
    name: 'Realty Income Corp',
    shares: 320,
    since: 'Jun 2023',
    assetClass: 'reit',
    value: 18604.8,
    change: -0.034,
  },
];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1,
  signDisplay: 'always',
});

/** Showcase card: portfolio holdings, searchable and filtered by class. */
export function StockHoldings() {
  const [query, setQuery] = useState('');
  const [classes, setClasses] = useState<string[]>([]);
  const q = query.trim().toLowerCase();
  const rows = HOLDINGS.filter(
    (h) =>
      (classes.length === 0 || classes.includes(h.assetClass)) &&
      (!q ||
        h.ticker.toLowerCase().includes(q) ||
        h.name.toLowerCase().includes(q)),
  );
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <InputGroup className="w-96">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput
              aria-label="Search holdings"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search holdings or tickers..."
              value={query}
            />
          </InputGroup>
          <ToggleGroup
            aria-label="Filter by asset class"
            onValueChange={setClasses}
            spacing={2}
            type="multiple"
            value={classes}
            variant="outline"
          >
            {CLASSES.map((c) => (
              <ToggleGroupItem key={c.value} value={c.value}>
                {c.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {rows.map((h) => {
          const assetClass = CLASSES.find((c) => c.value === h.assetClass);
          return (
            <Item key={h.ticker} variant="muted">
              <ItemMedia
                className="font-semibold text-foreground text-xs tracking-tight"
                variant="featured"
              >
                {h.ticker}
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{h.name}</ItemTitle>
                <ItemDescription className="uppercase tracking-wider">
                  {h.shares} shares · {h.since}
                </ItemDescription>
              </ItemContent>
              <ItemActions className="gap-6">
                <Badge variant="outline">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: assetClass?.color }}
                  />
                  {assetClass?.badge}
                </Badge>
                <div className="flex w-28 flex-col items-end gap-0.5">
                  <span className="font-medium text-sm tabular-nums">
                    {usd.format(h.value)}
                  </span>
                  <span
                    className="text-xs tabular-nums"
                    style={{
                      color:
                        h.change >= 0
                          ? 'var(--chart-status-success)'
                          : 'var(--chart-status-error)',
                    }}
                  >
                    {percent.format(h.change)}
                  </span>
                </div>
              </ItemActions>
            </Item>
          );
        })}
        {rows.length === 0 && (
          <p className="py-6 text-center text-muted-foreground text-sm">
            No holdings match your search.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
