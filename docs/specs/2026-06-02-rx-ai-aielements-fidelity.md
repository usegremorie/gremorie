# rx-ai fidelity audit and reimport against AI Elements

Date: 2026-06-02
Status: approved scope, for a dedicated session

## Why this exists

While testing the theme switcher, the React `PromptInput` showed up broken in
Storybook. Investigation found it is not missing pieces, it is bloated and
mis-exposed:

- `packages/rx-ai/src/lib/prompt-input/prompt-input.tsx` is 1453 lines with 37
  exported components. Beyond the real AI Elements set it adds `Speech`,
  `HoverCard`, `Command`, `Tabs`, and a bespoke `Select`. Those extras are used
  in ZERO files outside the component (dead code).
- The barrel `index.ts` exports only a partial subset and omits the real
  building blocks (`ActionMenu`, `ModelSelect/Select`, `Toolbar`), so a consumer
  cannot even compose the full PromptInput.
- The "Container / Ready" story renders a minimal, visually broken control (a
  thin bar with a stray dark square and a submit button), no toolbar, tools,
  attachments, or model select.
- The component has 7 fragmented stories (ActionMenu, ModelSelect, Submit,
  Textarea, Toolbar, Tools, Container) instead of one integrated story.

The decision: the same drift very likely affects the other rx-ai components, so
this is a full audit and faithful reimport of the whole rx-ai surface, with
quality and completeness over speed. No shortcuts.

## Goal

Bring every `rx-ai` component back to faithful, complete parity with the
official AI Elements component (all subcomponents, variants, and features),
adapted to Gremorie primitives and tokens. Remove dead code. Export the full
public surface per component. Replace fragmented stories with one integrated
story per component that exercises the real composed usage.

## Principles

- Faithful to the official AI Elements source: same component names,
  subcomponents, variants, props, and behavior. When the official component
  changed since this code was first ported, follow the current official source.
- Adapt to Gremorie, do not reinvent: `cn` from `@gremorie/rx-core`, the unified
  `radix-ui` import, `data-slot` attributes, and Gremorie semantic tokens
  (`bg-background`, `text-muted-foreground`, etc.). Match the new-york-v4 shape
  the rest of the DS uses.
- No dead code: if a subcomponent is not part of the official AI Elements
  component and is not used anywhere, it does not ship.
- One integrated story per component (real composed usage with controls and
  states), not a story per internal part. Delete the fragmented stories.
- Validate each component visually in Storybook (Playwright screenshot) before
  marking it done. A green build is not enough; it must render correctly.

## The rx-ai surface (26 components)

`canvas`, `chain-of-thought`, `checkpoint`, `confirmation`, `connection`,
`context`, `controls`, `conversation`, `edge`, `image`, `inline-citation`,
`message`, `model-selector`, `node`, `open-in-chat`, `panel`, `plan`,
`prompt-input`, `queue`, `reasoning`, `shimmer`, `sources`, `suggestion`,
`task`, `tool`, `toolbar`.

Note: `code-block`, `web-preview`, and `artifact` were extracted to
`@gremorie/rx-artifacts`; audit those there if in scope for a later pass.

## Method (per component)

For each component, in priority order:

1. Fetch the official AI Elements source and docs:
   - `https://elements.ai-sdk.dev/components/<name>` (usage, variants, features)
   - `https://registry.ai-sdk.dev/<name>.json` (the installable source, when it
     exists; some are sub-parts of another component).
2. Diff the official source against `packages/rx-ai/src/lib/<name>/<name>.tsx`.
   Record: drift (renamed/changed), bloat (extra non-official subcomponents),
   gaps (missing official subcomponents/variants/features), and any render bug.
3. Reimport faithfully: bring the component to the official shape with ALL
   subcomponents, variants, and features, adapted to Gremorie primitives/tokens.
   Remove dead extras. Keep any Gremorie-intentional addition only if it is
   documented and used.
4. Update the barrel `index.ts` to export the complete public surface (all
   subcomponents and types).
5. Replace the fragmented stories with ONE integrated story
   (`<name>.stories.tsx`) that composes the full component in real usage, with
   the relevant states (for PromptInput: ready / submitted / streaming / error;
   for others: the canonical states/variants). Delete the part-stories.
6. Validate: `nx build rx-ai` and `nx lint rx-ai` green; open the integrated
   story in Storybook and screenshot it; confirm it renders correctly and
   matches the official look.
7. Commit per component (`fix(rx-ai/<name>): reimport faithful AI Elements ...`).

## Priority order

1. `prompt-input` (most broken and bloated; the trigger for this work).
2. The largest and most central next: `message`, `context`, `open-in-chat`,
   `inline-citation`, `queue`, `chain-of-thought`, `reasoning`, `model-selector`.
3. The canvas/workflow family together (`canvas`, `node`, `edge`, `connection`,
   `controls`, `panel`, `toolbar`), since they share the React Flow base.
4. The rest (`conversation`, `confirmation`, `tool`, `plan`, `task`, `sources`,
   `checkpoint`, `shimmer`, `suggestion`, `image`).

## Acceptance criteria

- Each component matches the official AI Elements component (names,
  subcomponents, variants, features), adapted to Gremorie tokens.
- No dead/unused subcomponents remain.
- `index.ts` exports the full public surface per component.
- Exactly one integrated story per component; the fragmented part-stories are
  gone.
- Every integrated story renders correctly (verified by screenshot), not just
  builds.
- `nx run-many -t lint build test --all` green; format clean; no `--brand` or
  other dead references.

## Non-goals

- Theming work (that is on `feat/theming-tokens`, pending visual calibration and
  merge).
- The Angular edition (`ng-ai`); a separate parity pass.
- `rx-artifacts` (code-block, web-preview, artifact), unless added later.

## Suggested workflow for the dedicated session

- Branch: `fix/rx-ai-aielements-fidelity` off `develop` (or off `main` after the
  theming merge).
- Start with the audit table: run the diff for all 26 components first and write
  the findings, so the size of the work is known before editing. Then execute
  per component in the priority order, validating visually each time.
- Use the systematic-debugging skill for the render bugs and the writing-plans
  skill once the audit table exists, to turn it into a per-component plan.

## References

- AI Elements components: https://elements.ai-sdk.dev/components
- AI Elements registry items: https://registry.ai-sdk.dev/<name>.json
- The PromptInput official composed example is captured in the brainstorming
  notes for this work (toolbar + action menu add attachments + model select +
  submit with status), and is the template for the integrated story.
