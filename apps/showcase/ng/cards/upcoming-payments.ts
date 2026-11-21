import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from '@gremorie/ng-display';
import { Calendar } from '@gremorie/ng-forms';

// Scheduled bills around late November 2026. The list shows the next three
// due on or after the selected day.
const PAYMENTS = [
  { name: 'Phone Plan', due: new Date(2026, 10, 18), amount: 65 },
  { name: 'Streaming Bundle', due: new Date(2026, 10, 24), amount: 22.99 },
  { name: 'Auto Insurance', due: new Date(2026, 10, 28), amount: 142 },
  { name: 'Rent', due: new Date(2026, 11, 1), amount: 2150 },
  { name: 'Electricity', due: new Date(2026, 11, 4), amount: 96.4 },
  { name: 'Gym Membership', due: new Date(2026, 11, 9), amount: 39 },
];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const day = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

/** Showcase card: pick a day on the calendar to see the bills coming up. */
@Component({
  selector: 'showcase-upcoming-payments',
  standalone: true,
  imports: [
    Badge,
    Calendar,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemTitle,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Upcoming Payments</gr-card-title>
        <gr-card-description>
          Select a date to view scheduled payments.
        </gr-card-description>
      </gr-card-header>
      <gr-card-content>
        <div class="flex justify-center rounded-xl border border-border">
          <gr-calendar [date]="selected()" (dateChange)="select($event)" />
        </div>
      </gr-card-content>
      <gr-card-content>
        <gr-item-group class="gap-3">
          @for (p of upcoming(); track p.name) {
            <gr-item variant="muted">
              <gr-item-content>
                <gr-item-title>{{ p.name }}</gr-item-title>
                <gr-item-description>{{ p.due }}</gr-item-description>
              </gr-item-content>
              <gr-item-actions>
                <gr-badge class="tabular-nums" variant="secondary">{{
                  p.amount
                }}</gr-badge>
              </gr-item-actions>
            </gr-item>
          }
        </gr-item-group>
      </gr-card-content>
    </gr-card>
  `,
})
export class UpcomingPayments {
  protected readonly selected = signal(new Date(2026, 10, 21));
  protected readonly upcoming = computed(() =>
    PAYMENTS.filter((p) => p.due >= this.selected())
      .slice(0, 3)
      .map((p) => ({
        name: p.name,
        due: day.format(p.due),
        amount: usd.format(p.amount),
      })),
  );

  protected select(date: Date | undefined) {
    if (date) this.selected.set(date);
  }
}
