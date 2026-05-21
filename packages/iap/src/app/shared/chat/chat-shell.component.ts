import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmitEvent,
} from '@shadng/prompt-input';
import { IapChatService } from '../../services/iap-chat.service';
import { SupabaseService } from '../../services/supabase.service';
import { MessageList } from './message-list.component';

@Component({
  selector: 'iap-chat-shell',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PromptInput,
    PromptInputTextarea,
    PromptInputToolbar,
    PromptInputSubmit,
    MessageList,
  ],
  template: `
    <div class="flex h-full flex-col overflow-hidden">
      @if (hasMessages()) {
        <!-- Conversa ativa -->
        <iap-message-list />

        <!-- Input fixo no rodapé -->
        <div class="shrink-0 border-t border-border bg-background px-4 py-3">
          <div class="mx-auto max-w-3xl">
            <prompt-input
              [(value)]="promptValue"
              [state]="chatService.inputState()"
              (submitted)="onSubmit($event)"
              (canceled)="chatService.clearError()"
              (retried)="chatService.clearError()"
            >
              <prompt-input-textarea placeholder="Faça uma pergunta…" />
              <prompt-input-toolbar>
                <div class="flex-1"></div>
                <prompt-input-submit />
              </prompt-input-toolbar>
            </prompt-input>
          </div>
        </div>
      } @else {
        <!-- Estado vazio -->
        <div class="flex flex-1 flex-col items-center justify-center gap-6 p-8">
          <div class="flex flex-col items-center gap-2 text-center">
            <h1 class="text-2xl font-semibold tracking-tight text-foreground">
              Boa noite, {{ userName() }}
            </h1>
            <p class="text-muted-foreground">Como posso ajudar você hoje?</p>
          </div>

          <div class="w-full max-w-2xl">
            <prompt-input
              [(value)]="promptValue"
              [state]="chatService.inputState()"
              (submitted)="onSubmit($event)"
              (canceled)="chatService.clearError()"
              (retried)="chatService.clearError()"
            >
              <prompt-input-textarea placeholder="Faça uma pergunta…" [maxHeightPx]="200" />
              <prompt-input-toolbar>
                <div class="flex-1"></div>
                <prompt-input-submit />
              </prompt-input-toolbar>
            </prompt-input>
          </div>
        </div>
      }
    </div>
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
    return email ? email.split('@')[0] : 'Kalvner';
  });

  protected onSubmit(event: PromptInputSubmitEvent): void {
    const question = event.value.trim();
    if (!question) return;
    this.promptValue.set('');
    void this.chatService.sendMessage(question);
  }
}
