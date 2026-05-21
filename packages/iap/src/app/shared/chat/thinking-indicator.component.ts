import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import type { StepEvent } from '../../services/iap-chat.service';

@Component({
  selector: 'iap-thinking-indicator',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div class="mb-3 flex flex-col gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2.5">
        <p class="text-xs font-medium text-muted-foreground">Pensando…</p>

        @for (step of steps(); track step.id) {
          <div class="flex items-start gap-2">
            @if (isLastStep(step) && !done()) {
              <!-- Spinner animado no último step em progresso -->
              <svg
                class="mt-0.5 size-3.5 shrink-0 animate-spin text-primary"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  cx="12" cy="12" r="10"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-dasharray="20 40"
                />
              </svg>
            } @else {
              <!-- Check para steps concluídos -->
              <svg
                class="mt-0.5 size-3.5 shrink-0 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            }
            <span class="text-xs text-foreground/80">{{ step.label }}</span>
          </div>
        }

        @if (steps().length === 0) {
          <div class="flex items-center gap-2">
            <svg
              class="size-3.5 shrink-0 animate-spin text-primary"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                cx="12" cy="12" r="10"
                stroke="currentColor"
                stroke-width="2"
                stroke-dasharray="20 40"
              />
            </svg>
            <span class="text-xs text-muted-foreground">Iniciando…</span>
          </div>
        }
      </div>
    }
  `,
})
export class ThinkingIndicator {
  readonly steps = input<StepEvent[]>([]);
  readonly done = input<boolean>(false);

  protected readonly visible = computed(
    () => !this.done() || this.steps().length > 0,
  );

  protected isLastStep(step: StepEvent): boolean {
    const steps = this.steps();
    return steps.length > 0 && steps[steps.length - 1].id === step.id;
  }
}
