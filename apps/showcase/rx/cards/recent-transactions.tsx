import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@gremorie/rx-overlays';
import {
  CarIcon,
  CoffeeIcon,
  EllipsisIcon,
  ShoppingCartIcon,
  TvIcon,
  WalletIcon,
} from 'lucide-react';
import { Fragment } from 'react';

// The last five movements on a checking account, newest first (today is
// Saturday, November 21, 2026). Money in is a status mark, so a credit takes
// the success slot of the data-viz palette; debits stay neutral.
const TRANSACTIONS = [
  {
    id: 'tx-1',
    merchant: 'Blue Bottle Coffee',
    category: 'Food & Drink',
    date: 'Today, 10:24 AM',
    amount: -6.5,
    icon: CoffeeIcon,
  },
  {
    id: 'tx-2',
    merchant: 'Whole Foods Market',
    category: 'Groceries',
    date: 'Yesterday',
    amount: -142.3,
    icon: ShoppingCartIcon,
  },
  {
    id: 'tx-3',
    merchant: 'Northwind Labs Payroll',
    category: 'Income',
    date: 'Nov 15',
    amount: 4200,
    icon: WalletIcon,
  },
  {
    id: 'tx-4',
    merchant: 'Uber Technologies',
    category: 'Transport',
    date: 'Nov 14',
    amount: -24.1,
    icon: CarIcon,
  },
  {
    id: 'tx-5',
    merchant: 'Netflix Subscription',
    category: 'Entertainment',
    date: 'Nov 12',
    amount: -15.49,
    icon: TvIcon,
  },
];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  signDisplay: 'always',
});

/** Showcase card: the latest account activity with per-row actions. */
export function RecentTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest account activity.</CardDescription>
        <CardAction>
          <Button variant="outline">View All</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {TRANSACTIONS.map((t, i) => (
            <Fragment key={t.id}>
              {i > 0 && <ItemSeparator />}
              <Item role="listitem">
                <ItemMedia variant="featured">
                  <t.icon className="size-5" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{t.merchant}</ItemTitle>
                  <ItemDescription>{t.category}</ItemDescription>
                </ItemContent>
                <span className="w-40 text-muted-foreground text-sm">
                  {t.date}
                </span>
                <span
                  className="w-28 text-right font-medium text-sm tabular-nums"
                  style={
                    t.amount > 0
                      ? { color: 'var(--chart-status-success)' }
                      : undefined
                  }
                >
                  {usd.format(t.amount)}
                </span>
                <ItemActions>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <EllipsisIcon />
                        <span className="sr-only">
                          Actions for {t.merchant}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Change category</DropdownMenuItem>
                      <DropdownMenuItem>Split transaction</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        Report a problem
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </ItemActions>
              </Item>
            </Fragment>
          ))}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
