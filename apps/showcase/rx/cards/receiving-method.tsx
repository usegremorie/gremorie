import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import {
  Button,
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
} from '@gremorie/rx-forms';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

const METHODS = [
  { value: 'bank', title: 'Bank Transfer', description: 'SWIFT / IBAN' },
  { value: 'paypal', title: 'PayPal', description: 'Instant Payout' },
];

/**
 * shadcn reference card (column 5): where payouts go. The eyebrow sits above
 * the title, as in the reference; saving waits for an account number.
 */
export function ReceivingMethod() {
  const [method, setMethod] = useState('bank');
  const [iban, setIban] = useState('');
  return (
    <Card>
      <CardHeader>
        <CardDescription>Payout Preferences</CardDescription>
        <CardTitle>Receiving Method</CardTitle>
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
            <FieldLabel htmlFor="account-holder">
              Account Holder Name
            </FieldLabel>
            <Input
              defaultValue="Synthetic Horizons Music LLC"
              id="account-holder"
            />
          </Field>
          <FieldSet>
            <FieldLegend variant="label">Receiving Method</FieldLegend>
            <RadioGroup
              className="grid grid-cols-2 gap-3"
              onValueChange={setMethod}
              value={method}
            >
              {METHODS.map((m) => (
                <FieldLabel htmlFor={`method-${m.value}`} key={m.value}>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{m.title}</FieldTitle>
                      <FieldDescription>{m.description}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem id={`method-${m.value}`} value={m.value} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>
          <Field>
            <FieldLabel htmlFor="iban">IBAN / Account Number</FieldLabel>
            <Input
              id="iban"
              onChange={(e) => setIban(e.target.value)}
              placeholder="DE89 3704 0044 ...."
              value={iban}
            />
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!iban.trim()}>
          Save Payout Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
