import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  InjectionToken,
  model,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Task — collapsible card with file attachments. Mirrors React `Task`.
 *
 * Owns its open/close state; opens by default like the React version
 * (`defaultOpen=true`).
 */
export interface TaskState {
  isOpen: () => boolean;
  setOpen(open: boolean): void;
  toggle(): void;
}

export const TASK = new InjectionToken<TaskState>('TaskState');

@Component({
  selector: 'task',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'block',
  },
  providers: [{ provide: TASK, useExisting: forwardRef(() => Task) }],
})
export class Task implements TaskState {
  readonly open = model<boolean>(true);

  readonly isOpen = () => this.open();

  setOpen(open: boolean): void {
    this.open.set(open);
  }

  toggle(): void {
    this.open.update((v) => !v);
  }
}
