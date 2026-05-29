import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  effect,
  forwardRef,
  inject,
  InjectionToken,
  input,
  OnDestroy,
  output,
  signal,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Shared state contract for the MessageBranch family. Mirrors the React
 * `MessageBranchContext`. Distributed via DI under `MESSAGE_BRANCH`.
 */
export interface MessageBranchState {
  readonly currentBranch: () => number;
  readonly totalBranches: () => number;
  goToPrevious: () => void;
  goToNext: () => void;
  registerBranch: (template: TemplateRef<unknown>) => () => void;
  branches: () => readonly TemplateRef<unknown>[];
}

export const MESSAGE_BRANCH = new InjectionToken<MessageBranchState>(
  'MessageBranchState',
);

/**
 * Wraps a single branch template. Equivalent to one child of React's
 * `<MessageBranchContent>` array.
 */
@Directive({
  selector: '[messageBranchItem]',
  standalone: true,
})
export class MessageBranchItem implements AfterContentInit, OnDestroy {
  readonly template = inject(TemplateRef);
  private readonly parent = inject(MESSAGE_BRANCH);
  private unregister?: () => void;

  ngAfterContentInit(): void {
    this.unregister = this.parent.registerBranch(this.template);
  }

  ngOnDestroy(): void {
    this.unregister?.();
  }
}

/**
 * MessageBranch — controllable branch picker. Mirrors React `MessageBranch`.
 *
 * Self-provides `MESSAGE_BRANCH` so children inject the same instance via
 * Angular's component-hierarchy DI - no shared mutable singleton, fully
 * compatible with multiple concurrent branches on the page.
 */
@Component({
  selector: 'message-branch',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'grid w-full gap-2 [&>div]:pb-0',
  },
  providers: [
    {
      provide: MESSAGE_BRANCH,
      useExisting: forwardRef(() => MessageBranch),
    },
  ],
})
export class MessageBranch implements MessageBranchState {
  readonly defaultBranch = input<number>(0);
  readonly branchChange = output<number>();

  private readonly _branches = signal<readonly TemplateRef<unknown>[]>([]);
  private readonly _current = signal(0);

  readonly branches = () => this._branches();
  readonly currentBranch = () => this._current();
  readonly totalBranches = computed(() => this._branches().length);

  constructor() {
    // Apply defaultBranch when it changes.
    effect(() => {
      this._current.set(this.defaultBranch());
    });
  }

  registerBranch(template: TemplateRef<unknown>): () => void {
    this._branches.update((prev) => [...prev, template]);
    return () => {
      this._branches.update((prev) => prev.filter((t) => t !== template));
    };
  }

  goToPrevious(): void {
    const total = this.totalBranches();
    if (total <= 1) return;
    const cur = this._current();
    const next = cur > 0 ? cur - 1 : total - 1;
    this._current.set(next);
    this.branchChange.emit(next);
  }

  goToNext(): void {
    const total = this.totalBranches();
    if (total <= 1) return;
    const cur = this._current();
    const next = cur < total - 1 ? cur + 1 : 0;
    this._current.set(next);
    this.branchChange.emit(next);
  }
}
