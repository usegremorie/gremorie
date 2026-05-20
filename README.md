# ShadNG

> Angular AI-native component library — shadcn for Angular, focused on AI.

ShadNG is the Angular library of AI-native components that should exist but doesn't. Built on [spartan-ng](https://www.spartan.ng) primitives, designed to integrate cleanly with [Hashbrown](https://hashbrown.dev) for LLM logic. Tribute to [shadcn/ui](https://ui.shadcn.com), following the precedent established by shadcn-svelte, shadcn-vue, and shadcn-solid.

**Status:** Phase 0 (bootstrap) + Phase 1 (core PromptInput) — pre-release.

## Why

Angular teams adding AI features hit four frictions:

1. **No AI component library.** AI Elements (Vercel), shadcn.io/ai, assistant-ui — all React.
2. **Streaming and tool calls are complex.** SSE, chunk parsing, tool dispatch — risky to write from scratch.
3. **Fragmented design.** spartan-ng has primitives but nothing AI-specific.
4. **Docs scattered.** Medium tutorials, no curation, no standard.

ShadNG fills the visual layer. Logic stays in Hashbrown.

## Stack

- **Angular 21 LTS** (minimum and target until Angular 22 reaches GA)
- **TypeScript 5.9**
- **Tailwind CSS v4** (OKLCH-based, two-tier tokens — shadcn-compatible)
- **@spartan-ng/brain** for headless primitives (peer dep, used as needed)
- **Nx 22** monorepo
- **Analog.js v2** for the docs site (SSR + file-based routing)
- **Vitest** for unit tests, **Playwright** for E2E
- **Storybook 10** for the internal workshop *(deferred — see TODO below)*

## Founding principle

> Complete documentation or it doesn't exist.

Every component must pass the full documentation checklist before being released publicly. No half-shipped components.

## Repo structure (Nx flat layout)

```
shadng/
├── packages/
│   ├── docs/                       # Analog.js SSR site
│   ├── docs-e2e/                   # Playwright E2E
│   ├── playground/                 # Angular demo app (visual smoke tests)
│   └── shadng-prompt-input/        # The library (Phase 1 in progress)
├── .github/workflows/
│   └── ci.yml                      # lint • test • build (Nx affected)
└── tsconfig.base.json              # path mappings
```

## Branches

- `main` — production / latest release
- `staging` — pre-release validation
- `develop` — active integration (default branch on GitHub)

## Quickstart (dev)

```bash
npm install

# Apps
npm run serve:playground            # localhost:4200 — visual smoke test
npm run serve:docs                  # localhost:4200 — Analog docs (SSR)

# Library
npm run build:lib                   # build @kalvner/shadng-prompt-input
npm run storybook                   # localhost:4400 — Storybook 10

# Quality
npm run lint                        # ESLint affected
npm run test                        # Vitest affected
npm run build                       # all builds via Nx affected

# Release flow (Changesets)
npm run changeset                   # describe a change
npm run changeset:version           # bump versions and update changelogs
npm run release                     # build lib + publish to npm
```

## Roadmap

| Phase | Scope |
|---|---|
| **v0.1.0** | PromptInput + 10 subcomponents |
| v0.2.0 | Response + MessageContent + CodeBlock |
| v0.3.0 | Conversation + Message |
| v0.4.0 | Reasoning + ToolCall + Suggestions |
| v0.5.0 | Artifact + Citation + Sandbox |
| v1.0.0 | Stable |

## Status

| Phase | Scope | Status |
|---|---|---|
| 0 | Bootstrap (Nx + Angular 21 + Tailwind v4 + Analog + Storybook + Changesets + CI) | ✅ |
| 1 | Core (`PromptInput` + `Textarea` + `Submit`) | ✅ |
| 2 | Toolbar (`Toolbar` + `Tools` + `Button`) | ✅ |
| 3 | Attachments (`Attachments` + `Attachment` + drag/drop + paste) | ✅ |
| 4 | Action menu + Model select | ✅ |
| 5 | Polish (a11y, reduced-motion, animations, mobile, aria-live) | ✅ |
| 6 | Documentation (component pages on `packages/docs`) | pending |
| 7 | CLI (`npx shadng add prompt-input`) | pending |
| 8 | Site (landing, search, dark toggle, OG images) | pending |
| 9 | Launch (v0.1.0 tag, npm publish, posts) | pending |

## TODOs

- [ ] **Real Home page in `packages/docs`** — Analog generated a placeholder home. Replace with a real landing presenting the project (hero, value props, install command, GitHub link). Phase 8 in the original plan; can be anticipated.
- [ ] **Vercel deploy of `packages/docs`** — configure preview deploys per branch once Vercel CLI is installed locally (`npm i -g vercel`).
- [ ] **spartan-ng theme init** — we ship our own two-tier tokens in `packages/shadng-core/styles/theme.css` instead of the spartan default. Decision documented in vault as ADR-013.
- [ ] **Authoring stories** for the remaining 9 subcomponents in Storybook (Phase 6 work — the container has a starter story shipping today).

## License

MIT © Kalvner
