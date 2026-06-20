# @gremorie/contracts

Agnostic component contracts - the single source of truth for each component
across the React (`rx-*`) and Angular (`ng-*`) editions, Figma, and the MCP.

Each component has one `*.contract.ts` with three blocks:

- `anatomy` - the subcomponent tree (shared RX/NG)
- `props` - the agnostic public API (identical names across editions + Figma)
- `guidance` - `summary` / `whenToUse` / `whenNotToUse` / `rules` / `example`

Everything else is generated from the contract: the docs prop tables
(`<PropsTable for>`), Figma Code Connect mappings, the MCP/`llms.txt` docs, and
the `/workbench` data. A `ts-morph` parity lint asserts the contract matches the
real React props and Angular inputs, failing CI on drift.

Design: `docs/superpowers/specs/2026-06-20-component-contract-workbench-design.md`
Plan: `docs/superpowers/plans/2026-06-20-component-contract-foundation.md`

```bash
nx test contracts
nx build contracts
```
