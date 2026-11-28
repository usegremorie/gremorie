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

### `gremorie add <items...>`

Copy registry items into your project and install the npm packages they
need:

```bash
gremorie add rx-button
gremorie add ng-prompt-input
```

The package manager is detected from the `packageManager` field of
`package.json` or the lockfile (pnpm, yarn, bun, npm), looking up to the
workspace root. Packages already declared in `package.json` are skipped, so
existing version ranges are never rewritten.

Flags:

- `--no-install` · write the files and print the install command instead of running it
- `--dry-run` · write and install nothing; print the files and the install command
- `--framework <fw>` · `ng` or `rx`, when the item name does not say

If the install fails, the files stay in place, the CLI prints the command to
run, and the exit code is 1.

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
