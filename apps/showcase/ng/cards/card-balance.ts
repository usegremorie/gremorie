import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, CardContent } from '@gremorie/ng-display';

const CREDIT_LIMIT = 7500;
const BALANCE = 1284.6;

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Showcase card (half width): the statement balance of a credit card. */
@Component({
  selector: 'showcase-card-balance',
  standalone: true,
  imports: [Card, CardContent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-content class="flex flex-col gap-1">
        <span class="text-muted-foreground text-sm">Card Balance</span>
        <span class="font-semibold text-2xl tabular-nums">{{ balance }}</span>
        <span class="text-muted-foreground text-sm tabular-nums"
          >{{ available }} available</span
        >
      </gr-card-content>
    </gr-card>
  `,
})
export class CardBalance {
  protected readonly balance = usd.format(BALANCE);
  protected readonly available = usd.format(CREDIT_LIMIT - BALANCE);
}
