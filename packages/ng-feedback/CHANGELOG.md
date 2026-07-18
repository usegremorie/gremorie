# @gremorie/ng-feedback

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
