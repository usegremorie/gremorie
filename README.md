# Gremorie

> AI-native design system distributed via registry and MCP server. Two editions: Angular and React.

Gremorie is the design system of AI-native components that should exist but doesn't. Built on [spartan-ng](https://www.spartan.ng) primitives (Angular edition) and [Radix](https://www.radix-ui.com) primitives (React edition), designed to integrate cleanly with [Hashbrown](https://hashbrown.dev) for LLM logic. Built on the registry-distribution pattern pioneered by shadcn/ui (MIT, see `NOTICE.md`).

**Status:** pre-release. Two editions in active development.

## Why

Teams adding AI features hit four frictions:

1. **No AI component library.** AI Elements (Vercel), assistant-ui - all React-only or scattered.
2. **Streaming and tool calls are complex.** SSE, chunk parsing, tool dispatch - risky to write from scratch.
3. **Fragmented design.** spartan-ng has primitives but nothing AI-specific. shadcn/ui covers a lot but doesn't ship AI primitives.
4. **Docs scattered.** Medium tutorials, no curation, no standard.

Gremorie fills the visual layer. Logic stays in Hashbrown.

## Stack

- **Angular 21 LTS** (minimum and target until Angular 22 reaches GA)
- **React 19**
- **TypeScript 5.9**
- **Tailwind CSS v4** (OKLCH-based, two-tier tokens)
- **@spartan-ng/brain** for Angular headless primitives (peer dep)
- **Radix UI** for React headless primitives (peer dep)
- **Nx 22** monorepo
- **Next.js 16 + Fumadocs** for the docs site
- **Analog.js v2** for the Angular preview host
- **Vitest** for unit tests, **Playwright** for E2E
- **Storybook 10** for the internal workshop

## Founding principle

> Complete documentation or it doesn't exist.

Every component must pass the full documentation checklist before being released publicly. No half-shipped components.

## Repo structure (Nx flat layout)

```
gremorie/
+-- apps/
|   +-- docs/                       # Next.js + Fumadocs site (gremorie.com)
|   +-- tokens/                     # Tokens visual editor
+-- packages/
|   +-- docs/                       # Analog.js Angular preview host
|   +-- docs-e2e/                   # Playwright E2E
|   +-- playground/                 # Angular demo app (visual smoke tests)
|   +-- ng-core/                    # @gremorie/ng-core (Angular cross-category utilities, Button)
|   +-- ng-ai/                      # @gremorie/ng-ai (PromptInput, Attachments)
|   +-- ng-containers/              # @gremorie/ng-containers (ScrollArea, ...)
|   +-- ng-data/                    # @gremorie/ng-data (Charts on D3)
|   +-- rx-core/                    # @gremorie/rx-core (React utilities, cn)
|   +-- rx-ai/                      # @gremorie/rx-ai (React AI primitives)
|   +-- rx-forms/                   # @gremorie/rx-forms (Button, Input, Select, ...)
|   +-- rx-display/                 # @gremorie/rx-display (Card, Table, Avatar, ...)
|   +-- rx-feedback/                # @gremorie/rx-feedback (Alert, Progress, Skeleton)
|   +-- rx-navigation/              # @gremorie/rx-navigation (Sidebar, Tabs, ...)
|   +-- rx-overlays/                # @gremorie/rx-overlays (Dialog, Popover, ...)
|   +-- rx-containers/              # @gremorie/rx-containers (ScrollArea, Resizable)
|   +-- rx-data/                    # @gremorie/rx-data (Charts)
|   +-- registry/                   # @gremorie/registry (registry items + schema)
|   +-- token-engine/               # @gremorie/token-engine
|   +-- cli/                        # @gremorie/cli (`npx gremorie init/add/list`)
+-- .github/workflows/
|   +-- ci.yml                      # lint, test, build (Nx affected)
+-- NOTICE.md                       # third-party attribution
+-- LICENSE                         # MIT
+-- tsconfig.base.json              # path mappings
```

## Branches

- `main` - production / latest release
- `staging` - pre-release validation
- `develop` - active integration (default branch on GitHub)

## Quickstart (dev)

```bash
npm install

# Apps
npm run serve:playground            # Angular playground - visual smoke test
npm run serve:docs                  # Fumadocs site (gremorie.com)

# Library builds
npx nx build ng-core
npx nx build ng-ai
npx nx build rx-forms
npx nx build registry               # regenerate registry JSONs
npx nx run-many -t build            # all packages

# Quality
npm run lint                        # ESLint affected
npm run test                        # Vitest affected
npm run build                       # all builds via Nx affected

# Release flow (Changesets)
npm run changeset                   # describe a change
npm run changeset:version           # bump versions and update changelogs
npm run release                     # build lib + publish to npm
```

## License

MIT (c) Kalvner. See `LICENSE`.

## Attribution

Parts of the React edition adapt source from shadcn/ui under the MIT License.
See `NOTICE.md` for full third-party attribution.
