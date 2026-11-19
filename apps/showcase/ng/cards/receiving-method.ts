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
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
  Input,
  RadioGroup,
  RadioGroupItem,
} from '@gremorie/ng-forms';

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
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
    FieldTitle,
    Input,
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
        <gr-field-group class="gap-6">
          <gr-field>
            <gr-field-label for="account-holder"
              >Account Holder Name</gr-field-label
            >
            <gr-input
              id="account-holder"
              value="Synthetic Horizons Music LLC"
            />
          </gr-field>
          <gr-field-set>
            <gr-field-legend variant="label">Receiving Method</gr-field-legend>
            <gr-radio-group class="grid grid-cols-2 gap-3" [(value)]="method">
              @for (m of methods; track m.value) {
                <gr-field-label [for]="'method-' + m.value">
                  <gr-field orientation="horizontal">
                    <gr-radio-group-item
                      [id]="'method-' + m.value"
                      [value]="m.value"
                    />
                    <gr-field-content>
                      <gr-field-title>{{ m.title }}</gr-field-title>
                      <gr-field-description>{{
                        m.description
                      }}</gr-field-description>
                    </gr-field-content>
                  </gr-field>
                </gr-field-label>
              }
            </gr-radio-group>
          </gr-field-set>
          <gr-field>
            <gr-field-label for="iban">IBAN / Account Number</gr-field-label>
            <gr-input
              id="iban"
              placeholder="DE89 3704 0044 ...."
              (valueChange)="iban.set($event)"
            />
          </gr-field>
        </gr-field-group>
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
