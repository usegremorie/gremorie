# @gremorie/rx-ai

React AI primitives for Gremorie, an AI native design system. Prompt input, chat conversation, reasoning, tools, citations, and a node based workflow canvas.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/rx-ai @gremorie/rx-core @gremorie/rx-display @gremorie/rx-feedback @gremorie/rx-forms @gremorie/rx-overlays @gremorie/rx-containers @gremorie/rx-artifacts
```

Requires React 18 or 19 and Tailwind CSS v4 in the host project.

## Styles

Import the pre compiled token stylesheet once, at your app entry. It ships the
design tokens (colors, radius, light and dark themes) as plain CSS variables, so
you do not need to wire Tailwind `@theme` yourself.

```css
@import 'tailwindcss';
@import '@gremorie/react/styles.css';
```

## Usage

These primitives rely on React context, so they are client components. In the
Next.js App Router, add `'use client'` to the file that renders them.

```tsx
'use client';

import {
  Conversation,
  ConversationContent,
  Message,
  MessageContent,
} from '@gremorie/rx-ai';

export function Example() {
  return (
    <Conversation className="h-96">
      <ConversationContent>
        <Message from="user">
          <MessageContent>How do I get started?</MessageContent>
        </Message>
        <Message from="assistant">
          <MessageContent>
            Install the package and import a primitive.
          </MessageContent>
        </Message>
      </ConversationContent>
    </Conversation>
  );
}
```

## Components

- PromptInput family (`PromptInput`, `PromptInputBody`, `PromptInputAttachments`, and more)
- Conversation and Message (`Conversation`, `Message`, `MessageContent`, `MessageActions`)
- Reasoning, Chain of Thought, Plan, Task, and Tool
- Citations and Sources (`InlineCitation`, `Sources`)
- Model Selector, Suggestion, Queue, Checkpoint, Confirmation, Context, and Shimmer
- Workflow canvas (`Canvas`, `Node`, `Edge`, `Connection`, `Controls`, `Panel`, `Toolbar`)
- Utilities (`Image`, `OpenInChat`)

Generative UI artifacts (Artifact, CodeBlock, WebPreview) live in the optional
[@gremorie/rx-artifacts](https://www.npmjs.com/package/@gremorie/rx-artifacts)
package.

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
