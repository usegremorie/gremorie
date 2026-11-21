import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@gremorie/ng-core';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  FeaturedIcon,
} from '@gremorie/ng-display';
import { Spinner } from '@gremorie/ng-feedback';

/**
 * Showcase card: the blocking state while a budgeting app refreshes the
 * user's linked bank accounts.
 */
@Component({
  selector: 'showcase-syncing-accounts',
  standalone: true,
  imports: [
    Button,
    Card,
    CardContent,
    CardDescription,
    CardTitle,
    FeaturedIcon,
    Spinner,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-content
        class="flex flex-col items-center gap-6 py-4 text-center"
      >
        <gr-featured-icon class="text-foreground" color="gray">
          <gr-spinner />
        </gr-featured-icon>
        <div class="flex flex-col gap-2">
          <gr-card-title>Syncing your accounts</gr-card-title>
          <gr-card-description class="text-balance">
            Pulling in transactions from your 3 linked accounts. This usually
            takes a few seconds.
          </gr-card-description>
        </div>
        <ai-button variant="outline">Cancel</ai-button>
      </gr-card-content>
    </gr-card>
  `,
})
export class SyncingAccounts {}
