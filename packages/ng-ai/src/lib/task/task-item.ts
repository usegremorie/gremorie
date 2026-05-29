import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { Badge } from '@gremorie/ng-display';

/**
 * TaskItem — single line in a Task body. Mirrors React `TaskItem`.
 */
@Component({
  selector: 'task-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'text-muted-foreground text-sm block',
  },
})
export class TaskItem {}

/**
 * TaskItemFile — file chip used inside a TaskItem. Mirrors React
 * `TaskItemFile`.
 *
 * Dogfoods `gn-badge` (variant `secondary`) from `@gremorie/ng-display`.
 */
@Component({
  selector: 'task-item-file',
  standalone: true,
  imports: [Badge],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <gn-badge variant="secondary" class="rounded-md font-normal">
      <ng-content />
    </gn-badge>
  `,
  host: {
    class: 'inline-flex',
  },
})
export class TaskItemFile {}
