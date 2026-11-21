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
  FieldSeparator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@gremorie/ng-forms';

const CURRENCIES = [
  { value: 'usd', label: 'USD · United States Dollar' },
  { value: 'eur', label: 'EUR · Euro' },
  { value: 'gbp', label: 'GBP · British Pound' },
];

const DEFAULTS = { currency: 'usd', publicStats: true, emailReports: true };

/** Showcase card: account preferences for an artist on a royalty platform. */
@Component({
  selector: 'showcase-preferences',
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
    FieldSeparator,
    NgIcon,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Switch,
  ],
  providers: [provideIcons({ lucideX })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Preferences</gr-card-title>
        <gr-card-description>
          Manage your account settings and notifications.
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
            <gr-field-label for="default-currency"
              >Default Currency</gr-field-label
            >
            <gr-select [(value)]="currency" [itemToString]="currencyLabel">
              <gr-select-trigger id="default-currency" class="w-full">
                <gr-select-value />
              </gr-select-trigger>
              <gr-select-content>
                @for (c of currencies; track c.value) {
                  <gr-select-item [value]="c.value">{{
                    c.label
                  }}</gr-select-item>
                }
              </gr-select-content>
            </gr-select>
          </gr-field>
          <gr-field-separator />
          <gr-field orientation="horizontal">
            <gr-field-content>
              <gr-field-label for="public-statistics"
                >Public Statistics</gr-field-label
              >
              <gr-field-description>
                Allow others to see your total stream count and listening
                activity.
              </gr-field-description>
            </gr-field-content>
            <gr-switch id="public-statistics" [(checked)]="publicStats" />
          </gr-field>
          <gr-field-separator />
          <gr-field orientation="horizontal">
            <gr-field-content>
              <gr-field-label for="email-notifications"
                >Email Notifications</gr-field-label
              >
              <gr-field-description>
                Monthly royalty reports and distribution updates.
              </gr-field-description>
            </gr-field-content>
            <gr-switch id="email-notifications" [(checked)]="emailReports" />
          </gr-field>
        </gr-field-group>
      </gr-card-content>
      <gr-card-footer class="justify-between">
        <ai-button variant="outline" (click)="reset()">Reset</ai-button>
        <ai-button>Save Preferences</ai-button>
      </gr-card-footer>
    </gr-card>
  `,
})
export class Preferences {
  protected readonly currencies = CURRENCIES;
  protected readonly currency = signal(DEFAULTS.currency);
  protected readonly publicStats = signal(DEFAULTS.publicStats);
  protected readonly emailReports = signal(DEFAULTS.emailReports);
  protected readonly currencyLabel = (value: string) =>
    CURRENCIES.find((c) => c.value === value)?.label ?? value;

  protected reset(): void {
    this.currency.set(DEFAULTS.currency);
    this.publicStats.set(DEFAULTS.publicStats);
    this.emailReports.set(DEFAULTS.emailReports);
  }
}
