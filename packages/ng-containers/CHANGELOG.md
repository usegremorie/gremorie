# @gremorie/ng-containers

## 0.6.0

### Minor Changes

- ae4db57: Consistent, themed scrollbars across both editions.

  - **`@gremorie/tokens`**: adds a scrollbar baseline (`scrollbar-width: thin` +
    `scrollbar-color` on the `--border` token). Every scroll area in both the React
    and Angular editions inherits a thin, themed bar automatically — no
    per-component wiring — and it re-themes in light and dark.
  - **`@gremorie/ng-containers`**: `ScrollArea` is now a real component,
    `<gr-scroll-area>`, at name, anatomy and behaviour parity with React's
    `<ScrollArea>`. It renders its own overlay scrollbar (the bar floats over the
    content, takes no layout space, fades in on hover) with a draggable thumb and
    click-to-jump on the track.

    **Breaking (surface):** the previous `ng-scrollbar[gremorie]` directive is
    gone — use `<gr-scroll-area class="h-64 w-56 rounded-md border">` instead. The
    `ngx-scrollbar` peer dependency was removed (it has no Angular 21 release and
    never initialised, so the overlay never actually rendered).

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
