import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { Badge } from '@gremorie/ng-display';

import { TOOL } from './tool';
import type { ToolState } from './tool.types';

const STATE_LABELS: Record<ToolState, string> = {
  'input-streaming': 'Pending',
  'input-available': 'Running',
  'approval-requested': 'Awaiting Approval',
  'approval-responded': 'Responded',
  'output-available': 'Completed',
  'output-error': 'Error',
  'output-denied': 'Denied',
};

const STATE_BADGE_COLORS: Record<ToolState, string> = {
  'input-streaming': 'text-muted-foreground',
  'input-available': 'text-muted-foreground animate-pulse',
  'approval-requested': 'text-yellow-600',
  'approval-responded': 'text-blue-600',
  'output-available': 'text-green-600',
  'output-error': 'text-red-600',
  'output-denied': 'text-orange-600',
};

/**
 * ToolHeader — wrench icon + title + state badge + collapse chevron.
 *
 * Mirrors React `ToolHeader`. The `type` input mirrors the React `type`
 * prop (the AI SDK tool name, e.g. `"tool-readFile"`); the default title is
 * derived by stripping the `"tool-"` prefix.
 *
 * The state badge dogfoods `gr-badge` from `@gremorie/ng-display`
 * (variant `secondary`) instead of an inline-styled span — matches the
 * React blueprint which also wraps the state in a `Badge` with
 * `variant="secondary"`.
 */
@Component({
  selector: 'tool-header',
  standalone: true,
  imports: [Badge],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      (click)="toggle()"
      [attr.aria-expanded]="open()"
      class="group flex w-full items-center justify-between gap-4 p-3"
    >
      <div class="flex items-center gap-2">
        <!-- wrench -->
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          class="text-muted-foreground"
        >
          <path
            d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
          />
        </svg>
        <span class="font-medium text-sm">{{ resolvedTitle() }}</span>
        <gr-badge variant="secondary" class="gap-1.5">
          <span [class]="badgeColor()">
            @switch (state()) {
              @case ('input-streaming') {
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
              }
              @case ('input-available') {
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              }
              @case ('approval-requested') {
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              }
              @case ('approval-responded') {
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
              }
              @case ('output-available') {
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="m9 11 3 3L22 4" />
                </svg>
              }
              @default {
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m15 9-6 6M9 9l6 6" />
                </svg>
              }
            }
          </span>
          {{ stateLabel() }}
        </gr-badge>
      </div>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        class="size-4 text-muted-foreground transition-transform"
        [class.rotate-180]="open()"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  `,
})
export class ToolHeader {
  /** Tool name (mirrors React `type`), e.g. `"tool-readFile"`. */
  readonly type = input.required<string>();
  readonly state = input.required<ToolState>();
  readonly title = input<string>();

  private readonly host = inject(TOOL);
  protected readonly open = computed(() => this.host.isOpen());

  protected readonly resolvedTitle = computed(() => {
    const t = this.title();
    if (t) return t;
    return this.type().split('-').slice(1).join('-');
  });

  protected readonly stateLabel = computed(() => STATE_LABELS[this.state()]);
  protected readonly badgeColor = computed(
    () => STATE_BADGE_COLORS[this.state()],
  );

  protected toggle(): void {
    this.host.toggle();
  }
}
