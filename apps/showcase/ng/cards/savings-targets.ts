import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
} from '@gremorie/ng-display';
import { Progress } from '@gremorie/ng-feedback';

// Two long-term goals for 2026. Each bar is a status mark, so it takes the
// status slot of the data-viz palette: on track reads as success, behind
// schedule as warning. The bar recolors by scoping --primary to the slot.
const TARGETS = [
  {
    goal: 'Retirement',
    target: 420000,
    saved: 273000,
    status: 'On track',
    color: 'var(--chart-status-success)',
  },
  {
    goal: 'Home Down Payment',
    target: 85000,
    saved: 27200,
    status: 'Behind',
    color: 'var(--chart-status-warning)',
  },
];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Showcase card: yearly savings milestones and how far along each one is. */
@Component({
  selector: 'showcase-savings-targets',
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
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemHeader,
    Progress,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Savings Targets</gr-card-title>
        <gr-card-description>Active milestones for 2026</gr-card-description>
        <gr-card-action>
          <ai-button variant="outline">New Goal</ai-button>
        </gr-card-action>
      </gr-card-header>
      <gr-card-content class="flex flex-col gap-3">
        @for (t of targets; track t.goal) {
          <gr-item variant="muted" class="gap-3">
            <gr-item-header>
              <gr-item-description
                class="font-medium text-xs uppercase tracking-wider"
                >{{ t.goal }}</gr-item-description
              >
              <span
                class="flex items-center gap-1.5 text-muted-foreground text-xs"
              >
                <span
                  aria-hidden="true"
                  class="size-2 rounded-full"
                  [style.background-color]="t.color"
                ></span>
                {{ t.status }}
              </span>
            </gr-item-header>
            <gr-item-content class="gap-3">
              <span class="font-semibold text-3xl tabular-nums">{{
                t.target
              }}</span>
              <gr-progress
                [attr.aria-label]="t.goal + ' progress'"
                [style.--primary]="t.color"
                [value]="t.percent"
              />
            </gr-item-content>
            <gr-item-footer class="text-sm">
              <span class="text-muted-foreground"
                >{{ t.percent }}% achieved</span
              >
              <span class="font-medium tabular-nums">{{ t.saved }}</span>
            </gr-item-footer>
          </gr-item>
        }
      </gr-card-content>
      <gr-card-footer>
        <p class="text-muted-foreground text-sm">
          1 of 2 targets is behind schedule this year.
        </p>
      </gr-card-footer>
    </gr-card>
  `,
})
export class SavingsTargets {
  protected readonly targets = TARGETS.map((t) => ({
    goal: t.goal,
    status: t.status,
    color: t.color,
    target: usd.format(t.target),
    saved: usd.format(t.saved),
    percent: Math.round((t.saved / t.target) * 100),
  }));
}
