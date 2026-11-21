import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from '@gremorie/rx-display';
import {
  Button,
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
} from '@gremorie/rx-forms';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

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
export function TransferFunds() {
  const [amount, setAmount] = useState('1,200.00');
  const total = Number(amount.replace(/,/g, '')) || 0;
  const summary = [
    { label: 'Estimated arrival', value: 'Today, Nov 21' },
    { label: 'Transfer fee', value: usd.format(0) },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transfer Funds</CardTitle>
        <CardDescription>
          Move money between your connected accounts.
        </CardDescription>
        <CardAction>
          <Button
            aria-label="Close"
            className="bg-muted"
            size="icon"
            variant="ghost"
          >
            <XIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-6">
          <Field>
            <FieldLabel htmlFor="transfer-amount">
              Amount to Transfer
            </FieldLabel>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                id="transfer-amount"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
              />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="transfer-from">From Account</FieldLabel>
            <Select defaultValue="checking">
              <SelectTrigger className="w-full" id="transfer-from">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNTS.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="transfer-to">To Account</FieldLabel>
            <Select defaultValue="savings">
              <SelectTrigger className="w-full" id="transfer-to">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCOUNTS.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardContent>
        <dl className="flex flex-col gap-3 rounded-lg bg-muted/50 p-4 text-sm">
          {summary.map((s) => (
            <div className="flex items-center justify-between" key={s.label}>
              <dt className="text-muted-foreground">{s.label}</dt>
              <dd className="font-medium tabular-nums">{s.value}</dd>
            </div>
          ))}
          <Separator />
          <div className="flex items-center justify-between font-semibold">
            <dt>Total amount</dt>
            <dd className="tabular-nums">{usd.format(total)}</dd>
          </div>
        </dl>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={total <= 0}>
          Confirm Transfer
        </Button>
      </CardFooter>
    </Card>
  );
}
