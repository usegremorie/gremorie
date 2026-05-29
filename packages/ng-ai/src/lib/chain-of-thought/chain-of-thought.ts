import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  InjectionToken,
  model,
  ViewEncapsulation,
} from '@angular/core';

/**
 * ChainOfThought — root container for a list of reasoning steps. Mirrors
 * React `ChainOfThought`.
 *
 * Owns the open/close state shared between `<chain-of-thought-header>` and
 * `<chain-of-thought-content>`. Two-way bindable `[(open)]` plus
 * uncontrolled mode.
 */
export interface ChainOfThoughtState {
  isOpen: () => boolean;
  setOpen(open: boolean): void;
  toggle(): void;
}

export const CHAIN_OF_THOUGHT = new InjectionToken<ChainOfThoughtState>(
  'ChainOfThoughtState',
);

@Component({
  selector: 'chain-of-thought',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'not-prose block max-w-prose space-y-4',
  },
  providers: [
    {
      provide: CHAIN_OF_THOUGHT,
      useExisting: forwardRef(() => ChainOfThought),
    },
  ],
})
export class ChainOfThought implements ChainOfThoughtState {
  readonly open = model<boolean>(false);

  readonly isOpen = () => this.open();

  setOpen(open: boolean): void {
    this.open.set(open);
  }

  toggle(): void {
    this.open.update((v) => !v);
  }
}
