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
  Input,
  Label,
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
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor="account-holder">Account Holder Name</Label>
            <Input
              defaultValue="Synthetic Horizons Music LLC"
              id="account-holder"
            />
          </div>
          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 font-medium text-secondary-foreground text-sm">
              Receiving Method
            </legend>
            <RadioGroup
              className="grid grid-cols-2 gap-3"
              onValueChange={setMethod}
              value={method}
            >
              {METHODS.map((m) => (
                <Label
                  className="flex items-start gap-3 rounded-lg border p-4 font-normal"
                  htmlFor={`method-${m.value}`}
                  key={m.value}
                >
                  <RadioGroupItem id={`method-${m.value}`} value={m.value} />
                  <span className="flex flex-col gap-1">
                    <span className="font-medium text-foreground text-sm">
                      {m.title}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {m.description}
                    </span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </fieldset>
          <div className="flex flex-col gap-3">
            <Label htmlFor="iban">IBAN / Account Number</Label>
            <Input
              id="iban"
              onChange={(e) => setIban(e.target.value)}
              placeholder="DE89 3704 0044 ...."
              value={iban}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!iban.trim()}>
          Save Payout Settings
        </Button>
      </CardFooter>
    </Card>
  );
}
