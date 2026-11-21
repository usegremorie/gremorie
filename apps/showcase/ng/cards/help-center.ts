import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@gremorie/ng-core';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  CardContent,
  CardFooter,
} from '@gremorie/ng-display';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gremorie/ng-navigation';

// Help-center questions for a personal-finance app, one tab per topic.
// The first question of each topic starts open.
const TOPICS = [
  {
    value: 'general',
    label: 'General',
    questions: [
      {
        id: 'security',
        question: 'How secure is my financial data?',
        answer:
          'Your data is encrypted at rest with AES-256 and in transit with TLS 1.3. We never store your bank credentials: every connection uses read-only access tokens you can revoke at any time.',
      },
      {
        id: 'connect',
        question: 'How do I connect my bank or investment accounts?',
        answer:
          'Open Accounts, choose Add Account and search for your institution. Most banks connect in under a minute; investment accounts can take up to a day to import their history.',
      },
      {
        id: 'export',
        question: 'Can I export my data for tax purposes?',
        answer:
          'Yes. Reports lets you export a full year of transactions and realized gains as CSV or PDF, ready for your accountant.',
      },
    ],
  },
  {
    value: 'billing',
    label: 'Billing',
    questions: [
      {
        id: 'renewal',
        question: 'When does my plan renew?',
        answer:
          'Plans renew on the same day each month or year. You can see the next renewal date and the amount under Billing.',
      },
      {
        id: 'refund',
        question: 'Can I get a refund after renewing?',
        answer:
          'Annual plans can be refunded in full within 14 days of renewal. Monthly plans can be cancelled at any time and stay active until the period ends.',
      },
      {
        id: 'invoice',
        question: 'Where can I find my invoices?',
        answer:
          'Every invoice is listed under Billing and is emailed to the account owner as a PDF on the day it is issued.',
      },
    ],
  },
  {
    value: 'goals',
    label: 'Goals',
    questions: [
      {
        id: 'progress',
        question: 'How is goal progress calculated?',
        answer:
          'Progress is the current balance of the linked accounts divided by the goal amount, refreshed every time those accounts sync.',
      },
      {
        id: 'behind',
        question: 'What happens when a goal falls behind?',
        answer:
          'We compare your pace with the target date and flag the goal as behind, with the monthly amount needed to catch up.',
      },
      {
        id: 'shared',
        question: 'Can I share a goal with my partner?',
        answer:
          'Yes. Invite them from the goal page; both of you can contribute and see the same progress.',
      },
    ],
  },
];

/** Showcase card: a tabbed FAQ with a way to reach a person. */
@Component({
  selector: 'showcase-help-center',
  standalone: true,
  imports: [
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Button,
    Card,
    CardContent,
    CardFooter,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-content>
        <gr-tabs defaultValue="general">
          <gr-tabs-list class="w-full">
            @for (t of topics; track t.value) {
              <gr-tabs-trigger [value]="t.value">{{ t.label }}</gr-tabs-trigger>
            }
          </gr-tabs-list>
          @for (t of topics; track t.value) {
            <gr-tabs-content [value]="t.value">
              <gr-accordion
                type="single"
                [defaultValue]="t.questions[0].id"
                class="block overflow-hidden rounded-lg border"
              >
                @for (q of t.questions; track q.id) {
                  <!-- gr-accordion-content leaves a closed panel at full
                       height in this build; the item hides it until the
                       primitive collapses on its own. -->
                  <gr-accordion-item
                    [value]="q.id"
                    class="block px-4 data-[state=open]:bg-muted/50 [&_[data-slot=accordion-content][data-state=closed]]:hidden"
                  >
                    <gr-accordion-trigger>{{
                      q.question
                    }}</gr-accordion-trigger>
                    <gr-accordion-content>
                      <p class="text-muted-foreground">{{ q.answer }}</p>
                    </gr-accordion-content>
                  </gr-accordion-item>
                }
              </gr-accordion>
            </gr-tabs-content>
          }
        </gr-tabs>
      </gr-card-content>
      <gr-card-footer>
        <ai-button class="w-full" variant="outline">Contact Support</ai-button>
      </gr-card-footer>
    </gr-card>
  `,
})
export class HelpCenter {
  protected readonly topics = TOPICS;
}
