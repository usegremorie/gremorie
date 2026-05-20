# @shadng/cli

Command line interface for ShadNG. Scaffolds AI components into your Angular app.

## Install

```bash
# Use without installing (recommended):
npx shadng init

# Or install globally:
npm install -g @shadng/cli
```

## Commands

### `shadng init`

Set up ShadNG in an existing project:

- Detects your package manager (npm / pnpm / yarn / bun)
- Installs `@shadng/core` and peer dependencies
- Adds `@import '@shadng/core/theme.css'` to your global stylesheet
- Reports any manual steps remaining

Flags:

- `--dry-run` — print what would happen without writing files
- `-y, --yes` — skip confirmation prompts

### `shadng add <component>`

Install a component family:

```bash
shadng add prompt-input
```

Installs the npm package and prints an import snippet. Currently available:

- `core` — utilities + Button primitive
- `prompt-input` — PromptInput container family (10 components)

### `shadng list`

List available components and what's coming in future phases.

```bash
shadng list
# or
shadng ls
```

## Roadmap

- v0.1 — install pre-built packages from npm (current)
- v0.2 — copy source files into your project (shadcn-style) so you own the code
- v0.3 — hosted registry at shadng.dev so new components ship without a CLI release
