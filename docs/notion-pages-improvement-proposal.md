# Notion "Gremorie — Componentes" — improvement proposal (by page type)

## The base today

The Gremorie documentation is mirrored into Notion as one database,
**Gremorie — Componentes** (`b095cbaa-7c8f-4618-9f03-dd7de4634b55`), under the
`Gremorie` page. It is a hierarchical tracker, not prose: every row is a node in
the docs tree, typed by a `Tipo` select.

**Schema**

| Property                     | Type            | Purpose                                                                |
| ---------------------------- | --------------- | ---------------------------------------------------------------------- |
| `Componente`                 | title           | Node name                                                              |
| `Tipo`                       | select          | `Tab` · `Categoria` · `Componente` · `Item` · `Seção`                  |
| `React`                      | select (status) | `Publicado` · `Em dev` · `Revisando` · `Precisa revisão` · `Planejado` |
| `Angular`                    | select (status) | same options                                                           |
| `Doc`                        | url             | link to the public Fumadocs page                                       |
| `Slug`                       | text            | route slug                                                             |
| `Reg`                        | checkbox        | shipped through the registry?                                          |
| `npm`                        | checkbox        | published to npm?                                                      |
| `Subitem` / `item principal` | relation        | parent/child tree wiring                                               |
| `Atualizado`                 | last edited     | auto                                                                   |

So the five **page types** are tree levels: `Tab` (top nav: Components,
Artifacts, Blocks, Tokens…) → `Categoria` (Forms, Display, Data, Chatbot…) →
`Componente` (Bar Chart, Prompt Input…) → `Item` / `Seção` (subcomponents and
doc sections).

The problem the tracker has today: it records **status** well but says nothing
about **completeness against the documentation standard** (the 25-item binary
checklist in `apps/docs/.../documentation-standard.mdx`). A row can be
"Publicado" while its page is missing variants, a11y notes, or theming — the
exact gap Kal flagged ("muitos componentes não estão com todas as variações").

## Proposal — what each page type should carry

The fix is to make each `Tipo` carry the fields that matter _at that level_, so
the database becomes a live completeness dashboard, not just a status list.

### `Tab` (e.g. Components, Artifacts, Blocks, Tokens)

- Add a **rollup**: `% Componentes Publicados` and `% docs checklist-complete`
  across descendants. A Tab is "green" only when its tree is.
- Add an `Edição` note: which framework editions the Tab covers (RX, NG, both).
- Keep these pages thin — they are nav, not content.

### `Categoria` (e.g. Forms, Display, Data, Chatbot)

- Add a **rollup of variant coverage** (see the `Variantes` field below) so a
  category surfaces its weakest component at a glance.
- Add `Reference` (url): the market reference the category is benchmarked
  against (AI Elements / shadcn / Radix), per the reference-first rule.

### `Componente` (the important one — e.g. Bar Chart, Assistant)

Add the fields that encode "is this page actually done":

- **`Variantes` (text/number)** — `documented / total`. e.g. Bar Chart
  `7/7` (single, multi, stacked, horizontal, labels, per-bar, no-axis). This is
  the field that would have caught the missing examples.
- **`Checklist` (number 0–25)** — items passed from the documentation standard.
- **`Anatomia` (checkbox)** — does the page carry the fixed anatomy tree (now a
  shared RX/NG contract, see `docs/anatomy/`).
- **`A11y` (select)** — `AA` / `partial` / `none`.
- **`Paridade RX↔NG` (select)** — `full` / `partial` / `rx-only` / `ng-only`.
  This is now first-class: every component must reach input-for-input parity.
- Keep `React` / `Angular` status, `Doc`, `Reg`, `npm`.

### `Item` / `Seção` (subcomponents and doc sections)

- `Item` (subcomponent, e.g. `PromptInputToolbar`): inherit the parent's
  `Paridade` and a lightweight `Checklist` (a subcomponent page still passes the
  standard, just shorter).
- `Seção` (a doc section like "Variants" or "Accessibility"): turn these into a
  **template checklist** the `Componente` rows roll up from, so "section
  present" is tracked structurally rather than by eyeball.

### New views to add

1. **"Faltando variantes"** — filter `Variantes` where documented < total.
   This is the worklist for the gap Kal flagged.
2. **"Paridade pendente"** — filter `Paridade RX↔NG` ≠ `full`.
3. **"Checklist < 25"** — the not-actually-done-yet list.
4. Group the default table by `Tab` → `Categoria` for a tree read.

## Status updates this task warrants (apply now)

The Angular work shipped in this branch makes several rows stale. Recommended
edits:

| Row (Componente)                             | `Angular` → | `Paridade` → | Note                                                       |
| -------------------------------------------- | ----------- | ------------ | ---------------------------------------------------------- |
| Area/Bar/Line/Scatter/Pie/Radar/Radial Chart | `Revisando` | `full`       | NG charts at React parity; built + 51 tests + screenshots  |
| Chart Artifact                               | `Revisando` | `full`       | new `@gremorie/ng-artifacts` package                       |
| Assistant (chat surface block)               | `Revisando` | `full`       | new `ai-assistant`; also fixed a Reasoning collapsible bug |
| Reasoning                                    | (unchanged) | `full`       | bug fixed: `brnCollapsible` moved to host                  |

(`Revisando`, not `Publicado`, because nothing in the repo is npm-published yet —
match whatever the React rows use; if React charts are `Publicado`, mirror that.)

## Why this shape

It keeps Notion as the **single status+completeness dashboard** while the prose
lives in Fumadocs (no content duplication). The added fields are exactly the
documentation-standard axes, so "green in Notion" becomes synonymous with "meets
the bar" — which is the whole point of the standard.
