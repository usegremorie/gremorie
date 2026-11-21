import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { Button } from '@gremorie/ng-core';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  FeaturedIcon,
} from '@gremorie/ng-display';

/**
 * Showcase card: the empty state of a music distribution catalog, before
 * the artist has delivered a single master.
 */
@Component({
  selector: 'showcase-distribute-track',
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
  providers: [provideIcons({ lucidePlus })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-content
        class="flex flex-col items-center gap-6 py-4 text-center"
      >
        <gr-featured-icon class="text-foreground" color="gray">
          <ng-icon name="lucidePlus" aria-hidden="true" />
        </gr-featured-icon>
        <div class="flex flex-col gap-2">
          <gr-card-title>Distribute Track</gr-card-title>
          <gr-card-description class="text-balance">
            Upload your first master to start reaching listeners on more than
            150 streaming stores worldwide.
          </gr-card-description>
        </div>
        <ai-button>Create Release</ai-button>
      </gr-card-content>
    </gr-card>
  `,
})
export class DistributeTrack {}
