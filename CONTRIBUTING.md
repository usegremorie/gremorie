# Contributing to ShadNG

Thanks for the interest. ShadNG is in early bootstrapping, so APIs and structure are still moving.

## Ground rules

1. **Documentation is a release blocker.** A component without full docs (overview, anatomy, install, API, all variants, accessibility, theming, design decisions, changelog) does not ship publicly. It stays in the internal Storybook.
2. **Accessibility is not optional.** axe-core, keyboard navigation, screen reader, reduced motion, WCAG AA contrast — verified per component.
3. **Lib stays lean.** Hashbrown, Vercel AI SDK, NgRx and friends are documented integrations — never `peerDependencies`.
4. **Composition over configuration.** Slots, not 50-prop monsters.

## Branch flow

```
feature/* → develop → staging → main
```

- `develop` — active integration. PRs target here.
- `staging` — pre-release validation. Promoted from `develop` when a phase is ready.
- `main` — released. Tagged versions only.

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

Two-tier, class-based. The full rules live in `AGENTS.md` ("Color, tokens & dark
mode"). The essentials:

- Source of truth: `@gremorie/tokens` (`packages/tokens/styles/theme.css`).
  Components use **semantic tokens only** (`bg-card`, `text-foreground`, …),
  never primitives or hardcoded colors.
- Dark mode is the **`.dark` class**, not `@media (prefers-color-scheme: dark)`.
  The `dark:` Tailwind variant is bound to that class once, in `theme.css`.
- **Any new Tailwind entry** (`@import "tailwindcss"`) must import
  `@gremorie/tokens/theme.css` so it inherits the class-based `dark:` variant.
  Omitting it lets OS dark preference break light surfaces — a shipped bug.

## Local setup

> Setup commands land during Phase 0 bootstrap. Until then, this section is a placeholder.

## Reporting issues

Open a GitHub Issue with reproduction steps, expected behavior, actual behavior, and environment (Angular version, browser, OS).

## Code of conduct

Be kind. Be precise. Disagree with ideas, not with people. Participation is
governed by our [Code of Conduct](./CODE_OF_CONDUCT.md).
