import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';
import type { Conversation } from '../../services/supabase.service';

@Component({
  selector: 'iap-conversation-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      type="button"
      [class]="buttonClass()"
      (click)="selected.emit(conversation())"
    >
      <span class="truncate text-sm">{{ conversation().title }}</span>
    </button>
  `,
})
export class ConversationItem {
  readonly conversation = input.required<Conversation>();
  readonly active = input<boolean>(false);
  readonly selected = output<Conversation>();

  protected readonly buttonClass = computed(() =>
    cn(
      'flex w-full items-center rounded-md px-2 py-1.5 text-left transition-colors',
      'hover:bg-accent hover:text-accent-foreground',
      this.active()
        ? 'bg-accent text-accent-foreground font-medium'
        : 'text-muted-foreground',
    ),
  );
}
