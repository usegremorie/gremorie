import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface IapMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming: boolean;
}

export interface StepEvent {
  id: string;
  kind: string;
  status: string;
  label: string;
  description?: string;
}

export type ChatInputState = 'ready' | 'submitted' | 'streaming' | 'error';

@Injectable({ providedIn: 'root' })
export class IapChatService {
  private readonly supabaseService = inject(SupabaseService);

  readonly messages = signal<IapMessage[]>([]);
  readonly steps = signal<StepEvent[]>([]);
  readonly inputState = signal<ChatInputState>('ready');
  readonly conversationId = signal<string | undefined>(undefined);
  readonly error = signal<string | null>(null);

  reset(): void {
    this.messages.set([]);
    this.steps.set([]);
    this.conversationId.set(undefined);
    this.inputState.set('ready');
    this.error.set(null);
  }

  async loadConversation(id: string): Promise<void> {
    this.inputState.set('submitted');
    try {
      const dbMessages = await this.supabaseService.loadMessages(id);
      this.conversationId.set(id);
      this.messages.set(
        dbMessages.map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          streaming: false,
        })),
      );
      this.steps.set([]);
      this.error.set(null);
      this.inputState.set('ready');
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Erro ao carregar conversa');
      this.inputState.set('error');
    }
  }

  clearError(): void {
    this.messages.update((msgs) =>
      msgs.filter((m) => !(m.role === 'assistant' && m.streaming)),
    );
    this.error.set(null);
    this.inputState.set('ready');
  }

  async sendMessage(question: string): Promise<void> {
    if (!question.trim()) return;

    // Captura histórico ANTES de adicionar as novas mensagens
    const history = this.messages().map((m) => ({ role: m.role, content: m.content }));
    const isFirstQuestion = history.length === 0;

    // Adiciona mensagem do usuário
    const userMsgId = crypto.randomUUID();
    this.messages.update((msgs) => [
      ...msgs,
      { id: userMsgId, role: 'user', content: question, streaming: false },
    ]);

    // Adiciona placeholder do assistente (streaming)
    const assistantId = crypto.randomUUID();
    this.messages.update((msgs) => [
      ...msgs,
      { id: assistantId, role: 'assistant', content: '', streaming: true },
    ]);

    this.inputState.set('streaming');
    this.steps.set([]);
    this.error.set(null);

    let accumulated = '';

    try {
      // Cria conversa no Supabase se for a primeira mensagem
      let convId = this.conversationId();
      if (isFirstQuestion) {
        convId = await this.supabaseService.createConversation(question);
        this.conversationId.set(convId);
      }

      // Persiste mensagem do usuário
      if (convId) {
        await this.supabaseService.insertMessage(convId, 'user', question);
      }

      // Inicia stream SSE via fetch (não usa EventSource — endpoint é POST)
      const res = await fetch('/api/iap/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          conversationId: convId,
          isFirstQuestion,
          mode: 'auto',
          history,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const ev of events) {
          let name = 'message';
          let data = '';
          for (const line of ev.split('\n')) {
            if (line.startsWith('event: ')) name = line.slice(7).trim();
            else if (line.startsWith('data: ')) data += line.slice(6);
          }
          if (!data) continue;

          const payload = JSON.parse(data) as Record<string, unknown>;

          if (name === 'delta') {
            accumulated += payload['text'] as string;
            this.messages.update((msgs) =>
              msgs.map((m) =>
                m.id === assistantId ? { ...m, content: accumulated } : m,
              ),
            );
          } else if (name === 'step') {
            this.steps.update((steps) => [...steps, payload as StepEvent]);
          } else if (name === 'error') {
            throw new Error(payload['message'] as string);
          }
          // 'meta', 'artifact', 'done' — ignorados ou não requerem ação especial no MVP
        }
      }

      // Finaliza mensagem do assistente
      this.messages.update((msgs) =>
        msgs.map((m) =>
          m.id === assistantId ? { ...m, streaming: false } : m,
        ),
      );
      this.inputState.set('ready');

      // Persiste resposta do assistente
      const convIdFinal = this.conversationId();
      if (convIdFinal && accumulated) {
        await this.supabaseService.insertMessage(convIdFinal, 'assistant', accumulated);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      this.error.set(msg);
      this.inputState.set('error');
      this.messages.update((msgs) =>
        msgs.map((m) =>
          m.id === assistantId
            ? { ...m, content: accumulated || `Erro: ${msg}`, streaming: false }
            : m,
        ),
      );
    }
  }
}
