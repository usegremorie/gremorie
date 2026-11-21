import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  CardContent,
  CardFooter,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@gremorie/rx-navigation';

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
export function HelpCenter() {
  return (
    <Card>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="w-full">
            {TOPICS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {TOPICS.map((t) => (
            <TabsContent key={t.value} value={t.value}>
              <Accordion
                className="overflow-hidden rounded-lg border"
                collapsible
                defaultValue={t.questions[0]?.id}
                type="single"
              >
                {t.questions.map((q) => (
                  <AccordionItem
                    className="px-4 data-[state=open]:bg-muted/50"
                    key={q.id}
                    value={q.id}
                  >
                    <AccordionTrigger>{q.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{q.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline">
          Contact Support
        </Button>
      </CardFooter>
    </Card>
  );
}
