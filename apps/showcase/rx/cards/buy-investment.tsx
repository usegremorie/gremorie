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

// A market buy of a broad index fund. Estimated shares follow the amount
// at the last traded price; the order can't exceed the buying power.
const PRICE = 512.4;
const BUYING_POWER = 12450;

const ORDER_TYPES = [
  {
    value: 'market',
    label: 'Market Order',
    hint: 'Market orders execute at the current price.',
  },
  {
    value: 'limit',
    label: 'Limit Order',
    hint: 'Limit orders execute only at your price or better.',
  },
  {
    value: 'stop',
    label: 'Stop Order',
    hint: 'Stop orders turn into market orders once the stop price is hit.',
  },
];

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
const shares = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

/** Showcase card: a buy order for VTI, sized in dollars. */
export function BuyInvestment() {
  const [amount, setAmount] = useState('1,000.00');
  const [orderType, setOrderType] = useState('market');
  const value = Number(amount.replace(/,/g, ''));
  const valid = value > 0 && value <= BUYING_POWER;
  const hint = ORDER_TYPES.find((o) => o.value === orderType)?.hint;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Buy Investment</CardTitle>
        <CardDescription>
          VTI · Vanguard Total Stock Market at {usd.format(PRICE)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-6">
          <Field>
            <FieldLabel htmlFor="invest-amount">Amount to Invest</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                aria-invalid={!valid}
                id="invest-amount"
                inputMode="decimal"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
              />
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="order-type">Order Type</FieldLabel>
            <Select onValueChange={setOrderType} value={orderType}>
              <SelectTrigger className="w-full" id="order-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ORDER_TYPES.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldDescription>{hint}</FieldDescription>
          </Field>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Estimated Shares</dt>
              <dd className="font-medium tabular-nums">
                {valid ? shares.format(value / PRICE) : '0'}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Buying Power</dt>
              <dd className="font-medium tabular-nums">
                {usd.format(BUYING_POWER)}
              </dd>
            </div>
          </dl>
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex-col gap-3">
        <Button className="w-full" disabled={!valid}>
          Review Order
        </Button>
        <p className="text-balance text-center text-muted-foreground text-sm">
          Trades are typically executed within minutes during market hours.
        </p>
      </CardFooter>
    </Card>
  );
}
