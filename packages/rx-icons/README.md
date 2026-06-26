# @gremorie/rx-icons

The Gremorie icon library for React. Monochrome (`currentColor`) marks in the
lucide style: a 24x24 viewBox sized through `className`, so they drop into the
same places lucide icons do.

```bash
npm install @gremorie/rx-icons --legacy-peer-deps
```

```tsx
import { AnthropicIcon, OpenAiIcon, GeminiIcon } from '@gremorie/rx-icons';

<AnthropicIcon className="size-4 text-muted-foreground" />;
```

## Icons

AI provider brand marks: `AnthropicIcon`, `ClaudeIcon`, `OpenAiIcon`,
`GeminiIcon`, `MistralIcon`.

- **Monochrome**: they paint with `currentColor`, so they inherit the text color
  (e.g. `text-muted-foreground`) and the theme.
- **Sized via `className`**: `size-4`, `size-5`, etc. They default to `1em`.
- **Decorative by default** (`aria-hidden`). For a standalone icon, pass an
  `aria-label` and it is exposed to assistive tech.

## A note on trademarks

These marks are the trademarks of their respective owners. They are vendored
here for nominative identification only (labelling which model or provider a
control refers to), not to imply affiliation or endorsement.
