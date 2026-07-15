# Assistant (chat surface) — fixed anatomy

The flagship composed AI surface. React ships it as the **`chat-surface` block**
(`apps/docs/content/blocks/chat-surface.mdx`) composed from `@gremorie/rx-ai`
primitives. The Angular target composes the **already-existing** `@gremorie/ng-ai`
primitives (`conversation`, `message`, `reasoning`, `prompt-input`) into the same
surface, with the same anatomy.

A complete chat surface: a streaming conversation log with stick-to-bottom
scrolling, user and assistant messages, an expandable reasoning collapsible, and
a `PromptInput` composer at the bottom.

## Anatomy tree (shared)

```
<assistant>                              h-[560px] rounded border bg-card column
├─ <conversation>                        stick-to-bottom scroll region
│  └─ <conversation-content>
│     ├─ <message from="user">
│     │  └─ <message-content>            user turn
│     └─ <message from="assistant">
│        ├─ <reasoning [isStreaming] [duration]>
│        │  ├─ <reasoning-trigger>       "Thought for Ns" toggle
│        │  └─ <reasoning-content>       collapsible thinking step
│        └─ <message-content>            assistant turn (markdown-ready)
│     └─ <conversation-scroll-button>    (appears when scrolled up)
└─ composer (border-t bg-background)
   └─ <prompt-input (submit)>
      ├─ <prompt-input-body>
      │  └─ <prompt-input-textarea placeholder="Ask anything...">
      └─ <prompt-input-footer>           (a.k.a. toolbar row)
         ├─ <prompt-input-tools>
         └─ <prompt-input-submit [disabled]>
```

> Note: `PromptInputFooter` must be a sibling of `PromptInputBody`, never nested
> inside it — see the `display:contents` gotcha that produced the thin-bar bug.

## Public surface

The assistant is a **block**, not a single-prop primitive: its "API" is the set
of primitives it composes, each keeping its own documented surface. The block
itself exposes a thin wrapper:

| Concern         | React (block)                               | Angular (block)                       |
| --------------- | ------------------------------------------- | ------------------------------------- |
| Submit handler  | `PromptInput onSubmit`                      | `(submit)` output / `[onSubmit]`      |
| Messages        | composed children (`Message from="…"`)      | content projection / `messages` input |
| Reasoning       | `Reasoning isStreaming duration`            | `[isStreaming]` `[duration]` inputs   |
| Streaming state | `PromptInputSubmit` state (ready/streaming) | `PromptInputSubmit` state input       |

The Angular block ships as a standalone, self-contained component
(`Assistant` / `assistant`) plus a story demonstrating the same canned
conversation as the React block, so the two read identically.

## Behaviour parity

- **Stick-to-bottom**: the conversation pins to the latest message while
  streaming; a scroll-to-bottom button appears when the user scrolls up.
- **Reasoning auto-collapse**: while `isStreaming` is true the reasoning panel is
  open; it collapses when streaming completes, showing "Thought for N seconds".
- **Composer**: textarea grows with content; `Enter` submits, `Shift+Enter`
  newlines; submit is disabled while empty and becomes a stop/cancel affordance
  while streaming.
- **a11y**: conversation is a labelled scroll region; messages expose
  user/assistant roles; the composer is a labelled form. WCAG AA.

## Customization (shared)

- Wire submit to the AI SDK `sendMessage` (React) / a streaming endpoint.
- Stream `Reasoning` content while `isStreaming` for auto-collapse on completion.
- Add an action menu for slash commands / attachments.
- Swap plain message content for the Streamdown/markdown renderer when rendering
  server-streamed markdown.
