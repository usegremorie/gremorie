import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmitEvent,
} from '@gremorie/ng-prompt-input';
import { IapChatService } from '../../services/iap-chat.service';
import { SupabaseService } from '../../services/supabase.service';
import { MessageList } from './message-list.component';
import { ModeSelect } from './mode-select.component';
import { ContextSelect } from './context-select.component';

@Component({
  selector: 'iap-chat-shell',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    PromptInput,
    PromptInputTextarea,
    PromptInputToolbar,
    PromptInputSubmit,
    MessageList,
    ModeSelect,
    ContextSelect,
  ],
  template: `
    <div class="flex h-full flex-col overflow-hidden">
      @if (hasMessages()) {
        <!-- Conversa ativa -->
        <iap-message-list />

        <!-- Input fixo no rodapé -->
        <div class="shrink-0 border-t border-border bg-background px-4 py-3">
          <div class="mx-auto max-w-3xl">
            <ng-container [ngTemplateOutlet]="inputTpl" />
          </div>
        </div>
      } @else {
        <!-- Estado vazio -->
        <div class="flex flex-1 flex-col items-center justify-center gap-8 p-8">
          <div class="flex flex-col items-center gap-1 text-center">
            <p class="text-base text-muted-foreground">{{ greeting() }}, {{ userName() }}</p>
            <h1 class="text-4xl font-bold tracking-tight text-foreground">
              O que vamos analisar hoje?
            </h1>
          </div>

          <div class="w-full max-w-2xl">
            <ng-container [ngTemplateOutlet]="inputTpl" />
          </div>
        </div>
      }
    </div>

    <!-- Prompt input reutilizado nos dois estados -->
    <ng-template #inputTpl>
      <prompt-input
        [(value)]="promptValue"
        [state]="chatService.inputState()"
        (submitted)="onSubmit($event)"
        (canceled)="chatService.clearError()"
        (retried)="chatService.clearError()"
      >
        <div>
          <iap-context-select />
        </div>
        <prompt-input-textarea
          placeholder="Pergunte algo sobre seus dados…"
          [maxHeightPx]="200"
        />
        <prompt-input-toolbar>
          <iap-mode-select [(value)]="chatService.mode" />
          <div class="flex-1"></div>
          <prompt-input-submit />
        </prompt-input-toolbar>
      </prompt-input>
    </ng-template>
  `,
})
export class ChatShell {
  protected readonly chatService = inject(IapChatService);
  private readonly supabaseService = inject(SupabaseService);

  protected readonly promptValue = signal('');

  protected readonly hasMessages = computed(
    () => this.chatService.messages().length > 0,
  );

  protected readonly userName = computed(() => {
    const email = this.supabaseService.user()?.email ?? '';
    const raw = email ? email.split('@')[0] : 'Kalvner';
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  });

  protected readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  });

  protected onSubmit(event: PromptInputSubmitEvent): void {
    const question = event.value.trim();
    if (!question) return;
    this.promptValue.set('');
    void this.chatService.sendMessage(question);
  }
}
