# Contributing to Gremorie

Thanks for the interest. Gremorie is in early bootstrapping, so APIs and structure are still moving.

## Ground rules

1. **Documentation is a release blocker.** A component without full docs (overview, anatomy, install, API, all variants, accessibility, theming, design decisions, changelog) does not ship publicly. It stays in the internal Storybook.
2. **Accessibility is not optional.** axe-core, keyboard navigation, screen reader, reduced motion, WCAG AA contrast — verified per component.
3. **Lib stays lean.** Hashbrown, Vercel AI SDK, NgRx and friends are documented integrations — never `peerDependencies`.
4. **Composition over configuration.** Slots, not 50-prop monsters.

## Naming conventions

- **Packages** are prefixed by edition: `rx-*` for React (`@gremorie/rx-ai`,
  `@gremorie/rx-forms`, …) and `ng-*` for Angular (`@gremorie/ng-ai`,
  `@gremorie/ng-forms`, …). Framework-neutral packages have no edition prefix
  (`@gremorie/tokens`, `@gremorie/contracts`).
- **Angular component/directive selectors use the `gr-` prefix** (`<gr-command>`,
  `<gr-card>`, and attribute directives like `grInputOtp`, `[grFormControl]`).
  `gr` is for **Gr**emorie. We deliberately do **not** use `ng-` — the Angular
  style guide forbids it because Angular reserves the `ng` prefix for its own
  framework APIs. (Historically this prefix was `gn-`, `ng` reversed; it was
  renamed to the clearer `gr-`.)
- **React components** are PascalCase exports (`<ModelSelector>`), no element
  prefix — standard JSX.

## Branch flow

```
feature/* → develop  (production)
```

- `develop` — default branch and production deploy (www.gremorie.com). PRs
  target here; merging deploys production.
- `main` — protected (auth-gated) preview builds.
- `staging` — pre-release validation.

## Quality gates (PR cannot merge without)

- [ ] Lint passes (ESLint v9 flat config)
- [ ] Unit tests pass (Vitest)
- [ ] E2E tests pass (Playwright)
- [ ] Accessibility passes (axe-core)
- [ ] Coverage > 80% on touched code
- [ ] Component docs checklist complete (if touching a component)
- [ ] Semantic tokens only — no hardcoded hex/rgb/oklch and no `--color-*`
      primitives in components; dark mode stays class-based (see below)
- [ ] Changeset added

## Color, tokens & dark mode

Two-tier, class-based.

- **Source of truth**: `@gremorie/tokens` (`packages/tokens/styles/theme.css`).
  Layer 1 primitives (`--color-*` scales) feed Layer 2 semantics
  (`--background`, `--card`, `--primary`, `--input`, `--border`, `--ring`,
  `--muted`, `--accent`, `--destructive`, `--sidebar-*`, `--chart-*`, …). Named
  themes opt in via `data-theme="<name>"` and live in `themes/`.
- **Components consume semantic tokens only** (`bg-card`, `text-foreground`,
  `border-input`, …). Never reference `--color-*` primitives directly, and never
  hardcode hex / rgb / hsl / oklch in `className` or `style`. Inline SVG may use
  `currentColor` or `var(--color-*)`.
- **Dark mode is the `.dark` class**, not `@media (prefers-color-scheme: dark)`.
  Tailwind v4's `dark:` variant is bound to that class with
  `@custom-variant dark (&:where(.dark, .dark *))`, declared once in `theme.css`.
- **Any new Tailwind entry** (anything with `@import "tailwindcss"`) must import
  `@gremorie/tokens/theme.css` so it inherits the class-based `dark:` variant.
  Omitting it lets the OS dark preference fire `dark:*` utilities while the token
  theme stays light — a white surface with dark controls. That exact mismatch
  shipped as a real bug; treat a new Tailwind entry without the tokens import as
  broken.
- **Validate** themes and dark mode via the Storybook Theme/Dark toolbar, not a
  browser dark-mode extension or forced-dark flag — those re-tint the rendered
  page and mask the real CSS.

## Local setup

> Setup commands land during Phase 0 bootstrap. Until then, this section is a placeholder.

## Reporting issues

Open a GitHub Issue with reproduction steps, expected behavior, actual behavior, and environment (Angular version, browser, OS).

## Code of conduct

Be kind. Be precise. Disagree with ideas, not with people. Participation is
governed by our [Code of Conduct](./CODE_OF_CONDUCT.md).
