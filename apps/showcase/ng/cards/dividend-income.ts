import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { Button } from '@gremorie/ng-core';
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
} from '@gremorie/ng-display';

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
@Component({
  selector: 'showcase-dividend-income',
  standalone: true,
  imports: [
    Button,
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
    NgIcon,
  ],
  providers: [provideIcons({ lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Q3 Dividend Income</gr-card-title>
        <gr-card-description>
          {{ total }} paid July to September across your portfolio holdings.
        </gr-card-description>
        <gr-card-action>
          <ai-button
            ariaLabel="Close"
            class="bg-muted"
            size="icon"
            variant="ghost"
          >
            <ng-icon name="lucideX" aria-hidden="true" />
          </ai-button>
        </gr-card-action>
      </gr-card-header>
      <gr-card-content>
        <gr-item-group class="gap-3">
          @for (h of rows; track h.name) {
            <gr-item variant="muted">
              <gr-item-content>
                <gr-item-title>{{ h.name }}</gr-item-title>
                <gr-item-description>{{ h.shares }} shares</gr-item-description>
              </gr-item-content>
              <div
                class="flex h-10 items-end gap-1"
                role="img"
                [attr.aria-label]="h.summary"
              >
                @for (b of h.bars; track b.label) {
                  <span
                    class="w-4 rounded-xs"
                    [style.background-color]="b.fill"
                    [style.height.%]="b.height"
                  ></span>
                }
              </div>
              <gr-item-actions
                class="w-20 justify-end font-semibold tabular-nums"
                >{{ h.latest }}</gr-item-actions
              >
            </gr-item>
          }
        </gr-item-group>
      </gr-card-content>
      <gr-card-footer class="text-muted-foreground text-xs">
        Bars show the last four quarterly payouts, Q4 2025 to Q3 2026.
      </gr-card-footer>
    </gr-card>
  `,
})
export class DividendIncome {
  protected readonly total = usd.format(TOTAL);
  protected readonly rows = HOLDINGS.map((h) => ({
    name: h.name,
    shares: h.shares,
    latest: usd.format(h.payouts[LATEST] ?? 0),
    summary: `Last four quarters: ${h.payouts
      .map((p, i) => `${QUARTERS[i]?.label} ${usd.format(p)}`)
      .join(', ')}`,
    bars: h.payouts.map((p, i) => ({
      label: QUARTERS[i]?.label,
      fill: QUARTERS[i]?.fill,
      height: (p / MAX_PAYOUT) * 100,
    })),
  }));
}
