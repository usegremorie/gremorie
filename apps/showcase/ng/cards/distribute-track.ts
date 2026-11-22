import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { Card, CardContent } from '@gremorie/ng-display';
import {
  Dropzone,
  DropzoneAction,
  DropzoneDescription,
  DropzoneIcon,
  DropzoneTitle,
} from '@gremorie/ng-forms';

/**
 * Showcase card: the empty state of a music distribution catalog, before
 * the artist has delivered a single master. The whole area takes the drop.
 */
@Component({
  selector: 'showcase-distribute-track',
  standalone: true,
  imports: [
    Card,
    CardContent,
    Dropzone,
    DropzoneAction,
    DropzoneDescription,
    DropzoneIcon,
    DropzoneTitle,
    NgIcon,
  ],
  providers: [provideIcons({ lucidePlus })],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card>
      <gr-card-content>
        <gr-dropzone
          class="gap-6 py-6"
          [accept]="{ 'audio/*': ['.wav', '.flac', '.mp3'] }"
        >
          <gr-dropzone-icon class="text-foreground">
            <ng-icon name="lucidePlus" size="20" aria-hidden="true" />
          </gr-dropzone-icon>
          <div class="flex flex-col gap-2">
            <gr-dropzone-title class="text-base">
              Distribute Track
            </gr-dropzone-title>
            <gr-dropzone-description>
              Upload your first master to start reaching listeners on more than
              150 streaming stores worldwide.
            </gr-dropzone-description>
          </div>
          <gr-dropzone-action variant="default" size="default">
            Create Release
          </gr-dropzone-action>
        </gr-dropzone>
      </gr-card-content>
    </gr-card>
  `,
})
export class DistributeTrack {}
