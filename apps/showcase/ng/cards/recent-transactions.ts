import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCar,
  lucideCoffee,
  lucideEllipsis,
  lucideShoppingCart,
  lucideTv,
  lucideWallet,
} from '@ng-icons/lucide';
import { Button } from '@gremorie/ng-core';
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
} from '@gremorie/ng-display';

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
    icon: 'lucideCoffee',
  },
  {
    id: 'tx-2',
    merchant: 'Whole Foods Market',
    category: 'Groceries',
    date: 'Yesterday',
    amount: -142.3,
    icon: 'lucideShoppingCart',
  },
  {
    id: 'tx-3',
    merchant: 'Northwind Labs Payroll',
    category: 'Income',
    date: 'Nov 15',
    amount: 4200,
    icon: 'lucideWallet',
  },
  {
    id: 'tx-4',
    merchant: 'Uber Technologies',
    category: 'Transport',
    date: 'Nov 14',
    amount: -24.1,
    icon: 'lucideCar',
  },
  {
    id: 'tx-5',
    merchant: 'Netflix Subscription',
    category: 'Entertainment',
    date: 'Nov 12',
    amount: -15.49,
    icon: 'lucideTv',
  },
];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  signDisplay: 'always',
});

/** Showcase card: the latest account activity with per-row actions. */
@Component({
  selector: 'showcase-recent-transactions',
  standalone: true,
  imports: [
    Button,
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
    NgIcon,
  ],
  providers: [
    provideIcons({
      lucideCar,
      lucideCoffee,
      lucideEllipsis,
      lucideShoppingCart,
      lucideTv,
      lucideWallet,
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Recent Transactions</gr-card-title>
        <gr-card-description>Your latest account activity.</gr-card-description>
        <gr-card-action>
          <ai-button variant="outline">View All</ai-button>
        </gr-card-action>
      </gr-card-header>
      <gr-card-content>
        <gr-item-group>
          @for (t of transactions; track t.id; let first = $first) {
            @if (!first) {
              <gr-item-separator />
            }
            <gr-item role="listitem">
              <gr-item-media variant="featured">
                <!-- ng-icon sizes its svg from the host, out of reach of the
                     slot's 60% rule; both editions pin the glyph at size-5. -->
                <ng-icon [name]="t.icon" size="20" aria-hidden="true" />
              </gr-item-media>
              <gr-item-content>
                <gr-item-title>{{ t.merchant }}</gr-item-title>
                <gr-item-description>{{ t.category }}</gr-item-description>
              </gr-item-content>
              <span class="w-40 text-muted-foreground text-sm">{{
                t.date
              }}</span>
              <span
                class="w-28 text-right font-medium text-sm tabular-nums"
                [style.color]="t.credit ? 'var(--chart-status-success)' : null"
                >{{ t.amount }}</span
              >
              <gr-item-actions>
                <!-- gr-dropdown-menu throws on render in this build
                     (brain popover stateComputed), so the row keeps the
                     trigger and waits for the menu fix. -->
                <ai-button variant="ghost" size="icon">
                  <ng-icon name="lucideEllipsis" size="16" aria-hidden="true" />
                  <span class="sr-only">Actions for {{ t.merchant }}</span>
                </ai-button>
              </gr-item-actions>
            </gr-item>
          }
        </gr-item-group>
      </gr-card-content>
    </gr-card>
  `,
})
export class RecentTransactions {
  protected readonly transactions = TRANSACTIONS.map((t) => ({
    ...t,
    credit: t.amount > 0,
    amount: usd.format(t.amount),
  }));
}
