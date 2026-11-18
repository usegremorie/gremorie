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
import { Input, Label, RadioGroup, RadioGroupItem } from '@gremorie/ng-forms';

/**
 * shadcn reference card (column 5): where payouts go. The eyebrow sits above
 * the title, as in the reference; saving waits for an account number.
 */
@Component({
  selector: 'showcase-receiving-method',
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
    Input,
    Label,
    NgIcon,
    RadioGroup,
    RadioGroupItem,
  ],
  providers: [provideIcons({ lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-description>Payout Preferences</gr-card-description>
        <gr-card-title>Receiving Method</gr-card-title>
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
            <gr-label for="account-holder">Account Holder Name</gr-label>
            <gr-input
              id="account-holder"
              value="Synthetic Horizons Music LLC"
            />
          </div>
          <fieldset class="flex flex-col gap-3">
            <legend class="mb-3 font-medium text-secondary-foreground text-sm">
              Receiving Method
            </legend>
            <gr-radio-group class="grid grid-cols-2 gap-3" [(value)]="method">
              @for (m of methods; track m.value) {
                <gr-label
                  [for]="'method-' + m.value"
                  class="flex items-start gap-3 rounded-lg border p-4 font-normal"
                >
                  <gr-radio-group-item
                    [id]="'method-' + m.value"
                    [value]="m.value"
                  />
                  <span class="flex flex-col gap-1">
                    <span class="font-medium text-foreground text-sm">{{
                      m.title
                    }}</span>
                    <span class="text-muted-foreground text-sm">{{
                      m.description
                    }}</span>
                  </span>
                </gr-label>
              }
            </gr-radio-group>
          </fieldset>
          <div class="flex flex-col gap-3">
            <gr-label for="iban">IBAN / Account Number</gr-label>
            <gr-input
              id="iban"
              placeholder="DE89 3704 0044 ...."
              (valueChange)="iban.set($event)"
            />
          </div>
        </div>
      </gr-card-content>
      <gr-card-footer>
        <ai-button class="w-full" [disabled]="!iban().trim()">
          Save Payout Settings
        </ai-button>
      </gr-card-footer>
    </gr-card>
  `,
})
export class ReceivingMethod {
  protected readonly methods = [
    { value: 'bank', title: 'Bank Transfer', description: 'SWIFT / IBAN' },
    { value: 'paypal', title: 'PayPal', description: 'Instant Payout' },
  ];
  protected readonly method = signal('bank');
  protected readonly iban = signal('');
}
