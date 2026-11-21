import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  Separator,
} from '@gremorie/ng-display';

// October streaming royalties for an independent artist, held until a bank
// account is connected. The processing fee is 3% of net royalties.
const NET_ROYALTIES = 1284.6;
const PROCESSING_FEE = -38.54;
const TOTAL = NET_ROYALTIES + PROCESSING_FEE;

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Showcase card: a royalty balance that is ready but not yet claimable. */
@Component({
  selector: 'showcase-claimable-balance',
  standalone: true,
  imports: [
    Badge,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    Separator,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header class="gap-2">
        <gr-card-description>Claimable Balance</gr-card-description>
        <p class="font-semibold text-5xl tabular-nums tracking-tight">
          {{ total }}
        </p>
        <gr-badge variant="outline">
          <!-- Status dot from the data-viz status scale. -->
          <span
            aria-hidden="true"
            class="size-2 rounded-full"
            style="background-color: var(--chart-status-warning)"
          ></span>
          Pending Setup
        </gr-badge>
      </gr-card-header>
      <gr-card-content>
        <dl class="flex flex-col gap-3 rounded-xl bg-muted/50 p-4 text-sm">
          @for (r of rows; track r.label) {
            <div class="flex items-center justify-between">
              <dt class="text-muted-foreground">{{ r.label }}</dt>
              <dd class="font-medium tabular-nums">{{ r.value }}</dd>
            </div>
          }
          <gr-separator />
          <div class="flex items-center justify-between">
            <dt class="text-muted-foreground">Total Ready to Claim</dt>
            <dd class="font-semibold tabular-nums">{{ total }} USD</dd>
          </div>
        </dl>
      </gr-card-content>
      <gr-card-footer class="text-muted-foreground text-sm">
        Once your bank is connected, balances over $10.00 are paid out
        automatically on the 15th of each month. Your next payout is December
        15.
      </gr-card-footer>
    </gr-card>
  `,
})
export class ClaimableBalance {
  protected readonly total = usd.format(TOTAL);
  protected readonly rows = [
    { label: 'Net Royalties', value: usd.format(NET_ROYALTIES) },
    { label: 'Processing Fee', value: usd.format(PROCESSING_FEE) },
  ];
}
