# IAP Chat — Design Spec
**Data:** 2026-05-20  
**Pacote:** `packages/iap/` (novo Angular SPA no monorepo ShadNG)  
**Objetivo:** Tela de chat estilo Claude Desktop para testar a IAP (assistente RAG da Impulseup), com streaming SSE real, persistência Supabase e sistema de temas.

---

## 1. Contexto e restrições

- Monorepo NX, Angular 21.2, Tailwind v4, signals everywhere.
- `@gremorie/ng-core`, `@gremorie/ng-prompt-input`, `@gremorie/ng-attachments` são pacotes internos — importar diretamente, não modificar.
- `@spartan-ng/brain` instalado — usar primitivos headless `brn-*` e estilizar com Tailwind (padrão HLM do Spartan).
- `@supabase/supabase-js` **ainda não instalado** — instalar no root do monorepo.
- Nada de `any` solto; TypeScript estrito; sem modificar componentes compartilhados.

---

## 2. Pacote `iap`

**Tipo:** NX app (`"projectType": "application"`)  
**Serve:** `nx serve iap` (porta 4201 para não colidir com playground:4200)  
**Build:** `nx build iap`

### 2.1 Estrutura de arquivos

```
packages/iap/
├── project.json
├── tsconfig.json
├── tsconfig.app.json
├── proxy.conf.json                   ← /api → ENDPOINT_URL (dev only)
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.css                    ← @import tailwind + theme.css + @source iap
│   ├── environments/
│   │   └── environment.ts            ← supabaseUrl, supabaseAnonKey, apiUrl="/api"
│   └── app/
│       ├── app.component.ts          ← layout raiz: sidebar + main
│       ├── app.config.ts             ← providers
│       ├── services/
│       │   ├── iap-chat.service.ts
│       │   ├── supabase.service.ts
│       │   └── theme.service.ts
│       └── shared/
│           ├── sidebar/
│           │   ├── sidebar.component.ts
│           │   └── conversation-item.component.ts
│           ├── chat/
│           │   ├── chat-shell.component.ts
│           │   ├── message-list.component.ts
│           │   ├── chat-message.component.ts
│           │   └── thinking-indicator.component.ts
│           └── top-bar/
│               └── top-bar.component.ts
```

---

## 3. Layout

### 3.1 Shell raiz (`app.component.ts`)

```
┌──────────────────────────────────────────────┐
│  sidebar (280px fixo)  │  área principal      │
│                        │                      │
│  [New chat]  [Busca]   │  top-bar (toggle +   │
│  ─────────────────     │  dropdown tema)       │
│  Hoje                  │  ─────────────────── │
│    Conversa A          │                      │
│    Conversa B   ←ativa │  [estado vazio]      │
│  Ontem                 │  ou                  │
│    Conversa C          │  [message-list]      │
│  Últimos 7 dias        │                      │
│    ...                 │  [prompt-input]      │
└──────────────────────────────────────────────┘
```

Layout: `display: flex; height: 100vh; overflow: hidden`  
Sidebar: `width: 280px; flex-shrink: 0; border-right`  
Main: `flex: 1; display: flex; flex-col; overflow: hidden`

### 3.2 Sidebar (`sidebar.component.ts`)

- Botão "New chat" (ícone PencilSquare + label) — cria nova conversa e limpa a ativa.
- Input de busca (usa `BrnInputDirective` do Spartan + estilo Tailwind) — filtra `conversations` por título localmente via `computed()`.
- Lista agrupada por data, seções: "Hoje", "Ontem", "Últimos 7 dias", "Mais antigas" — lógica pura em `computed()` sem libs.
- `conversation-item.component.ts`: trunca título a 45 chars, destaca item ativo com `bg-accent`.

### 3.3 Top-bar (`top-bar.component.ts`)

Alinhado à direita no header principal:
- Reutiliza `DocsThemeToggle` (importado de `packages/docs/src/app/shared/theme-toggle.component.ts`) — toggle dark/light.
- Dropdown de tema de cor: `BrnSelectImports` + trigger estilizado mostrando o preset ativo. 4 presets: `default` (cinza), `blue` (azul corporativo), `emerald` (esmeralda), `sunset` (pôr do sol).

### 3.4 Estado vazio (`chat-shell.component.ts`)

Quando não há conversa ativa:
```
[centralizado verticalmente]
  Boa noite, {nome}
  Como posso ajudar você hoje?
  [prompt-input centralizado, max-w-2xl]
```
Nome vem de `supabaseService.user()?.email` ou fallback "Kalvner".

### 3.5 Conversa ativa (`chat-shell.component.ts`)

```
[message-list, flex-1, overflow-y-auto]
  [chat-message role=user]    text      [right]
  [chat-message role=assistant]         [left]
    [thinking-indicator]  ← enquanto streaming
    texto chegando token a token
[prompt-input fixo no rodapé, max-w-3xl centrado]
```

---

## 4. Componentes de IA (inspirados em Vercel AI Elements)

### 4.1 `ChatMessage`

```typescript
@Component({ selector: 'iap-chat-message' })
// inputs: role: 'user' | 'assistant', content: string, streaming: boolean
```

- `role=user`: `self-end max-w-[75%] bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-4 py-2.5` — conteúdo renderizado como texto puro com `whitespace-pre-wrap` (usuários não enviam markdown).
- `role=assistant`: `self-start max-w-[85%] text-foreground rounded-2xl rounded-bl-sm px-0 py-0` (sem bolha — texto livre alinhado à esquerda, estilo Claude) — conteúdo renderizado como **markdown via `[innerHTML]`**.
- Streaming cursor: `▋` piscando ao final enquanto `streaming=true`, como elemento irmão fora do bloco markdown.

#### Stack de renderização de markdown (mensagens do assistente)

**Padrão de mercado** (ChatGPT, Claude.ai, Gemini, Vercel AI): `marked` + `DOMPurify` + `DomSanitizer.bypassSecurityTrustHtml()` + `[innerHTML]`.

**Por quê:**
- `marked` v15 — parser síncrono, já dependência do workspace raiz; essencial para re-parsear a cada delta do stream dentro de um `computed()` signal.
- `DOMPurify` — sanitiza o HTML gerado pelo `marked` antes de injetar no DOM (previne XSS de conteúdo externo via API).
- `DomSanitizer.bypassSecurityTrustHtml()` — necessário porque o sanitizer do Angular remove tags legítimas de markdown (`<table>`, `<pre>`, `<code>`). Só é seguro usar após o DOMPurify já ter limpado.
- `prismjs` já está no workspace — disponível para syntax highlighting futuro nos blocos de código.

**Fluxo no `computed()`:**
```typescript
marked.parse(content) as string   // markdown → HTML string (sync)
  → DOMPurify.sanitize(html)      // remove XSS
  → DomSanitizer.bypassSecurityTrustHtml(clean)  // confia no output já limpo
  → [innerHTML]                   // injeta no DOM
```

**Estilo:** classe `.markdown-content` em `styles.css` (global, funciona com `ViewEncapsulation.None`) cobre `p`, `h1–h4`, `ul/ol/li`, `code`, `pre`, `blockquote`, `a`, `table`, `strong/em`. Usa CSS vars do design system (`--foreground`, `--muted`, `--border`, `--primary`) para dark/light mode automático.

### 4.2 `ThinkingIndicator`

```typescript
@Component({ selector: 'iap-thinking-indicator' })
// inputs: steps: StepEvent[], done: boolean
```

- Exibe cada `step` recebido via SSE como linha: `[ícone spinner/check] [label]`
- Enquanto `done=false`: spinner animado no último step ativo.
- Após `done=true`: todos os steps mostram check, componente colapsa após 800ms.
- Estrutura visual (inspirada em AI Elements ChainOfThought):
  ```
  ⟳ Buscando documentos relevantes...
  ✓ Analisando contexto
  ⟳ Gerando resposta
  ```
- `StepEvent` = `{ id: string; kind: string; status: string; label: string; description?: string }`

### 4.3 `MessageList`

```typescript
@Component({ selector: 'iap-message-list' })
// exibe lista de IapMessage[], auto-scroll ao último item
```

- `overflow-y-auto`, `flex-1`, `flex flex-col gap-4 py-6 px-4`
- Auto-scroll: `ViewChild` no sentinel `<div #bottom>` + `scrollIntoView({ behavior: 'smooth' })` em `effect()` reagindo a mudanças no array de mensagens.

---

## 5. Services

### 5.1 `IapChatService`

```typescript
interface IapMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
}

interface StepEvent { id: string; kind: string; status: string; label: string; description?: string; }
```

Expõe via signals:
```typescript
readonly messages = signal<IapMessage[]>([]);
readonly steps = signal<StepEvent[]>([]);
readonly inputState = signal<'ready' | 'submitted' | 'streaming' | 'error'>('ready');
readonly conversationId = signal<string | undefined>(undefined);
readonly error = signal<string | null>(null);
```

Método `sendMessage(question: string): Promise<void>`:
1. Adiciona mensagem user ao array.
2. Adiciona mensagem assistant vazia com `streaming: true`.
3. Define `inputState = 'streaming'`.
4. Chama `fetch('/api/iap/chat', { method: 'POST', body: JSON.stringify(payload) })`.
5. Processa stream SSE: `delta` → acumula content; `step` → atualiza steps; `error` → seta error; `done` → finaliza.
6. Ao terminar: `inputState = 'ready'`, `streaming = false`.

Payload:
```typescript
{
  question,
  conversationId: this.conversationId(),
  isFirstQuestion: this.messages().filter(m => m.role === 'user').length === 1,
  mode: 'auto',
  history: this.messages().slice(0, -1).map(m => ({ role: m.role, content: m.content }))
}
```

### 5.2 `SupabaseService`

- Init: `createClient(environment.supabaseUrl, environment.supabaseAnonKey)` com schema `'iap'`.
- `init()`: `signInWithPassword({ email: 'admin@kalvner.com', password: '123456' })` no bootstrap.
- `conversations$`: `signal<Conversation[]>([])` — carregado no init, atualizado após cada nova conversa.
- `loadConversations()`: `select('*').order('updated_at', { ascending: false })`.
- `createConversation(title: string)`: insert + retorna id.
- `insertMessage(conversationId, role, content, meta?)`: insert na tabela messages.
- `loadMessages(conversationId)`: `select('*').eq('conversation_id', id).order('created_at')`.

### 5.3 `ThemeService`

- `darkMode = signal<'light' | 'dark'>('light')` — aplica `.dark` no `document.documentElement`, persiste em `localStorage['shadng-theme']`.
- `colorPreset = signal<ColorPreset>('default')` — aplica `document.documentElement.dataset['colorTheme'] = preset`, persiste em `localStorage['shadng-color-preset']`.
- 4 presets definidos em `styles.css` como blocos `[data-color-theme="blue"] { --primary: oklch(...); ... }`.

---

## 6. Theming — 4 Presets de Cor

Definidos via `data-color-theme` attribute no `<html>`:

| Preset | Nome | Primary |
|--------|------|---------|
| `default` | Padrão | cinza (atual) |
| `blue` | Azul Corporativo | oklch(0.5 0.18 250) |
| `emerald` | Esmeralda | oklch(0.52 0.18 162) |
| `sunset` | Pôr do Sol | oklch(0.58 0.2 35) |

Cada preset sobrescreve apenas `--primary` e `--primary-foreground` (mínimo para impacto visual imediato, sem quebrar o tema base).

---

## 7. Proxy de desenvolvimento

`proxy.conf.json`:
```json
{
  "/api": {
    "target": "{{ENDPOINT_URL}}",
    "secure": true,
    "changeOrigin": true
  }
}
```

Referenciado no `project.json` em `serve.options.proxyConfig`. O código usa sempre `/api/iap/chat` (relativo).

---

## 8. Fluxo de dados completo

```
[usuário digita + Enter]
    → PromptInput (submitted)
    → IapChatService.sendMessage()
        → SupabaseService.createConversation() se primeira mensagem
        → SupabaseService.insertMessage(user)
        → fetch POST /api/iap/chat (proxied)
            → stream SSE:
                step   → ThinkingIndicator atualiza
                delta  → ChatMessage.content acumula (signal)
                done   → inputState = ready, ThinkingIndicator fecha
                error  → error signal, inputState = error
        → SupabaseService.insertMessage(assistant)
[sidebar atualiza conversas]
```

---

## 9. Critérios de aceite

- [ ] `nx serve iap` sobe sem erros
- [ ] `nx build iap` sem erros TypeScript
- [ ] Sidebar: New chat + busca filtrante + lista agrupada por data
- [ ] Clicar conversa → carrega mensagens anteriores
- [ ] Enviar pergunta → resposta em streaming token a token
- [ ] `ThinkingIndicator` atualiza com cada evento `step`
- [ ] Toggle dark/light persiste em localStorage
- [ ] Dropdown de tema troca cor do primary imediatamente e persiste
- [ ] Erros do backend → mensagem amigável inline (não quebra tela)
- [ ] Nada dos pacotes `shadng-core`, `shadng-prompt-input`, `shadng-attachments`, `docs`, `playground` foi modificado

---

## 10. O que NÃO está no MVP

- Virtualização da lista de mensagens
- Upload de arquivos no chat
- Múltiplos usuários / auth real
- Deploy / prod config
