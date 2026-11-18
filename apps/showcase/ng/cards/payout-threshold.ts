import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
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
} from '@gremorie/ng-display';
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Textarea,
} from '@gremorie/ng-forms';

/** shadcn reference card 2 (column 2): minimum payout settings. */
@Component({
  selector: 'showcase-payout-threshold',
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
    Label,
    NgIcon,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Slider,
    Textarea,
  ],
  providers: [provideIcons({ lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Payout Threshold</gr-card-title>
        <gr-card-description>
          Set the minimum balance required before a payout is triggered.
        </gr-card-description>
        <gr-card-action>
          <ai-button
            variant="ghost"
            size="icon"
            class="bg-muted"
            ariaLabel="Close"
          >
            <ng-icon name="lucideX" aria-hidden="true" />
          </ai-button>
        </gr-card-action>
      </gr-card-header>
      <gr-card-content>
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-3">
            <gr-label for="preferred-currency">Preferred Currency</gr-label>
            <gr-select [value]="'usd'" [itemToString]="currencyLabel">
              <gr-select-trigger id="preferred-currency" class="w-full">
                <gr-select-value />
              </gr-select-trigger>
              <gr-select-content>
                <gr-select-item value="usd"
                  >USD — United States Dollar</gr-select-item
                >
                <gr-select-item value="eur">EUR — Euro</gr-select-item>
                <gr-select-item value="gbp">GBP — British Pound</gr-select-item>
              </gr-select-content>
            </gr-select>
          </div>
          <div class="flex flex-col gap-3">
            <div class="flex items-baseline justify-between">
              <gr-label for="min-payout">Minimum Payout Amount</gr-label>
              <span class="font-semibold text-2xl tabular-nums"
                >\${{ amount()[0].toFixed(2) }}</span
              >
            </div>
            <gr-slider
              [(value)]="amount"
              [min]="50"
              [max]="10000"
              [step]="50"
              thumbAriaLabel="Minimum payout amount"
            />
            <div
              class="flex items-center justify-between text-muted-foreground text-sm"
            >
              <span>$50 (MIN)</span>
              <span>$10,000 (MAX)</span>
            </div>
          </div>
          <div class="flex flex-col gap-3">
            <gr-label for="payout-notes">Notes</gr-label>
            <gr-textarea
              id="payout-notes"
              placeholder="Add any notes for this payout configuration..."
              class="min-h-[100px]"
            />
          </div>
        </div>
      </gr-card-content>
      <gr-card-footer>
        <ai-button class="w-full">Save Threshold</ai-button>
      </gr-card-footer>
    </gr-card>
  `,
})
export class PayoutThreshold {
  protected readonly amount = signal([2500]);
  protected readonly currencies: Record<string, string> = {
    usd: 'USD — United States Dollar',
    eur: 'EUR — Euro',
    gbp: 'GBP — British Pound',
  };
  protected readonly currencyLabel = (value: string) =>
    this.currencies[value] ?? value;
}
