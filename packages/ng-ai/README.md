# @gremorie/ng-ai

AI primitives for Angular: chat surfaces (Message, Conversation, Suggestion,
Reasoning, ChainOfThought, Shimmer, Sources, Task, Tool, Toolbar, CodeBlock)
plus PromptInput and Attachments. Part of Gremorie, an AI native design system.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/ng-ai @gremorie/ng-core @gremorie/ng-display @spartan-ng/brain class-variance-authority marked
```

Requires Angular 21 (`@angular/core`, `@angular/common`, `@angular/compiler`,
`@angular/platform-browser` ^21.2.0). `@spartan-ng/brain` powers the headless
behavior, `marked` renders Markdown responses, and `shiki` is an optional peer
used by the CodeBlock for syntax highlighting.

## Styles

These primitives are styled with the Gremorie design tokens, so import the
core theme once in your global `styles.css`:

```css
@import 'tailwindcss';
@import '@gremorie/ng-core/theme.css';
```

## Usage

```ts
import { Component } from '@angular/core';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputSubmit,
} from '@gremorie/ng-ai';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    PromptInput,
    PromptInputTextarea,
    PromptInputToolbar,
    PromptInputSubmit,
  ],
  template: `
    <prompt-input [(value)]="message" (keydown.enter)="send()">
      <prompt-input-textarea placeholder="Ask anything..." />
      <prompt-input-toolbar>
        <prompt-input-submit />
      </prompt-input-toolbar>
    </prompt-input>
  `,
})
export class ChatComponent {
  message = '';

  send(): void {
    // handle submit
  }
}
```

## Components

Every component is a standalone Angular primitive. Selectors are listed below.

- PromptInput: `prompt-input`, `prompt-input-textarea`,
  `prompt-input-toolbar`, `prompt-input-tools`, `prompt-input-submit`,
  `prompt-input-action-menu`, `prompt-input-model-select`.
- Attachments: `attachment-list`, `attachment-item`, `attachment-preview`,
  `attachment-info`, `attachment-name`, `attachment-size`,
  `attachment-remove`, `attachment-empty`.
- Message: `message`, `message-content`, `message-response`, `message-avatar`,
  `message-actions`, `message-action`, `message-toolbar`,
  `message-attachments`, `message-attachment`, `message-branch`,
  `message-branch-selector`, `message-branch-content`,
  `message-branch-previous`, `message-branch-next`, `message-branch-page`.
- Conversation: `conversation`, `conversation-content`,
  `conversation-empty-state`, `conversation-scroll-button`.
- Suggestion: `suggestions`, `suggestion`.
- Reasoning: `reasoning`, `reasoning-trigger`, `reasoning-content`.
- ChainOfThought: `chain-of-thought`, `chain-of-thought-header`,
  `chain-of-thought-content`, `chain-of-thought-step`,
  `chain-of-thought-image`, `chain-of-thought-search-results`,
  `chain-of-thought-search-result`.
- Sources: `sources`, `sources-trigger`, `sources-content`, `source`.
- InlineCitation: `inline-citation`, `inline-citation-text`,
  `inline-citation-card`, `inline-citation-card-trigger`,
  `inline-citation-card-body`, `inline-citation-source`,
  `inline-citation-quote`.
- Task: `task`, `task-trigger`, `task-content`, `task-item`, `task-item-file`.
- Tool: `tool`, `tool-header`, `tool-content`, `tool-input`, `tool-output`.
- Toolbar: `toolbar`, `toolbar-group`, `toolbar-button`.
- CodeBlock: `code-block`, `code-block-copy-button`.
- Shimmer (directive): `[ngShimmer]`.

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
