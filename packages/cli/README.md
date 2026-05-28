# @gremorie/ng-cli

Command line interface for Gremorie NG. Scaffolds AI components into your Angular app.

## Install

```bash
# Use without installing (recommended):
npx gremorie init

# Or install globally:
npm install -g @gremorie/ng-cli
```

## Commands

### `gremorie init`

Set up Gremorie NG in an existing project:

- Detects your package manager (npm / pnpm / yarn / bun)
- Installs `@gremorie/ng-core` and peer dependencies
- Adds `@import '@gremorie/ng-core/theme.css'` to your global stylesheet
- Reports any manual steps remaining

Flags:

- `--dry-run` — print what would happen without writing files
- `-y, --yes` — skip confirmation prompts

### `gremorie add <component>`

Install a component family:

```bash
gremorie add prompt-input
```

Installs the npm package and prints an import snippet. Currently available:

- `core` — utilities + Button primitive
- `prompt-input` — PromptInput container family (10 components)

### `gremorie list`

List available components and what's coming in future phases.

```bash
gremorie list
# or
Gremorie NG ls
```

## Roadmap

- v0.1 — install pre-built packages from npm (current)
- v0.2 - copy source files into your project so you own the code
- v0.3 — hosted registry at gremorie.com so new components ship without a CLI release
