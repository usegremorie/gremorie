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
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Textarea,
} from '@gremorie/rx-forms';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

const MIN = 50;
const MAX = 10000;

/** shadcn reference card 2 (column 2): minimum payout settings. */
export function PayoutThreshold() {
  const [amount, setAmount] = useState([2500]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payout Threshold</CardTitle>
        <CardDescription>
          Set the minimum balance required before a payout is triggered.
        </CardDescription>
        <CardAction>
          <Button
            variant="ghost"
            size="icon"
            className="bg-muted"
            aria-label="Close"
          >
            <XIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Label htmlFor="preferred-currency">Preferred Currency</Label>
            <Select defaultValue="usd">
              <SelectTrigger id="preferred-currency" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD — United States Dollar</SelectItem>
                <SelectItem value="eur">EUR — Euro</SelectItem>
                <SelectItem value="gbp">GBP — British Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="min-payout">Minimum Payout Amount</Label>
              <span className="font-semibold text-2xl tabular-nums">
                ${amount[0].toFixed(2)}
              </span>
            </div>
            <Slider
              id="min-payout"
              value={amount}
              onValueChange={setAmount}
              min={MIN}
              max={MAX}
              step={50}
              thumbAriaLabel="Minimum payout amount"
            />
            <div className="flex items-center justify-between text-muted-foreground text-sm">
              <span>$50 (MIN)</span>
              <span>$10,000 (MAX)</span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="payout-notes">Notes</Label>
            <Textarea
              id="payout-notes"
              placeholder="Add any notes for this payout configuration..."
              className="min-h-[100px]"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Save Threshold</Button>
      </CardFooter>
    </Card>
  );
}
