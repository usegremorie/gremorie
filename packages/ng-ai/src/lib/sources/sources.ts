import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  InjectionToken,
  model,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Sources — root container for citation cards. Mirrors React `Sources`.
 *
 * Owns the open/close state shared with `SourcesTrigger` and
 * `SourcesContent`. Uncontrolled by default (`open=false`).
 */
export interface SourcesState {
  isOpen: () => boolean;
  setOpen(open: boolean): void;
  toggle(): void;
}

export const SOURCES = new InjectionToken<SourcesState>('SourcesState');

@Component({
  selector: 'sources',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'not-prose mb-4 text-primary text-xs block',
  },
  providers: [
    { provide: SOURCES, useExisting: forwardRef(() => Sources) },
  ],
})
export class Sources implements SourcesState {
  readonly open = model<boolean>(false);

  readonly isOpen = () => this.open();

  setOpen(open: boolean): void {
    this.open.set(open);
  }

  toggle(): void {
    this.open.update((v) => !v);
  }
}
