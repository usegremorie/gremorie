import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@gremorie/ng-core';
import { Card, CardContent, CardFooter } from '@gremorie/ng-display';

/** Showcase card (half width): the next credit card payment date. */
@Component({
  selector: 'showcase-payment-due',
  standalone: true,
  imports: [Button, Card, CardContent, CardFooter],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-content class="flex flex-col gap-1">
        <span class="text-muted-foreground text-sm">Payment Due</span>
        <time class="font-semibold text-2xl" datetime="2026-11-28">Nov 28</time>
      </gr-card-content>
      <gr-card-footer>
        <ai-button class="w-full" size="sm" variant="outline"
          >Pay Early</ai-button
        >
      </gr-card-footer>
    </gr-card>
  `,
})
export class PaymentDue {}
