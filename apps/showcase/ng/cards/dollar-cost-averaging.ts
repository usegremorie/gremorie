import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/ng-display';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/ng-overlays';

/**
 * Showcase card: a short explainer from a personal-finance learning
 * center, with the key term defined inline.
 */
@Component({
  selector: 'showcase-dollar-cost-averaging',
  standalone: true,
  imports: [
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Dollar-Cost Averaging</gr-card-title>
        <gr-card-description
          >A strategy for building wealth over time.</gr-card-description
        >
      </gr-card-header>
      <gr-card-content>
        <p class="text-muted-foreground text-sm leading-relaxed">
          Investing the same $200 every month smooths out the
          <gr-tooltip-provider>
            <gr-tooltip>
              <gr-tooltip-trigger class="inline">
                <button
                  class="cursor-help text-foreground underline decoration-dotted underline-offset-4"
                  type="button"
                >
                  average cost
                </button>
              </gr-tooltip-trigger>
              <gr-tooltip-content>
                Total invested divided by the shares you own.
              </gr-tooltip-content>
            </gr-tooltip>
          </gr-tooltip-provider>
          of your investments. When prices drop, your fixed amount buys more
          shares. When prices rise, it buys fewer. The result is usually a lower
          cost per share than a single lump-sum purchase during volatile
          periods.
        </p>
      </gr-card-content>
    </gr-card>
  `,
})
export class DollarCostAveraging {}
