# rx-\* primitives validation (base + AI)

Date: 2026-06-03
Branch: chore/rx-primitives-validation (off develop)
Goal: validate every React primitive package for correctness, completeness and publish readiness, so the base and AI components can be consumed from another project.

> Note: this document uses commas and parentheses instead of em dashes, per the session rules.

## Scope

Ten publishable React packages:

| Package       | Components             | Stories | Role                                           |
| ------------- | ---------------------- | ------- | ---------------------------------------------- |
| rx-core       | 0 (cn util + base CSS) | -       | foundation                                     |
| rx-forms      | 16                     | 16      | Button, Input, Select, Form, InputGroup, etc.  |
| rx-overlays   | 12                     | 12      | Dialog, DropdownMenu, Command, Tooltip, etc.   |
| rx-display    | 9                      | 9       | Card, Table, Badge, Avatar, Accordion, etc.    |
| rx-data       | 8                      | 9       | recharts based charts                          |
| rx-navigation | 6                      | 6       | Tabs, Sidebar, Breadcrumb, Menubar, etc.       |
| rx-containers | 4                      | 4       | ScrollArea, Resizable, AspectRatio, Stack      |
| rx-artifacts  | 4                      | 5       | CodeBlock, WebPreview, Artifact, ChartArtifact |
| rx-feedback   | 3                      | 3       | Alert, Progress, Skeleton                      |
| rx-ai         | 26                     | 26      | AI Elements (validated in PR #18)              |

62 base primitives plus 26 AI components.

## 1. Publish readiness baseline (all green)

- nx run-many -t lint build test --all: green (28 projects).
- dist with index.js and index.d.ts emitted for all 10 React packages.
- Barrels (src/index.ts) complete: every component is exported, zero omissions.
- peerDependencies: every cross package import is declared. Clean graph: rx-core is the base, rx-forms depends on rx-core, rx-overlays on core plus forms, rx-display on core plus forms, rx-navigation on core plus forms plus display plus feedback plus overlays, rx-artifacts on core plus display plus forms plus overlays plus data, rx-ai on the full set.
- package.json publish fields correct on all 10: types, module, files includes dist, publishConfig.access public, sideEffects false (rx-core marks its CSS as side effectful for correct tree shaking).
- @gremorie/tokens is publishable (ships styles via the files field) and the compiled rx-core dist carries the theme fix (:root[data-theme]).

## 2. Fidelity audit (62 base components)

Each component was diffed against its upstream source (shadcn new-york-v4 for the shadcn primitives, AI Elements for the artifacts, recharts for the charts), by 8 parallel read only passes plus a critical re verification of every flagged item.

Result: all 62 base components are faithful and complete. No dead code, no missing official subcomponents, no render bugs.

Three items were flagged as needs-work by the automated pass and then disproved against the official source (recorded so they are not re chased):

- display/card: CardAction and CardDescription ARE official shadcn exports (present in the card.json export block), so the local card is faithful, not a divergence.
- navigation/sidebar: sidebarMenuButtonVariants is internal in shadcn too (defined as a non exported const), so the local not exporting it is faithful. The local useIsMobile hook is an accepted adaptation.
- artifacts/code-block: CodeBlockProps is unexported in the official AI Elements code block as well, so the local matches it.

## 3. Intentional extensions (value add, not bloat)

Deliberate, documented, used additions beyond the upstream surface, all kept:

- display/avatar: AvatarBadge, AvatarGroup, AvatarGroupCount.
- overlays/popover: PopoverHeader, PopoverTitle, PopoverDescription composition helpers.
- overlays/sonner: re exports the sonner toast function for convenience.
- display/featured-icon: a custom Untitled UI style primitive.
- containers/stack: a custom layout primitive.
- artifacts/chart-artifact: a custom chart card wrapper over rx-data.
- forms/input-group and forms/input-otp: the newer shadcn primitives.

## 4. Visual smoke (Storybook port 4401)

Screenshot validated one composite component per package across the six richest packages, all rendering correctly:

- forms: the signup Form (Form, FormField, FormItem, FormLabel, FormControl, FormDescription, Input, Label, Checkbox, Button).
- overlays: the Command palette (search, grouped items, icons, keyboard shortcuts).
- display: the invoice Table with Badge variants (secondary, outline, destructive), footer total, caption.
- navigation: the full Sidebar (Provider, Header, Menu with active state and a count badge, Footer, Inset, Trigger).
- artifacts: the CodeBlock with Shiki syntax highlighting.
- data: a bar Chart artifact with the categorical color scheme.

feedback (alert, progress, skeleton) and containers (aspect-ratio, resizable, scroll-area, stack) are the simplest primitives and are covered by the green build gate and the structural fidelity audit.

No render issues were found.

## 5. Known cosmetic micro difference (not a fix)

- data/chart: the tooltip surface uses rounded-sm while shadcn uses rounded-lg. This is a one token cosmetic difference, left as is since the project has no strong rounded-lg convention. Align it only if a visual pass wants it.

## 6. Changes made on this branch

- chore(deps): tightened the internal @gremorie/\* peerDependencies from >=0.0.1 to >=0.3.0 across the nine dependent packages, so a consumer cannot pair a new package with an ancient incompatible base. The range still satisfies the installed 0.3.0 (dependency-checks stays green) and allows future bumps at or above 0.3.0.

## 7. Publishing guidance

- Version bump: all packages are at 0.3.0. rx-ai and tokens changed (AI Elements fidelity, theming specificity fix, clay palette rebuilt on the brand). Bump the version before publishing, in lockstep across the React packages.
- Publish order: base first (rx-core, @gremorie/tokens), then dependents (rx-forms, then rx-overlays and rx-display, then rx-navigation, then rx-ai and rx-artifacts and rx-data).
- Consumer setup: install the packages plus @gremorie/tokens, import the tokens CSS (it carries :root[data-theme]), and set data-theme plus the .dark class on the root to activate the six themes (default, claude, chatgpt, gemini, perplexity, mistral).
- peerDeps are now >=0.3.0. If you want stricter pinning, bump them to the published version when you cut the release.

## Verdict

All primitives are correct, well defined and publish ready. No blocking issues. The only code change required for quality was the peerDependencies tightening on this branch; everything else is already faithful and green.
