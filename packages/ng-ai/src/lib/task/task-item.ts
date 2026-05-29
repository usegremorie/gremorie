import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

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
 */
@Component({
  selector: 'task-item-file',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class:
      'inline-flex items-center gap-1 rounded-md border bg-secondary px-1.5 py-0.5 text-foreground text-xs',
  },
})
export class TaskItemFile {}
