import { Card, CardContent, CardFooter } from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';

/** Showcase card (half width): the next credit card payment date. */
export function PaymentDue() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1">
        <span className="text-muted-foreground text-sm">Payment Due</span>
        <time className="font-semibold text-2xl" dateTime="2026-11-28">
          Nov 28
        </time>
      </CardContent>
      <CardFooter>
        <Button className="w-full" size="sm" variant="outline">
          Pay Early
        </Button>
      </CardFooter>
    </Card>
  );
}
