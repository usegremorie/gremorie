import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideAudioWaveform } from '@ng-icons/lucide';
import { Button } from '@gremorie/ng-core';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FeaturedIcon,
} from '@gremorie/ng-display';

/**
 * Showcase card: a music-distribution nudge before release day. Centered
 * empty-state layout: icon, title, one line of guidance, one action.
 */
@Component({
  selector: 'showcase-explore-catalog',
  standalone: true,
  imports: [
    Button,
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    FeaturedIcon,
    NgIcon,
  ],
  providers: [provideIcons({ lucideAudioWaveform })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header class="justify-items-center gap-2 text-center">
        <gr-featured-icon class="mb-4" color="gray" size="lg">
          <ng-icon name="lucideAudioWaveform" aria-hidden="true" />
        </gr-featured-icon>
        <gr-card-title>Explore Catalog</gr-card-title>
        <gr-card-description class="text-balance">
          Check ISRC codes, metadata and artwork for all 12 tracks before
          release day on Dec 4.
        </gr-card-description>
      </gr-card-header>
      <gr-card-footer class="justify-center">
        <ai-button>View Catalog</ai-button>
      </gr-card-footer>
    </gr-card>
  `,
})
export class ExploreCatalog {}
