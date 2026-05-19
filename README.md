# ShadNG

> Angular AI-native component library — shadcn/ui for Angular, focused on AI.

ShadNG is the Angular library of AI-native components that should exist but doesn't. Built on [spartan-ng](https://www.spartan.ng) primitives, designed to integrate cleanly with [Hashbrown](https://hashbrown.dev) for LLM logic. Tribute to [shadcn/ui](https://ui.shadcn.com), following the precedent established by shadcn-svelte, shadcn-vue, and shadcn-solid.

**Status:** brainstorm → bootstrapping. Not yet released.

## Why

Angular teams adding AI features hit four frictions:

1. **No AI component library.** AI Elements (Vercel), shadcn.io/ai, assistant-ui — all React.
2. **Streaming and tool calls are complex.** SSE, chunk parsing, tool dispatch — risky to write from scratch.
3. **Fragmented design.** spartan-ng has primitives but nothing AI-specific.
4. **Docs scattered.** Medium tutorials, no curation, no standard.

ShadNG fills the visual layer. Logic stays in Hashbrown.

## Stack

- **Angular 22+** (target) / 21+ (minimum)
- **spartan-ng** for primitives (Brain + Helm)
- **Tailwind v4** (OKLCH-based)
- **Nx monorepo** for tooling
- **Analog.js** for the docs site
- **Storybook 10** for the internal workshop

## Founding principle

> Complete documentation or it doesn't exist.

Every component must pass the full documentation checklist before being released publicly. No half-shipped components.

## Repo structure

```
shadng/
├── apps/
│   ├── docs/          # Analog.js — public site (shadng.dev)
│   ├── storybook/     # Internal workshop
│   └── playground/    # Integration demos (Hashbrown, Vercel AI SDK)
├── packages/
│   ├── shadng-prompt-input/
│   └── shadng-cli/
└── tools/
    ├── eslint-config/
    └── tsconfig/
```

## Branches

- `main` — production / latest release
- `staging` — pre-release validation
- `develop` — active integration

## Roadmap

| Phase | Scope |
|---|---|
| v0.1.0 | PromptInput + 10 subcomponents |
| v0.2.0 | Response + MessageContent + CodeBlock |
| v0.3.0 | Conversation + Message |
| v0.4.0 | Reasoning + ToolCall + Suggestions |
| v0.5.0 | Artifact + Citation + Sandbox |
| v1.0.0 | Stable |

## License

MIT © Kalvner
