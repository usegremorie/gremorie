import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Card, CardContent, CardHeader } from '@gremorie/ng-display';
import { Skeleton } from '@gremorie/ng-feedback';

/**
 * Showcase card: the loading state of a report card, drawn with skeletons
 * in the shape of the content that is about to arrive.
 */
@Component({
  selector: 'showcase-loading-card',
  standalone: true,
  imports: [Card, CardContent, CardHeader, Skeleton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gr-card aria-busy="true" aria-label="Loading report">
      <gr-card-header>
        <gr-skeleton class="h-5 w-32" />
        <gr-skeleton class="h-4 w-48" />
      </gr-card-header>
      <gr-card-content class="flex flex-col gap-3">
        <gr-skeleton class="h-32 w-full rounded-lg" />
        <gr-skeleton class="h-4 w-full" />
        <gr-skeleton class="h-4 w-3/4" />
        <gr-skeleton class="h-4 w-1/2" />
      </gr-card-content>
      <gr-card-content class="grid grid-cols-2 gap-2">
        <gr-skeleton class="h-9 rounded-lg" />
        <gr-skeleton class="h-9 rounded-lg" />
      </gr-card-content>
    </gr-card>
  `,
})
export class LoadingCard {}
