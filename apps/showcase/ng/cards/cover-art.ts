import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideImage } from '@ng-icons/lucide';
import { AspectRatio } from '@gremorie/ng-containers';
import { Button } from '@gremorie/ng-core';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gremorie/ng-display';

/** Showcase card: the artwork slot of a single being prepared for release. */
@Component({
  selector: 'showcase-cover-art',
  standalone: true,
  imports: [
    AspectRatio,
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    NgIcon,
  ],
  providers: [provideIcons({ lucideImage })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-header>
        <gr-card-title>
          <span
            class="block font-medium text-muted-foreground text-xs uppercase tracking-wider"
            >Cover Art</span
          >
        </gr-card-title>
      </gr-card-header>
      <gr-card-content>
        <gr-aspect-ratio
          class="flex items-center justify-center rounded-xl border border-border border-dashed bg-muted/30 text-muted-foreground"
          [ratio]="1"
        >
          <ng-icon name="lucideImage" size="32" aria-hidden="true" />
          <span class="sr-only">No artwork uploaded yet</span>
        </gr-aspect-ratio>
      </gr-card-content>
      <gr-card-footer class="flex-col gap-3">
        <ai-button class="w-full" variant="secondary">Upload Artwork</ai-button>
        <p class="text-center text-muted-foreground text-xs">
          Square, at least 3000 × 3000 px
          <br />
          JPEG or PNG, up to 10 MB
        </p>
      </gr-card-footer>
    </gr-card>
  `,
})
export class CoverArt {}
