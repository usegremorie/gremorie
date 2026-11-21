import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLandmark } from '@ng-icons/lucide';
import { Button } from '@gremorie/ng-core';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  FeaturedIcon,
} from '@gremorie/ng-display';

/** Showcase card: the empty state that asks an artist to add a payout bank. */
@Component({
  selector: 'showcase-connect-bank',
  standalone: true,
  imports: [
    Button,
    Card,
    CardContent,
    CardDescription,
    CardTitle,
    FeaturedIcon,
    NgIcon,
  ],
  providers: [provideIcons({ lucideLandmark })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-content class="flex flex-col items-center gap-2 text-center">
        <gr-featured-icon class="mb-2" color="gray" theme="light">
          <ng-icon name="lucideLandmark" aria-hidden="true" />
        </gr-featured-icon>
        <gr-card-title>Connect Bank</gr-card-title>
        <gr-card-description class="text-balance">
          Link a bank account to receive your monthly royalty payouts
          automatically.
        </gr-card-description>
        <ai-button class="mt-2" size="sm">Set Up Payouts</ai-button>
      </gr-card-content>
    </gr-card>
  `,
})
export class ConnectBank {}
