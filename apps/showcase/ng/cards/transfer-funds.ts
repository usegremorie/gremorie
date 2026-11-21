import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
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
  Separator,
} from '@gremorie/ng-display';
import {
  Field,
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

const ACCOUNTS = [
  { value: 'checking', label: 'Everyday Checking (··8402) · $8,940.12' },
  { value: 'savings', label: 'High-Yield Savings (··1192) · $24,310.55' },
  { value: 'joint', label: 'Joint Household (··3307) · $3,415.80' },
];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/** Showcase card: move money between two of your own accounts. */
@Component({
  selector: 'showcase-transfer-funds',
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
    Field,
    FieldGroup,
    FieldLabel,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
    NgIcon,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Separator,
  ],
  providers: [provideIcons({ lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Transfer Funds</gr-card-title>
        <gr-card-description>
          Move money between your connected accounts.
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
        <gr-field-group class="gap-6">
          <gr-field>
            <gr-field-label for="transfer-amount"
              >Amount to Transfer</gr-field-label
            >
            <gr-input-group>
              <gr-input-group-addon align="inline-start">
                <gr-input-group-text>$</gr-input-group-text>
              </gr-input-group-addon>
              <gr-input-group-input
                id="transfer-amount"
                [value]="amount()"
                (input)="onAmount($event)"
              />
            </gr-input-group>
          </gr-field>
          <gr-field>
            <gr-field-label for="transfer-from">From Account</gr-field-label>
            <gr-select [value]="'checking'" [itemToString]="accountLabel">
              <gr-select-trigger id="transfer-from" class="w-full">
                <gr-select-value />
              </gr-select-trigger>
              <gr-select-content>
                @for (a of accounts; track a.value) {
                  <gr-select-item [value]="a.value">{{
                    a.label
                  }}</gr-select-item>
                }
              </gr-select-content>
            </gr-select>
          </gr-field>
          <gr-field>
            <gr-field-label for="transfer-to">To Account</gr-field-label>
            <gr-select [value]="'savings'" [itemToString]="accountLabel">
              <gr-select-trigger id="transfer-to" class="w-full">
                <gr-select-value />
              </gr-select-trigger>
              <gr-select-content>
                @for (a of accounts; track a.value) {
                  <gr-select-item [value]="a.value">{{
                    a.label
                  }}</gr-select-item>
                }
              </gr-select-content>
            </gr-select>
          </gr-field>
        </gr-field-group>
      </gr-card-content>
      <gr-card-content>
        <dl class="flex flex-col gap-3 rounded-lg bg-muted/50 p-4 text-sm">
          @for (s of summary; track s.label) {
            <div class="flex items-center justify-between">
              <dt class="text-muted-foreground">{{ s.label }}</dt>
              <dd class="font-medium tabular-nums">{{ s.value }}</dd>
            </div>
          }
          <gr-separator />
          <div class="flex items-center justify-between font-semibold">
            <dt>Total amount</dt>
            <dd class="tabular-nums">{{ totalLabel() }}</dd>
          </div>
        </dl>
      </gr-card-content>
      <gr-card-footer>
        <ai-button class="w-full" [disabled]="total() <= 0"
          >Confirm Transfer</ai-button
        >
      </gr-card-footer>
    </gr-card>
  `,
})
export class TransferFunds {
  protected readonly accounts = ACCOUNTS;
  protected readonly accountLabel = (value: string) =>
    ACCOUNTS.find((a) => a.value === value)?.label ?? value;
  protected readonly summary = [
    { label: 'Estimated arrival', value: 'Today, Nov 21' },
    { label: 'Transfer fee', value: usd.format(0) },
  ];
  protected readonly amount = signal('1,200.00');
  protected readonly total = computed(
    () => Number(this.amount().replace(/,/g, '')) || 0,
  );
  protected readonly totalLabel = computed(() => usd.format(this.total()));

  protected onAmount(event: Event) {
    this.amount.set((event.target as HTMLInputElement).value);
  }
}
