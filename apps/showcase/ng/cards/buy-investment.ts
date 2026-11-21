import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { Button } from '@gremorie/ng-core';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gremorie/ng-display';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@gremorie/ng-forms';

// A market buy of a broad index fund. Estimated shares follow the amount
// at the last traded price; the order can't exceed the buying power.
const PRICE = 512.4;
const BUYING_POWER = 12450;

const ORDER_TYPES = [
  {
    value: 'market',
    label: 'Market Order',
    hint: 'Market orders execute at the current price.',
  },
  {
    value: 'limit',
    label: 'Limit Order',
    hint: 'Limit orders execute only at your price or better.',
  },
  {
    value: 'stop',
    label: 'Stop Order',
    hint: 'Stop orders turn into market orders once the stop price is hit.',
  },
];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const shares = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

/** Showcase card: a buy order for VTI, sized in dollars. */
@Component({
  selector: 'showcase-buy-investment',
  standalone: true,
  imports: [
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Buy Investment</gr-card-title>
        <gr-card-description
          >VTI · Vanguard Total Stock Market at {{ price }}</gr-card-description
        >
      </gr-card-header>
      <gr-card-content>
        <gr-field-group class="gap-6">
          <gr-field>
            <gr-field-label for="invest-amount"
              >Amount to Invest</gr-field-label
            >
            <!-- The group input has no value output; the native input
                 event bubbles to the group, which is enough here. -->
            <gr-input-group (input)="onAmount($event)">
              <gr-input-group-addon>
                <gr-input-group-text>$</gr-input-group-text>
              </gr-input-group-addon>
              <gr-input-group-input
                id="invest-amount"
                [value]="amount()"
                [ariaInvalid]="!valid()"
              />
            </gr-input-group>
          </gr-field>
          <gr-field>
            <!-- gr-select-trigger takes no id, so this label cannot point at it. -->
            <gr-field-label>Order Type</gr-field-label>
            <gr-select [(value)]="orderType" [itemToString]="labelOf">
              <gr-select-trigger class="w-full">
                <gr-select-value />
              </gr-select-trigger>
              <gr-select-content>
                @for (o of orderTypes; track o.value) {
                  <gr-select-item [value]="o.value">{{
                    o.label
                  }}</gr-select-item>
                }
              </gr-select-content>
            </gr-select>
            <gr-field-description>{{ hint() }}</gr-field-description>
          </gr-field>
          <dl class="flex flex-col gap-2 text-sm">
            <div class="flex justify-between">
              <dt class="text-muted-foreground">Estimated Shares</dt>
              <dd class="font-medium tabular-nums">{{ estimated() }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-muted-foreground">Buying Power</dt>
              <dd class="font-medium tabular-nums">{{ buyingPower }}</dd>
            </div>
          </dl>
        </gr-field-group>
      </gr-card-content>
      <gr-card-footer class="flex-col gap-3">
        <ai-button class="w-full" [disabled]="!valid()">Review Order</ai-button>
        <p class="text-balance text-center text-muted-foreground text-sm">
          Trades are typically executed within minutes during market hours.
        </p>
      </gr-card-footer>
    </gr-card>
  `,
})
export class BuyInvestment {
  protected readonly orderTypes = ORDER_TYPES;
  protected readonly price = usd.format(PRICE);
  protected readonly buyingPower = usd.format(BUYING_POWER);
  protected readonly amount = signal('1,000.00');
  protected readonly orderType = signal<string | undefined>('market');

  private readonly numeric = computed(() =>
    Number(this.amount().replace(/,/g, '')),
  );
  protected readonly valid = computed(
    () => this.numeric() > 0 && this.numeric() <= BUYING_POWER,
  );
  protected readonly estimated = computed(() =>
    this.valid() ? shares.format(this.numeric() / PRICE) : '0',
  );
  protected readonly hint = computed(
    () => ORDER_TYPES.find((o) => o.value === this.orderType())?.hint,
  );
  protected readonly labelOf = (value: string) =>
    ORDER_TYPES.find((o) => o.value === value)?.label ?? '';

  protected onAmount(event: Event): void {
    this.amount.set((event.target as HTMLInputElement).value);
  }
}
