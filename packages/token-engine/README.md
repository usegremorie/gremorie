# @gremorie/token-engine

Framework-agnostic core for the Tokens visual editor: CSS parsing, cva
extraction, token graph, comment-preserving serializer, and a Hono CLI runner.

Migrated from `kalvner/bridge` (`@kalvner/token-engine`) into the Gremorie
monorepo in Phase 2.

## DTCG source

Pointed at the root of the Gremorie monorepo
(`node packages/token-engine/bin/cli.mjs .`), the engine reads the design
tokens from their DTCG source, `packages/tokens/tokens/**/*.json`, instead of a
CSS file. An edit from the editor writes the new `$value` into the JSON file
that holds the token (formatted with Prettier), then runs
`packages/tokens/pipeline/build.ts` to regenerate `styles/theme.css` and
`styles/themes/*.css`. Editing a theme token the theme file does not have yet
creates the override in that theme's `light` or `dark` group, typed from the
base token.

The editor can write colours (as `oklch()`) and references to other tokens.
Edits the source cannot hold, such as a literal font stack or a colour in
another notation, are refused with HTTP 400 and nothing is written.

Any other project is detected by its `components.json`, and the engine edits
the global CSS file it points to, as before.
