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
  Checkbox,
  type CheckedState,
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@gremorie/ng-forms';

const TOPICS = [
  {
    id: 'transactions',
    title: 'Transaction alerts',
    description: 'Deposits, withdrawals, and transfers.',
  },
  {
    id: 'security',
    title: 'Security alerts',
    description: 'Login attempts and account changes.',
  },
  {
    id: 'milestones',
    title: 'Goal milestones',
    description: 'Updates at 25%, 50%, 75%, and 100%.',
  },
  {
    id: 'market',
    title: 'Market updates',
    description: 'Daily portfolio summary and price alerts.',
  },
];

/**
 * Showcase card: personal-finance notification preferences. "Select all"
 * reflects the list: checked, unchecked or indeterminate.
 */
@Component({
  selector: 'showcase-notifications',
  standalone: true,
  imports: [
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Checkbox,
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>Notifications</gr-card-title>
        <gr-card-description>
          Choose what you want to be notified about.
        </gr-card-description>
      </gr-card-header>
      <gr-card-content>
        <gr-field-group class="gap-5">
          <gr-field orientation="horizontal">
            <gr-checkbox
              id="notify-all"
              [checked]="all()"
              (checkedChange)="toggleAll($event)"
            />
            <gr-field-label for="notify-all">Select all</gr-field-label>
          </gr-field>
          @for (t of topics; track t.id) {
            <gr-field orientation="horizontal">
              <gr-checkbox
                [id]="'notify-' + t.id"
                [checked]="selected().includes(t.id)"
                (checkedChange)="toggle(t.id, $event === true)"
              />
              <gr-field-content>
                <gr-field-label [for]="'notify-' + t.id">{{
                  t.title
                }}</gr-field-label>
                <gr-field-description>{{ t.description }}</gr-field-description>
              </gr-field-content>
            </gr-field>
          }
        </gr-field-group>
      </gr-card-content>
      <gr-card-footer>
        <ai-button class="w-full">Save Preferences</ai-button>
      </gr-card-footer>
    </gr-card>
  `,
})
export class Notifications {
  protected readonly topics = TOPICS;
  protected readonly selected = signal<string[]>(['transactions', 'security']);
  protected readonly all = computed<CheckedState>(() => {
    const n = this.selected().length;
    return n === TOPICS.length ? true : n > 0 ? 'indeterminate' : false;
  });

  protected toggleAll(state: CheckedState): void {
    this.selected.set(state === true ? TOPICS.map((t) => t.id) : []);
  }

  protected toggle(id: string, on: boolean): void {
    this.selected.update((s) => (on ? [...s, id] : s.filter((x) => x !== id)));
  }
}
