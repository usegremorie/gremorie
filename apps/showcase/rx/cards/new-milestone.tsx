import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import {
  Button,
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
} from '@gremorie/rx-forms';
import { useState } from 'react';

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

/** Mirrors the Angular card's helper: monthly deposit for a target. */
function pace(amount: string, date: string): string {
  const target = Number(amount.replace(/[^\d.]/g, ''));
  const months = DATES.find((d) => d.value === date)?.months ?? 0;
  if (!target || !months) return 'Enter an amount to see your monthly pace.';
  return `About ${usd.format(Math.ceil(target / months))} a month, starting December.`;
}

/** Showcase card: create a savings goal with a paced monthly deposit. */
export function NewMilestone() {
  const [amount, setAmount] = useState('15,000');
  const [date, setDate] = useState('2027-12');
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set a new milestone</CardTitle>
        <CardDescription>
          Define your financial target and we'll help you pace your savings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-6">
          <Field>
            <FieldLabel htmlFor="goal-name">Goal Name</FieldLabel>
            <Input id="goal-name" placeholder="e.g. Emergency fund, New car" />
          </Field>
          <Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="goal-amount">Target Amount</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <InputGroupText>$</InputGroupText>
                  </InputGroupAddon>
                  <InputGroupInput
                    id="goal-amount"
                    onChange={(e) => setAmount(e.target.value)}
                    value={amount}
                  />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="goal-date">Target Date</FieldLabel>
                <Select onValueChange={setDate} value={date}>
                  <SelectTrigger className="w-full" id="goal-date">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATES.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <FieldDescription aria-live="polite">
              {pace(amount, date)}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button className="w-full">Create Goal</Button>
        <Button className="w-full" variant="outline">
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
