# @gremorie/ng-display

## 0.10.0

### Minor Changes

- MediaRangePlayer and WordTimeline, the Angular editions of the React components
  in `@gremorie/rx-display` 0.10.0 (`gr-media-range-player`, `gr-word-timeline`).

  `gr-media-range-player` plays one clip of a longer source inside a context
  window, stops exactly at the out point, and exposes `seek`, `playRange` and
  `pause` as public methods (the React ref handle), so a sibling can drive it
  through a template reference. React `onTimeUpdate` is the `timeUpdate` output.

  `gr-word-timeline` picks clip in/out by clicking transcript words. The range
  never inverts, the strip is one tab stop with arrow-key navigation, and the
  clip state is carried in text and borders, not color alone. `value` pairs with
  the `valueChange` output, so `[(value)]` works; React `onSeek` is the `seek`
  output. Now depends on `@gremorie/ng-forms` (ToggleGroup) as a peer.

  Both are Storybook-only for now: no docs page or registry entry yet.

## 0.9.0

## 0.8.0

## 0.7.0

### Minor Changes

- b6ca882: Badge: add `warning` (amber) and `success` (green) status variants

  The Badge now ships the full trio of status fills — `destructive` (error),
  `warning` (attention) and `success` (ok) — so a state chip (e.g. a 50/30/20
  budget "Ok / Attention / Over" indicator) no longer has to fall back to
  `secondary`/`default`. Both editions get the variants (React
  `@gremorie/rx-display`, Angular `@gremorie/ng-display`); the shared Badge
  contract is updated to match.

  Tokens: adds semantic `--warning` / `--warning-foreground` (amber, bound to the
  `amber-500`/`amber-400` primitives) and rebinds `--success` to the `green-700`
  (light) / `green-400` (dark) primitives so the solid fill clears **WCAG AA
  4.5:1** for small text in both themes — the previous hand-tuned `--success`
  value failed contrast in light mode. `FeaturedIcon`'s `success` variant
  inherits the fix.

## 0.6.0

### Patch Changes

- 9764bf2: Packaging consistency fixes.

  - **@gremorie/angular** now includes the `ng-forms`, `ng-navigation` and
    `ng-overlays` categories (it previously shipped only 6 of 9, so the meta was
    missing forms, Sidebar/Tabs and Dialog/Popover/Command).
  - Fixed a broken `exports` map in `ng-core`, `ng-display`, `ng-feedback`,
    `ng-forms`, `ng-navigation`, `ng-overlays` and `@gremorie/angular`: the
    `import` condition pointed at a non-existent `./fesm2022/<name>.mjs` file
    (ng-packagr emits `gremorie-<name>.mjs`). ng-packagr now generates the correct
    map.
  - `@gremorie/ng-ai`: removed a stray `peerDependenciesMeta` block (`@angular/cdk`
    was never a dependency).
  - Unified internal `@gremorie/*` peer/dependency version floors to `>=0.5.1`.

## 0.5.1

## 0.4.0

### Minor Changes

- rx-ai AI Elements fidelity reimport, theming fixes (named themes in light mode, clay scale on the Claude brand), Fumadocs AI section + Storybook regroup, the component-docs audit, and the tabbed Preview/Code docs surface (ComponentPreview with build-time source extraction) on every component page.

## 0.3.0

## 0.2.0

## 0.1.0

### Minor Changes

- Initial public release of Gremorie — the AI-native design system, React and Angular editions.

  Highlights since the pre-release groundwork:
  - **Angular Carousel** (`@gremorie/ng-display`) — Embla-backed slide region (gn-carousel + content + item + previous + next), mirroring the React `Carousel` (shadcn pattern).
  - **Angular InlineCitation** (`@gremorie/ng-ai`) — footnote citation with a `@spartan-ng/brain` hover-card, `gn-badge` trigger and a `gn-carousel` for multi-source detail. Mirrors the React `InlineCitation`.
  - **React Storybook** for the `rx-*` packages, with stories across every shared AI primitive (Message, Conversation, Reasoning, PromptInput family, Sources, Suggestion, Task, Tool, ChainOfThought, CodeBlock, Toolbar, InlineCitation).
  - Registry items added for `ng-carousel` and `ng-inline-citation` (installable via `gremorie add`).
