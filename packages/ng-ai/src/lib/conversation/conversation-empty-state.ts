import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from '@angular/core';

/**
 * ConversationEmptyState — placeholder shown when no messages exist.
 *
 * Mirrors React `ConversationEmptyState`. Projects custom content; falls
 * back to title + description + optional projected icon (via the `[icon]`
 * slot).
 */
@Component({
  selector: 'conversation-empty-state',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content select="[icon]" />
    <ng-content>
      <div class="space-y-1">
        <h3 class="font-medium text-sm">{{ title() }}</h3>
        @if (description()) {
          <p class="text-muted-foreground text-sm">{{ description() }}</p>
        }
      </div>
    </ng-content>
  `,
  host: {
    class:
      'flex size-full flex-col items-center justify-center gap-3 p-8 text-center',
  },
})
export class ConversationEmptyState {
  readonly title = input<string>('No messages yet');
  readonly description = input<string>(
    'Start a conversation to see messages here',
  );
}
