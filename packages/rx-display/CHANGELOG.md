# @gremorie/rx-display

## 0.10.0

### Minor Changes

- 0a6bae4: MediaRangePlayer: a video player scoped to one clip of a longer source.

  The clip shows as a highlighted band inside a context window (`context`
  seconds on each side, 30 by default). "Play clip" plays the clip and stops at
  its out point; "Play with context" plays the whole window. A ref handle
  (`seek`, `playRange`, `pause`) lets a sibling, such as a word timeline, drive
  playback. `preload` defaults to `'metadata'`; pass `'none'` when a page shows
  many players. The stop is frame-accurate (checked every animation frame while
  playing, not only on `timeupdate`), and a `seek` or `playRange` issued before
  the metadata loads is kept. `controls` adds the native video controls for
  keyboard seeking, volume and fullscreen. Labels, including the video's
  `aria-label`, default to English and can be overridden.

  React only for now (contract status `preview`); the Angular twin is not built
  yet.

- 713e550: WordTimeline: transcript words as a clickable strip for picking a clip's in
  and out points at word boundaries.

  A mode toggle (Seek, Set in, Set out) decides what a word click does: seek
  calls `onSeek` with the word start; set in and set out call `onValueChange`
  with the new `[in, out]`. The range never inverts: setting out on a word
  before the current in moves in to that word, and setting in after the current
  out moves out to that word's end. Words in the range carry
  `data-in-range="true"`, the word under `currentTime` carries
  `data-current="true"`, and a speaker label marks each speaker turn
  (`speakerNames` maps ids to display names). Every word is a `type="button"`,
  safe inside forms. The strip is a single tab stop (roving tabindex) with
  Arrow, Home and End navigation. The clip edges get a border on the outer side
  and every in-clip word has screen-reader text (clip start, in clip, clip end);
  the spoken word has `aria-current`. Words are memoized, so a playhead tick
  re-renders only the words whose state changed, and `followPlayhead` (default
  on) keeps the spoken word visible by scrolling the strip only, never while
  focus is inside it. Labels default to English and can be overridden. The pure helpers (`setBoundary`, `inRange`, `activeIndex`,
  `speakerTurns`) are exported too.

  React only for now (contract status `preview`); the Angular twin is not built
  yet. Pairs with MediaRangePlayer.

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
