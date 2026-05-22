import { Injectable, signal } from '@angular/core';
import { createClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface DbMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  meta: Record<string, unknown> | null;
  created_at: string;
}

export type ContextType = 'evaluation' | 'pdi' | 'survey' | 'department';

export interface ContextItem {
  id: string;
  type: ContextType;
  name: string;
  date: string | null;
}

export interface ContextGroup {
  type: ContextType;
  label: string;
  items: ContextItem[];
}

interface NamedDatedRow {
  id: string;
  name: string;
  starts_at?: string | null;
  sent_at?: string | null;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly client = createClient(environment.supabaseUrl, environment.supabaseAnonKey, {
    db: { schema: 'iap' },
  });

  readonly conversations = signal<Conversation[]>([]);
  readonly user = signal<User | null>(null);
  readonly authError = signal<string | null>(null);

  async init(): Promise<void> {
    await this.signIn();
    await this.loadConversations();
  }

  private async signIn(): Promise<void> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: 'admin@kalvner.com',
        password: '123456',
      });
      if (error) {
        this.authError.set(error.message);
      } else {
        this.user.set(data.user);
      }
    } catch (err) {
      this.authError.set(err instanceof Error ? err.message : 'Erro ao autenticar');
    }
  }

  async loadConversations(): Promise<void> {
    try {
      const { data } = await this.client
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });
      this.conversations.set((data ?? []) as Conversation[]);
    } catch {
      // mantém lista atual em caso de falha
    }
  }

  async createConversation(title: string): Promise<string> {
    const userId = this.user()?.id;
    const { data, error } = await this.client
      .from('conversations')
      .insert({ title: title.slice(0, 60), user_id: userId })
      .select('id')
      .single();
    if (error) throw new Error(error.message);
    await this.loadConversations();
    return (data as { id: string }).id;
  }

  async insertMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    meta?: Record<string, unknown>,
  ): Promise<void> {
    await this.client
      .from('messages')
      .insert({ conversation_id: conversationId, role, content, meta: meta ?? null });
    // Atualiza updated_at da conversa
    await this.client
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);
    await this.loadConversations();
  }

  async loadMessages(conversationId: string): Promise<DbMessage[]> {
    const { data } = await this.client
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    return (data ?? []) as DbMessage[];
  }

  /**
   * Carrega os itens de contexto (avaliações, PDIs, pesquisas, departamentos)
   * do schema `public` para o menu "Selecionar contexto". O client é
   * configurado para o schema `iap`, então sobrescrevemos com `.schema('public')`.
   */
  async loadContextItems(): Promise<ContextGroup[]> {
    const pub = this.client.schema('public');
    const [evals, pdis, surveys, depts] = await Promise.all([
      pub
        .from('evaluations')
        .select('id, name, starts_at')
        .eq('is_archived', false)
        .order('starts_at', { ascending: false }),
      pub
        .from('pdis')
        .select('id, name, starts_at')
        .order('starts_at', { ascending: false }),
      pub
        .from('surveys')
        .select('id, name, sent_at')
        .eq('is_archived', false)
        .order('sent_at', { ascending: false }),
      pub
        .from('departments')
        .select('id, name')
        .order('name', { ascending: true }),
    ]);

    const groups: ContextGroup[] = [
      {
        type: 'evaluation',
        label: 'Avaliações',
        items: ((evals.data ?? []) as NamedDatedRow[]).map((r) => ({
          id: r.id,
          type: 'evaluation' as const,
          name: r.name,
          date: r.starts_at ?? null,
        })),
      },
      {
        type: 'pdi',
        label: 'PDIs',
        items: ((pdis.data ?? []) as NamedDatedRow[]).map((r) => ({
          id: r.id,
          type: 'pdi' as const,
          name: r.name,
          date: r.starts_at ?? null,
        })),
      },
      {
        type: 'survey',
        label: 'Pesquisas',
        items: ((surveys.data ?? []) as NamedDatedRow[]).map((r) => ({
          id: r.id,
          type: 'survey' as const,
          name: r.name,
          date: r.sent_at ?? null,
        })),
      },
      {
        type: 'department',
        label: 'Departamentos',
        items: ((depts.data ?? []) as NamedDatedRow[]).map((r) => ({
          id: r.id,
          type: 'department' as const,
          name: r.name,
          date: null,
        })),
      },
    ];

    return groups.filter((g) => g.items.length > 0);
  }
}
