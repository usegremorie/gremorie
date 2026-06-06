# rx-ai fidelity audit table (26 components vs AI Elements)

Date: 2026-06-02
Branch: fix/rx-ai-aielements-fidelity (off develop)
Spec: docs/specs/2026-06-02-rx-ai-aielements-fidelity.md
Scope: every component in packages/rx-ai/src/lib/\* diffed against the official Vercel AI Elements source (registry.ai-sdk.dev/<name>.json) and docs (elements.ai-sdk.dev/components/<name>).

> Note on em dashes: this document intentionally uses commas, colons and parentheses instead of em dashes, per the session rules.

## How this audit was run

Each component was diffed by a dedicated read only pass that fetched the official registry source plus docs, read the local source, barrel and stories, grepped the rx-ai tree for external usage of each export, and recorded: drift, bloat (dead extras), gaps (missing official pieces), render bugs, barrel completeness, composition violations (GARANTIA 1), and story state. Nothing was edited.

## Headline verdict

The package is in much better shape than the trigger (prompt-input) suggested. 23 of 26 components are faithful, complete ports with correct Gremorie composition (cn from rx-core, primitives from the right rx-\* packages, no inline reimplementations). The real source drift is concentrated in a small set. The dominant remaining work is, in order:

1. prompt-input cleanup: remove the dead extra families, complete the barrel, collapse the 6 fragmented stories into one integrated story (this is the heavy item).
2. A handful of source gaps: open-in-chat (GitHub provider), conversation (Download plus messagesToMarkdown), edge (token drift), sources (optional favicon), node (children slot nit), reasoning (shared Streamdown prop spread).
3. Cross cutting story and validation work for all 26: one integrated story with active controls and canonical states, then the GARANTIA 4 Playwright screenshot pass. A green build does not prove render fidelity, so every component still needs the visual check even where the source is already faithful.

Caveat to hold onto: this table is a static diff. Static diffs miss runtime render bugs (the exact failure mode that triggered this work on prompt-input). The screenshot pass in execution is where any remaining render bugs will surface, so "faithful" rows are provisional until screenshotted.

## Legend

- Drift: renamed or changed vs official.
- Bloat: extra non official subcomponents with zero external use (dead).
- Gaps: official subcomponents, variants, props or features missing locally.
- Render: suspected render bug from static read.
- Comp: GARANTIA 1 composition violations (inline primitive that should come from an rx-\* package).
- Barrel: does index.ts export the full public surface.
- Stories action: KEEP+CTRL (already integrated, add or verify controls and screenshot), TRIM (delete isolated part stories, keep one integrated), GAP (story missing a state or feature).
- Effort: S, M, L.

## Priority 1

| #   | Component    | Drift                                         | Bloat (dead)                                                                                                                                                                                                                                                                      | Gaps                                                                                                    | Render                                         | Comp                                                             | Barrel                                                                                                                                     | Stories action                                                                                                                          | Effort |
| --- | ------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | prompt-input | barrel exports only 13 of 40 official symbols | PromptInputCommandDialog only (non official, zero use). CORRECTION: the Speech, HoverCard, Command, Tabs and Select families ARE official today (40 exports, registryDependencies button, command, dropdown-menu, hover-card, input-group, select), so they are kept, not removed | none (ActionAddScreenshot and referencedSources are NOT in the official source, earlier note retracted) | "Ready" story renders thin and visually broken | none found (primitives come from rx-forms, rx-overlays, rx-core) | NO, omits the ActionMenu family, Attachment, ActionAddAttachments, Select, HoverCard, Tabs, Command families and SpeechButton (27 symbols) | TRIM 6 fragmented (ActionMenu, ModelSelect, Submit, Textarea, Toolbar, Tools) to one integrated with ready, submitted, streaming, error | L      |

## Priority 2

| #   | Component        | Drift                                                         | Bloat (dead)                                                           | Gaps                                              | Render                                                                         | Comp | Barrel                               | Stories action                              | Effort |
| --- | ---------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------ | ---- | ------------------------------------ | ------------------------------------------- | ------ |
| 2   | message          | none                                                          | none                                                                   | none                                              | none                                                                           | none | yes (14 subcomponents plus types)    | KEEP+CTRL (5 stories, all full composition) | S      |
| 3   | context          | none                                                          | none                                                                   | none                                              | none                                                                           | none | yes                                  | KEEP+CTRL (2 stories)                       | S      |
| 4   | open-in-chat     | OpenInGitHub absent though provider stub exists               | providers.github object declared but never consumed                    | OpenInGitHub component or remove the stub, decide | github stub createUrl returns url unchanged                                    | none | yes for shipped items                | KEEP+CTRL, GAP (no GitHub story)            | M      |
| 5   | inline-citation  | none                                                          | none                                                                   | none                                              | none                                                                           | none | yes (14 subcomponents)               | KEEP+CTRL (3 stories)                       | S      |
| 6   | queue            | none                                                          | none                                                                   | none                                              | none                                                                           | none | yes (15 subcomponents)               | KEEP+CTRL (3 stories)                       | S      |
| 7   | chain-of-thought | none                                                          | none                                                                   | none                                              | none                                                                           | none | yes (7 subcomponents)                | KEEP+CTRL (5 stories)                       | S      |
| 8   | reasoning        | intentional ref optimization vs official (documented in code) | none                                                                   | none                                              | inherits official bug, props spread to Streamdown should destructure className | none | yes (3 components plus useReasoning) | KEEP+CTRL (5 stories)                       | M      |
| 9   | model-selector   | none                                                          | ModelSelectorDialog has zero external use (monitor, do not remove yet) | none                                              | none                                                                           | none | yes (14 subcomponents)               | KEEP+CTRL (2 stories)                       | S      |

## Priority 3 (canvas and React Flow family)

| #   | Component  | Drift                                                                                 | Bloat (dead) | Gaps | Render                                                              | Comp                                           | Barrel                              | Stories action                                                                       | Effort |
| --- | ---------- | ------------------------------------------------------------------------------------- | ------------ | ---- | ------------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------ | ------ |
| 10  | canvas     | none                                                                                  | none         | none | none                                                                | none (xyflow is the correct base)              | yes                                 | KEEP+CTRL (3 stories)                                                                | S      |
| 11  | node       | none                                                                                  | none         | none | props.children renders between handles and slots, clarify or remove | none (Card from rx-display)                    | yes (7 subcomponents)               | KEEP+CTRL (2 stories)                                                                | S      |
| 12  | edge       | token drift, uses stroke-ring and var(--primary) while sibling uses var(--color-ring) | none         | none | none                                                                | none                                           | yes (Edge.Temporary, Edge.Animated) | KEEP+CTRL (3 stories)                                                                | S      |
| 13  | connection | none                                                                                  | none         | none | none                                                                | none                                           | yes                                 | KEEP+CTRL (1 story)                                                                  | S      |
| 14  | controls   | none                                                                                  | none         | none | none                                                                | none (xyflow Controls renders its own buttons) | yes (Controls plus type)            | KEEP+CTRL (2 stories)                                                                | S      |
| 15  | panel      | none                                                                                  | none         | none | none                                                                | none                                           | yes (Panel)                         | KEEP+CTRL (2 stories)                                                                | S      |
| 16  | toolbar    | none (thin NodeToolbar wrapper)                                                       | none         | none | none                                                                | none                                           | yes (Toolbar)                       | TRIM, several stories demo child content not the toolbar, collapse to one integrated | M      |

## Priority 4 (the rest)

| #   | Component    | Drift                                                                   | Bloat (dead) | Gaps                                                        | Render | Comp                               | Barrel                           | Stories action                                                                      | Effort |
| --- | ------------ | ----------------------------------------------------------------------- | ------------ | ----------------------------------------------------------- | ------ | ---------------------------------- | -------------------------------- | ----------------------------------------------------------------------------------- | ------ |
| 17  | conversation | none                                                                    | none         | ConversationDownload and messagesToMarkdown utility missing | none   | none                               | NO, Download missing once added  | KEEP+CTRL, GAP (add Download)                                                       | M      |
| 18  | confirmation | minor, removed AI SDK v6 ts-expect-error and refined union (compatible) | none         | none                                                        | none   | none                               | yes (7 subcomponents plus types) | KEEP+CTRL (3 states)                                                                | S      |
| 19  | tool         | none                                                                    | none         | none                                                        | none   | none (CodeBlock from rx-artifacts) | yes (5 subcomponents)            | TRIM, 9 stories, keep one integrated plus an all states matrix                      | S      |
| 20  | plan         | none                                                                    | none         | none                                                        | none   | none                               | yes (8 subcomponents)            | KEEP+CTRL (3 stories)                                                               | S      |
| 21  | task         | none                                                                    | none         | none                                                        | none   | none                               | yes (4 subcomponents)            | KEEP+CTRL (5 stories)                                                               | S      |
| 22  | sources      | none                                                                    | none         | optional favicon or icon resolution for Source (minor)      | none   | none                               | yes (4 subcomponents)            | KEEP+CTRL (5 stories)                                                               | S      |
| 23  | checkpoint   | none                                                                    | none         | none                                                        | none   | none                               | yes (3 subcomponents plus types) | KEEP+CTRL (4 stories)                                                               | S      |
| 24  | shimmer      | none                                                                    | none         | none                                                        | none   | none                               | yes (Shimmer)                    | KEEP+CTRL (4 stories)                                                               | S      |
| 25  | suggestion   | none                                                                    | none         | none                                                        | none   | none                               | yes (2 subcomponents plus types) | TRIM or consolidate, 8 variant and size showcases into one integrated with controls | S      |
| 26  | image        | none                                                                    | none         | none                                                        | none   | none                               | yes (Image)                      | KEEP+CTRL (2 stories), note zero external usage in repo                             | S      |

## Components with real source work (beyond stories and screenshots)

- prompt-input (L): the single heavy item. CORRECTED after fetching the official source: the Select, HoverCard, Command, Tabs and Speech families are official (40 exports, registryDependencies confirm), so they are kept, not removed. The real work is, diff the local implementation of each subcomponent against the official and reconcile internal drift, remove only the non official PromptInputCommandDialog, export the full 40 symbol surface plus types from the barrel, fix the broken Ready render (systematic-debugging), and collapse the 7 stories into one integrated story with the four status states. There are no missing official pieces (ActionAddScreenshot and referencedSources do not exist in the official source).
- open-in-chat (M): either implement OpenInGitHub faithfully (the providers.github stub already exists but is dead and its createUrl is a no op) or remove the stub if GitHub is not part of the official set. Decide against the official source.
- conversation (M): add ConversationDownload and the messagesToMarkdown utility from the official source, then add the Download to the integrated story and the barrel.
- reasoning (M): keep the intentional ref optimization, but destructure className so it is not spread into Streamdown (the official has the same latent bug). Document the intentional divergence.
- edge (S): align the stroke token to var(--color-ring) to match the connection sibling and the official.
- node (S): decide on the props.children slot placement (remove free children or document it), matching the official structured slot pattern.
- sources (S): optional, add favicon or icon resolution for Source if the official registry includes it.

## Cross cutting findings

- Composition (GARANTIA 1) is healthy. No component reimplements a primitive that should come from an rx-\* package. The earlier worry that primitives were inlined did not materialize outside prompt-input, and even prompt-input sources its primitives correctly. No new peerDependencies are required.
- Barrels are complete except prompt-input and (after the gap fix) conversation.
- Stories: the only truly fragmented part stories are in prompt-input (6) and toolbar (several). Most other components already ship integrated stories that compose the full component across canonical states. The remaining story work is to guarantee exactly one integrated story per component, add or verify argTypes and controls for the relevant props, and delete any isolated part story.
- GARANTIA 4 applies to all 26 regardless of source verdict. Every integrated story must be screenshotted in Storybook on port 4401 and compared to the official look before the component is marked done.

## Effort roll up

- L: prompt-input.
- M: open-in-chat, conversation, reasoning, toolbar.
- S: the remaining 21 (mostly story consolidation, controls, and the mandatory screenshot pass, plus the small edge and node touch ups).

## Next steps

1. Turn this table into a per component plan with the writing-plans skill.
2. Execute in the spec priority order with executing-plans or subagent-driven-development, one commit per component (fix(rx-ai/<name>): reimport faithful AI Elements with project subcomponents).
3. For every component, run nx build rx-ai and nx lint rx-ai, open the integrated story on port 4401, screenshot via Playwright, and only then mark it done.
4. Finish with nx run-many -t lint build test --all and nx format:check --all, then open the PR fix/rx-ai-aielements-fidelity into develop.

## Execution outcome (2026-06-02)

All 26 components were reimported or verified faithful and screenshot validated in Storybook on port 4401. Several audit-agent findings turned out to be false positives once checked against the official registry source, and are recorded here so they are not re-chased:

- open-in-chat: the official ships only 6 providers and no GitHub. The local providers.github stub was non official dead code and was removed (not implemented).
- conversation: the official has exactly 4 exports. ConversationDownload and messagesToMarkdown do not exist in the official, so nothing was added.
- edge: the official uses the exact same stroke-1 stroke-ring class and var(--primary) dot. No drift, no change.
- node: byte identical to the official, including the props.children placement. No change.
- checkpoint and image: the unused className and uint8Array are intentional destructures (exclude from the props spread), byte identical to the official. No change.
- reasoning: faithful and renders well. The ref optimization is an intentional, working divergence; the Streamdown className spread matches the official. No change.

Code changes (commits): prompt-input (faithful reimport, full barrel, one integrated story, and the footer must be a sibling of Body render fix), open-in-chat (removed the non official GitHub stub), message and toolbar and tool and suggestion (story consolidation into one integrated story with controls). Plus the lucide-react alignment chore and this audit table.

Verified faithful with render screenshotted, no code change needed: context, inline-citation, queue, chain-of-thought, reasoning, model-selector, canvas, node, edge, connection, controls, panel, conversation, confirmation, plan, task, sources, checkpoint, shimmer, image.

Cross cutting: GARANTIA 1 composition is clean across all 26 (no inline primitives). The one real render bug was prompt-input (footer nesting), which also affects the apps/docs examples (spun off as a separate follow up).
