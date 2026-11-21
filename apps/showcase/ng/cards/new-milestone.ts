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
  Input,
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

// Target dates, counted in months from November 2026, so the card can pace
// the monthly deposit the moment amount or date changes.
const DATES = [
  { value: '2027-06', label: 'Jun 2027', months: 7 },
  { value: '2027-12', label: 'Dec 2027', months: 13 },
  { value: '2028-06', label: 'Jun 2028', months: 19 },
  { value: '2028-12', label: 'Dec 2028', months: 25 },
];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

/** Mirrors the React card's helper: monthly deposit for a target. */
function pace(amount: string, date: string): string {
  const target = Number(amount.replace(/[^\d.]/g, ''));
  const months = DATES.find((d) => d.value === date)?.months ?? 0;
  if (!target || !months) return 'Enter an amount to see your monthly pace.';
  return `About ${usd.format(Math.ceil(target / months))} a month, starting December.`;
}

/** Showcase card: create a savings goal with a paced monthly deposit. */
@Component({
  selector: 'showcase-new-milestone',
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
    Input,
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
        <gr-card-title>Set a new milestone</gr-card-title>
        <gr-card-description>
          Define your financial target and we'll help you pace your savings.
        </gr-card-description>
      </gr-card-header>
      <gr-card-content>
        <gr-field-group class="gap-6">
          <gr-field>
            <gr-field-label for="goal-name">Goal Name</gr-field-label>
            <gr-input
              id="goal-name"
              placeholder="e.g. Emergency fund, New car"
            />
          </gr-field>
          <gr-field>
            <div class="grid grid-cols-2 gap-3">
              <gr-field>
                <gr-field-label for="goal-amount">Target Amount</gr-field-label>
                <gr-input-group>
                  <gr-input-group-addon>
                    <gr-input-group-text>$</gr-input-group-text>
                  </gr-input-group-addon>
                  <!-- gr-input-group-input has no valueChange output; the
                       native input event bubbles to the host. -->
                  <gr-input-group-input
                    class="flex-1"
                    id="goal-amount"
                    [value]="amount()"
                    (input)="onAmount($event)"
                  />
                </gr-input-group>
              </gr-field>
              <gr-field>
                <gr-field-label for="goal-date">Target Date</gr-field-label>
                <gr-select [(value)]="date" [itemToString]="dateLabel">
                  <gr-select-trigger id="goal-date" class="w-full">
                    <gr-select-value />
                  </gr-select-trigger>
                  <gr-select-content>
                    @for (d of dates; track d.value) {
                      <gr-select-item [value]="d.value">{{
                        d.label
                      }}</gr-select-item>
                    }
                  </gr-select-content>
                </gr-select>
              </gr-field>
            </div>
            <gr-field-description aria-live="polite">{{
              pace()
            }}</gr-field-description>
          </gr-field>
        </gr-field-group>
      </gr-card-content>
      <gr-card-footer class="flex-col gap-2">
        <ai-button class="w-full">Create Goal</ai-button>
        <ai-button class="w-full" variant="outline">Cancel</ai-button>
      </gr-card-footer>
    </gr-card>
  `,
})
export class NewMilestone {
  protected readonly dates = DATES;
  protected readonly amount = signal('15,000');
  protected readonly date = signal('2027-12');
  protected readonly pace = computed(() => pace(this.amount(), this.date()));
  protected readonly dateLabel = (value: string) =>
    DATES.find((d) => d.value === value)?.label ?? value;

  protected onAmount(event: Event): void {
    this.amount.set((event.target as HTMLInputElement).value);
  }
}
