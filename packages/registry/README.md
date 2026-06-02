# @gremorie/registry

Internal generator that emits the Gremorie registry consumed by the CLI and the
MCP server. Reads `packages/ng-*` source plus the co-located `usage.md` of each
package and writes JSONs to `apps/docs/public/r/`.

Not published. Internal tool.

## Usage

```bash
nx run registry:build      # compile to dist/
nx run registry:generate   # produce apps/docs/public/r/**/*.json
```

`generate` cleans the output directory first, then writes:

- `apps/docs/public/schema/registry-item.json` — JSON Schema for a registry item
- `apps/docs/public/r/registry.json` — index of all items
- `apps/docs/public/r/<framework>/<name>.json` — one file per item

## Output shape

Each item follows the Gremorie `registry-item` schema (compatible with the
shadcn registry-item shape, see `NOTICE.md`), extended with a `usage` block
carrying design knowledge (when to use, anti-patterns, API, examples). The
CLI consumes the bare `files[]`; the MCP server consumes everything, especially
the `usage` block.

## Adding an item

1. Drop your source files under `packages/ng-<name>/src/lib/`.
2. Add an entry to `src/items.ts` listing the files to embed.
3. Write `packages/ng-<name>/usage.md` (frontmatter format described in
   `src/usage.ts`). Missing files produce a `TBD` placeholder.
4. Run `nx run registry:generate`.

## Where `usage` lives

By default, in `packages/<package>/usage.md`. The file uses YAML frontmatter:

```yaml
---
whenToUse: 'Container for an AI prompt input with state machine.'
whenNotToUse: 'A plain text input - reach for ng-core utilities instead.'
bestPractices:
  - 'Always nest a PromptInputTextarea.'
antipatterns:
  - "Don't wire the submit handler outside the host element."
api:
  inputs:
    - name: value
      type: string
      required: true
---
```

Co-locating `usage.md` next to the source means the source and the doc move
together when the package is renamed or extracted - a property the Bridge phase
of this monorepo relies on.
