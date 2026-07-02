import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  inject,
  InjectionToken,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

import type { ToolState } from '../tool/tool.types';

/**
 * Approval payload mirroring the React `ToolUIPartApproval` union: when
 * `approved` is omitted the request is still pending; `true`/`false` carry the
 * decision plus an optional `reason`.
 */
export type ToolUIPartApproval =
  | { id: string; approved?: undefined; reason?: undefined }
  | { id: string; approved: true; reason?: string }
  | { id: string; approved: false; reason?: string }
  | undefined;

/**
 * Confirmation — a tool-approval alert. Mirrors React `Confirmation` from
 * `@gremorie/rx-ai`.
 *
 * React parity:
 * - Shares `{ approval, state }` via context (here `CONFIRMATION`). The root
 *   renders nothing while `approval` is missing or the tool is still in an
 *   `input-streaming` / `input-available` state — identical guard to React.
 * - Sub-components reveal/hide based on `state` + `approval.approved`:
 *   `ConfirmationRequest` (state `approval-requested`), `ConfirmationAccepted`
 *   / `ConfirmationRejected` (response states + decision), `ConfirmationActions`
 *   (state `approval-requested`).
 * - `state` reuses the shared `ToolState` (= AI SDK `ToolUIPart["state"]`).
 *
 * Divergence: React wraps the surface in `Alert` from `rx-feedback`.
 * `@gremorie/ng-feedback` is not a peer of `ng-ai`, so the root reproduces the
 * same `role="alert"` card surface inline — same visual/semantic result without
 * adding a peer dependency.
 */
export interface ConfirmationState {
  approval: () => ToolUIPartApproval;
  state: () => ToolState;
}

export const CONFIRMATION = new InjectionToken<ConfirmationState>(
  'ConfirmationState',
);

@Component({
  selector: 'confirmation',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div role="alert" [class]="alertClass()">
        <ng-content />
      </div>
    }
  `,
  host: { 'data-slot': 'confirmation', class: 'contents' },
  providers: [
    { provide: CONFIRMATION, useExisting: forwardRef(() => Confirmation) },
  ],
})
export class Confirmation implements ConfirmationState {
  readonly approval = input<ToolUIPartApproval>(undefined);
  readonly state = input.required<ToolState>();
  readonly class = input<string>();

  protected readonly visible = computed(() => {
    const a = this.approval();
    const s = this.state();
    if (!a || s === 'input-streaming' || s === 'input-available') {
      return false;
    }
    return true;
  });

  protected readonly alertClass = computed(() =>
    cn(
      'relative flex w-full flex-col gap-2 rounded-lg border px-4 py-3 text-sm',
      this.class(),
    ),
  );
}

@Component({
  selector: 'confirmation-title',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'confirmation-title',
    '[class]': 'hostClass()',
  },
})
export class ConfirmationTitle {
  readonly class = input<string>();
  protected readonly hostClass = computed(() =>
    cn('inline text-sm text-muted-foreground', this.class()),
  );
}

@Component({
  selector: 'confirmation-request',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (show()) {
      <ng-content />
    }
  `,
  host: { 'data-slot': 'confirmation-request', class: 'contents' },
})
export class ConfirmationRequest {
  private readonly ctx = inject(CONFIRMATION);
  protected readonly show = computed(
    () => this.ctx.state() === 'approval-requested',
  );
}

@Component({
  selector: 'confirmation-accepted',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (show()) {
      <ng-content />
    }
  `,
  host: { 'data-slot': 'confirmation-accepted', class: 'contents' },
})
export class ConfirmationAccepted {
  private readonly ctx = inject(CONFIRMATION);
  protected readonly show = computed(() => {
    const a = this.ctx.approval();
    const s = this.ctx.state();
    return (
      !!a?.approved &&
      (s === 'approval-responded' ||
        s === 'output-denied' ||
        s === 'output-available')
    );
  });
}

@Component({
  selector: 'confirmation-rejected',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (show()) {
      <ng-content />
    }
  `,
  host: { 'data-slot': 'confirmation-rejected', class: 'contents' },
})
export class ConfirmationRejected {
  private readonly ctx = inject(CONFIRMATION);
  protected readonly show = computed(() => {
    const a = this.ctx.approval();
    const s = this.ctx.state();
    return (
      a?.approved === false &&
      (s === 'approval-responded' ||
        s === 'output-denied' ||
        s === 'output-available')
    );
  });
}

@Component({
  selector: 'confirmation-actions',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (show()) {
      <div [class]="rowClass()"><ng-content /></div>
    }
  `,
  host: { 'data-slot': 'confirmation-actions', class: 'contents' },
})
export class ConfirmationActions {
  private readonly ctx = inject(CONFIRMATION);
  readonly class = input<string>();
  protected readonly show = computed(
    () => this.ctx.state() === 'approval-requested',
  );
  protected readonly rowClass = computed(() =>
    cn('flex items-center justify-end gap-2 self-end', this.class()),
  );
}

@Component({
  selector: 'confirmation-action',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" [disabled]="disabled()" [class]="buttonClass()">
      <ng-content />
    </button>
  `,
  host: { 'data-slot': 'confirmation-action', class: 'contents' },
})
export class ConfirmationAction {
  /** Visual variant (React `Button` default is `default`). */
  readonly variant = input<'default' | 'outline' | 'ghost' | 'secondary'>(
    'default',
  );
  readonly disabled = input<boolean>(false);
  readonly class = input<string>();
  protected readonly buttonClass = computed(() => {
    const variantClass: Record<string, string> = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline:
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    };
    return cn(
      'inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variantClass[this.variant()],
      this.class(),
    );
  });
}
