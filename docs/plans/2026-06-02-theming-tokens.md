# Theming and Tokens v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract the CSS token layer into a neutral `@gremorie/tokens` package, remove the legacy `--brand` layer, complete the shadcn/tweakcn token contract, and ship six named themes that React and Angular consume from the same source.

**Architecture:** A framework-free package holds one entry stylesheet (primitives, default semantics, the utility map, the base layer) plus one file per theme under `themes/`. Themes activate via `data-theme` on the root element, dark mode via the existing `.dark` class. Semantic tokens reference color primitives; components read semantics only.

**Tech Stack:** Tailwind CSS v4 (`@theme`, `@theme inline`), OKLCH colors, Nx, npm workspaces, the existing `token-engine` for validation.

---

## Reference: current state (verified)

- Source of truth today: `packages/ng-core/styles/theme.css` (one file).
- Consumers of that file: `packages/rx-core/styles/globals.src.css`,
  `packages/react/styles/gremorie.css`, `packages/docs/src/styles.css`,
  `packages/playground/src/styles.css`, `packages/cli/src/commands/init.ts`
  (injects `@gremorie/ng-core/theme.css`), and the docs content page
  `packages/docs/src/app/pages/docs/primitives/theme.page.ts`.
- `theme.css` structure: `@theme { }` primitives (21 Tailwind families 50..950,
  plus custom `taupe/mauve/olive/mist`, plus `brand`, plus `--radius-*`),
  `:root { }` light semantics, `.dark { }` dark semantics, `@theme inline { }`
  utility map, `@layer base { }` border default.
- `brand` lives at four spots: the `--color-brand-50..950` primitive block, the
  `:root` `--brand*` semantics, the `.dark` `--brand*` semantics, and the
  `@theme inline` `--color-brand*` map.
- Missing tokens for the tweakcn contract: `--font-sans/serif/mono`,
  `--sidebar-*`, `--shadow-*`, `--spacing`, `--tracking-normal`.
- `FeaturedIcon` (`packages/rx-display/src/lib/featured-icon/featured-icon.tsx`)
  is the only `brand` consumer: a `color` variant `brand` with light/solid/
  outline classes, and `defaultVariants.color: 'brand'`.

## File structure

Created:

- `packages/tokens/package.json` (name `@gremorie/tokens`, CSS-only, exports)
- `packages/tokens/project.json` (Nx build that copies `styles/` to dist)
- `packages/tokens/styles/theme.css` (moved and edited from ng-core)
- `packages/tokens/styles/themes/{claude,chatgpt,gemini,perplexity,mistral}.css`
- `packages/tokens/README.md`

Modified:

- `packages/rx-core/styles/globals.src.css` (import path)
- `packages/react/styles/gremorie.css` (import path)
- `packages/docs/src/styles.css`, `packages/playground/src/styles.css`
- `packages/cli/src/commands/init.ts` (inject the new path)
- `packages/docs/src/app/pages/docs/primitives/theme.page.ts` (doc path)
- `packages/ng-core/ng-package.json` (drop the asset), `packages/ng-core/package.json` (drop `./theme.css` export)
- `packages/rx-display/src/lib/featured-icon/featured-icon.tsx` (brand to primary)
- `packages/rx-core/package.json`, `packages/ng-core/package.json` (add `@gremorie/tokens` dep)
- `tsconfig.base.json` (path alias if needed for resolution in docs/playground)

Deleted:

- `packages/ng-core/styles/theme.css` (moved to tokens)

---

## Phase 0: Create the neutral @gremorie/tokens package

### Task 0.1: Scaffold the package (move theme.css unchanged)

**Files:**

- Create: `packages/tokens/package.json`
- Create: `packages/tokens/project.json`
- Create: `packages/tokens/styles/theme.css` (git move from ng-core)
- Create: `packages/tokens/README.md`
- Delete: `packages/ng-core/styles/theme.css`

- [ ] **Step 1: Move the stylesheet preserving history**

```bash
mkdir -p packages/tokens/styles
git mv packages/ng-core/styles/theme.css packages/tokens/styles/theme.css
```

- [ ] **Step 2: Write `packages/tokens/package.json`**

```json
{
  "name": "@gremorie/tokens",
  "version": "0.3.0",
  "description": "Framework-free design tokens for Gremorie: primitives, semantics, and themes as plain CSS. Consumed by the React and Angular editions.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/usegremorie/gremorie.git",
    "directory": "packages/tokens"
  },
  "homepage": "https://gremorie.com",
  "keywords": ["design-tokens", "css", "theme", "tailwind", "gremorie"],
  "type": "module",
  "exports": {
    "./theme.css": "./styles/theme.css",
    "./themes/*": "./styles/themes/*"
  },
  "files": ["styles", "README.md"],
  "publishConfig": { "access": "public" },
  "sideEffects": ["*.css"]
}
```

- [ ] **Step 3: Write `packages/tokens/project.json`**

```json
{
  "name": "tokens",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "packages/tokens/styles",
  "projectType": "library",
  "tags": ["scope:lib", "type:tokens"],
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "outputs": ["{workspaceRoot}/dist/packages/tokens"],
      "options": {
        "command": "node -e \"const fs=require('fs');fs.cpSync('packages/tokens/styles','dist/packages/tokens/styles',{recursive:true});fs.copyFileSync('packages/tokens/package.json','dist/packages/tokens/package.json');fs.copyFileSync('packages/tokens/README.md','dist/packages/tokens/README.md')\""
      }
    },
    "lint": { "executor": "@nx/eslint:lint" }
  }
}
```

- [ ] **Step 4: Write `packages/tokens/README.md`** (no em dashes)

```markdown
# @gremorie/tokens

Framework-free design tokens for Gremorie. Primitives, semantic tokens, and
themes as plain CSS. The React (`rx-*`) and Angular (`ng-*`) editions both
consume this package, so the token source belongs to no framework.

## Install

\`\`\`bash
npm i @gremorie/tokens
\`\`\`

## Usage

Import once at your app entry:

\`\`\`css
@import 'tailwindcss';
@import '@gremorie/tokens/theme.css';
\`\`\`

Switch themes with `data-theme` on the root element and dark mode with the
`.dark` class:

\`\`\`html

<html data-theme="claude" class="dark"></html>
\`\`\`

## License

MIT.
```

- [ ] **Step 5: Add the workspace path alias** in `tsconfig.base.json` `compilerOptions.paths` (so CSS `@import` resolves in dev for docs/playground that use bundler resolution):

```json
"@gremorie/tokens/*": ["./packages/tokens/styles/*"]
```

- [ ] **Step 6: Install so the workspace symlink is created**

Run: `npm install --legacy-peer-deps`
Expected: `node_modules/@gremorie/tokens` symlink exists.

- [ ] **Step 7: Commit**

```bash
git add packages/tokens tsconfig.base.json package-lock.json
git rm --cached packages/ng-core/styles/theme.css 2>/dev/null || true
git commit -m "feat(tokens): scaffold neutral @gremorie/tokens package (moves theme.css)"
```

### Task 0.2: Repoint every consumer at @gremorie/tokens

**Files:**

- Modify: `packages/rx-core/styles/globals.src.css`
- Modify: `packages/react/styles/gremorie.css`
- Modify: `packages/docs/src/styles.css`
- Modify: `packages/playground/src/styles.css`
- Modify: `packages/ng-core/ng-package.json`, `packages/ng-core/package.json`
- Modify: `packages/rx-core/package.json`, `packages/ng-core/package.json` (dep)

- [ ] **Step 1: Swap the import in `rx-core/styles/globals.src.css`**

Replace `@import '../../ng-core/styles/theme.css';` with:

```css
@import '@gremorie/tokens/theme.css';
```

- [ ] **Step 2: Swap the import in `react/styles/gremorie.css`**

Replace `@import '../../ng-core/styles/theme.css';` with the same line as Step 1.

- [ ] **Step 3: Swap in `docs/src/styles.css` and `playground/src/styles.css`**

Replace `@import '../../ng-core/styles/theme.css';` with `@import '@gremorie/tokens/theme.css';` in both.

- [ ] **Step 4: Remove the token asset from ng-core**

In `packages/ng-core/ng-package.json`, delete the `"assets": ["styles/theme.css"]` entry (and the `assets` key if now empty).
In `packages/ng-core/package.json`, delete the `"./theme.css": "./styles/theme.css"` line from `exports`.

- [ ] **Step 5: Declare the dependency**

Add `"@gremorie/tokens": ">=0.3.0"` to `peerDependencies` of `packages/rx-core/package.json` and `packages/ng-core/package.json`.

- [ ] **Step 6: Build the affected projects**

Run: `npx nx run-many -t build -p tokens rx-core ng-core docs --skip-nx-cache`
Expected: all succeed; `dist/packages/rx-core/styles/globals.css` still contains the token `:root` vars.

- [ ] **Step 7: Grep gate**

Run: `grep -rn "ng-core/styles/theme.css\|ng-core/theme.css" packages apps --include=*.css --include=*.ts | grep -v dist`
Expected: only `packages/cli/src/commands/init.ts` remains (handled in Task 0.3) and the docs `theme.page.ts` (Task 0.3).

- [ ] **Step 8: Commit**

```bash
git add packages/rx-core packages/react packages/docs packages/playground packages/ng-core
git commit -m "refactor(tokens): consumers import @gremorie/tokens, ng-core drops theme.css"
```

### Task 0.3: Update the CLI and docs reference

**Files:**

- Modify: `packages/cli/src/commands/init.ts`
- Modify: `packages/docs/src/app/pages/docs/primitives/theme.page.ts`

- [ ] **Step 1: Update the CLI inject line**

In `init.ts`, change `THEME_IMPORT_LINE` to `"@import '@gremorie/tokens/theme.css';"`. Keep the existing `@gremorie/ng-core/theme.css` detection so a project that already had the old line is not double-imported (treat both as "already present").

- [ ] **Step 2: Update the docs snippet** in `theme.page.ts` to show `@import '@gremorie/tokens/theme.css';`.

- [ ] **Step 3: Build and lint cli + docs**

Run: `npx nx run-many -t build lint -p cli docs --skip-nx-cache`
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add packages/cli packages/docs
git commit -m "docs(cli): point install instructions at @gremorie/tokens"
```

---

## Phase 1: Remove brand and complete the token contract

### Task 1.1: Delete the brand layer

**Files:**

- Modify: `packages/tokens/styles/theme.css`

- [ ] **Step 1: Delete the four brand spots**

In `packages/tokens/styles/theme.css` remove:

1. The `--color-brand-50` through `--color-brand-950` block (the violet palette) and its comment.
2. In `:root`, the four lines `--brand`, `--brand-foreground`, `--brand-subtle`, `--brand-muted` and their comment.
3. In `.dark`, the same four `--brand*` lines and their comment.
4. In `@theme inline`, the four lines `--color-brand`, `--color-brand-foreground`, `--color-brand-subtle`, `--color-brand-muted`.

- [ ] **Step 2: Grep gate**

Run: `grep -n "brand" packages/tokens/styles/theme.css`
Expected: no matches.

- [ ] **Step 3: Commit**

```bash
git add packages/tokens/styles/theme.css
git commit -m "refactor(tokens): remove the legacy brand layer"
```

### Task 1.2: Rewire FeaturedIcon to primary

**Files:**

- Modify: `packages/rx-display/src/lib/featured-icon/featured-icon.tsx`
- Modify: any story/usage passing `color="brand"` (grep in Step 3)

- [ ] **Step 1: Rename the variant and swap classes**

In `featured-icon.tsx`:

- In the `color` variants object, rename key `brand` to `primary`.
- Replace the three compound variants:
  - `{ color: 'primary', theme: 'light', class: 'bg-primary/10 text-primary' }`
  - `{ color: 'primary', theme: 'solid', class: 'bg-primary text-primary-foreground' }`
  - `{ color: 'primary', theme: 'outline', class: 'border border-primary/30 text-primary' }`
- In `defaultVariants`, change `color: 'brand'` to `color: 'primary'`.
- Update the doc comment line that lists `brand · gray · success · error` to `primary · gray · success · error`.
- Update `data-color={color ?? 'brand'}` to `?? 'primary'`.

- [ ] **Step 2: Update consumers passing color="brand"**

Run: `grep -rn "color=\"brand\"\|color: 'brand'\|color=.brand." packages apps --include=*.tsx --include=*.ts | grep -i featured`
For each hit (stories, artifact, docs previews), change `brand` to `primary`.

- [ ] **Step 3: Lint and build rx-display + rx-artifacts**

Run: `npx nx run-many -t lint build -p rx-display rx-artifacts --skip-nx-cache`
Expected: success.

- [ ] **Step 4: Commit**

```bash
git add packages/rx-display packages/rx-artifacts apps
git commit -m "refactor(featured-icon): brand color variant becomes primary"
```

### Task 1.3: Add the missing tweakcn tokens (fonts, sidebar, shadow, spacing, tracking)

**Files:**

- Modify: `packages/tokens/styles/theme.css`

- [ ] **Step 1: Add font, spacing, tracking primitives in `@theme`**

After the `--radius-*` block, inside `@theme`, add:

```css
--font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
--font-serif: ui-serif, Georgia, 'Times New Roman', serif;
--font-mono: ui-monospace, 'JetBrains Mono', 'Fira Code', monospace;
--spacing: 0.25rem;
--tracking-normal: 0em;
```

- [ ] **Step 2: Add sidebar + shadow semantics in `:root`** (light)

In `:root`, after `--ring`, add the sidebar set mapped to neutral primitives and the shadow set:

```css
--sidebar: var(--color-gray-50);
--sidebar-foreground: var(--color-gray-950);
--sidebar-primary: var(--color-gray-900);
--sidebar-primary-foreground: var(--color-gray-50);
--sidebar-accent: var(--color-gray-100);
--sidebar-accent-foreground: var(--color-gray-900);
--sidebar-border: var(--color-gray-200);
--sidebar-ring: var(--color-gray-400);

--shadow-2xs: 0 1px 2px 0 oklch(0 0 0 / 0.04);
--shadow-xs: 0 1px 3px 0 oklch(0 0 0 / 0.06);
--shadow-sm:
  0 1px 3px 0 oklch(0 0 0 / 0.08), 0 1px 2px -1px oklch(0 0 0 / 0.08);
--shadow:
  0 4px 6px -1px oklch(0 0 0 / 0.08), 0 2px 4px -2px oklch(0 0 0 / 0.08);
--shadow-md:
  0 6px 10px -2px oklch(0 0 0 / 0.1), 0 2px 6px -2px oklch(0 0 0 / 0.08);
--shadow-lg:
  0 12px 20px -4px oklch(0 0 0 / 0.1), 0 4px 8px -4px oklch(0 0 0 / 0.08);
--shadow-xl:
  0 20px 28px -6px oklch(0 0 0 / 0.12), 0 8px 12px -6px oklch(0 0 0 / 0.1);
--shadow-2xl: 0 28px 56px -12px oklch(0 0 0 / 0.2);
```

- [ ] **Step 3: Add the dark sidebar set in `.dark`**

In `.dark`, after `--ring`, add:

```css
--sidebar: var(--color-gray-900);
--sidebar-foreground: var(--color-gray-50);
--sidebar-primary: var(--color-gray-100);
--sidebar-primary-foreground: var(--color-gray-900);
--sidebar-accent: var(--color-gray-800);
--sidebar-accent-foreground: var(--color-gray-50);
--sidebar-border: oklch(1 0 0 / 10%);
--sidebar-ring: var(--color-gray-500);
```

- [ ] **Step 4: Map the new color tokens in `@theme inline`**

Add to `@theme inline`:

```css
--color-sidebar: var(--sidebar);
--color-sidebar-foreground: var(--sidebar-foreground);
--color-sidebar-primary: var(--sidebar-primary);
--color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
--color-sidebar-accent: var(--sidebar-accent);
--color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
--color-sidebar-border: var(--sidebar-border);
--color-sidebar-ring: var(--sidebar-ring);
```

- [ ] **Step 5: Build to confirm CSS compiles**

Run: `npx nx run-many -t build -p tokens rx-core --skip-nx-cache`
Expected: success; `globals.css` includes `--font-sans`, `--sidebar`, `--shadow-md`.

- [ ] **Step 6: Commit**

```bash
git add packages/tokens/styles/theme.css
git commit -m "feat(tokens): complete the tweakcn contract (fonts, sidebar, shadow, spacing)"
```

---

## Phase 2: Theme mechanism and default

### Task 2.1: Wire the modular themes folder and the default font

**Files:**

- Create: `packages/tokens/styles/themes/` (folder, files added in Phase 3)
- Modify: `packages/tokens/styles/theme.css`

- [ ] **Step 1: Apply the default font on the page**

In `theme.css` `@layer base`, set the body font from the token so the default
(Gremorie/Fumadocs) font is actually applied:

```css
@layer base {
  *,
  ::after,
  ::before,
  ::backdrop,
  ::file-selector-button {
    border-color: var(--border);
  }
  body {
    font-family: var(--font-sans);
    letter-spacing: var(--tracking-normal);
  }
}
```

- [ ] **Step 2: Add the theme imports at the end of `theme.css`**

At the very end of `theme.css`, after the base layer, add (files created in Phase 3):

```css
@import './themes/claude.css';
@import './themes/chatgpt.css';
@import './themes/gemini.css';
@import './themes/perplexity.css';
@import './themes/mistral.css';
```

- [ ] **Step 3: Create placeholder empty theme files so the import resolves**

```bash
mkdir -p packages/tokens/styles/themes
for t in claude chatgpt gemini perplexity mistral; do echo "/* $t theme (filled in Phase 3) */" > "packages/tokens/styles/themes/$t.css"; done
```

- [ ] **Step 4: Build**

Run: `npx nx build tokens --skip-nx-cache && npx nx build rx-core --skip-nx-cache`
Expected: success.

- [ ] **Step 5: Commit**

```bash
git add packages/tokens/styles
git commit -m "feat(tokens): default font wiring and modular theme imports"
```

### Task 2.2: Tune the default to mirror Fumadocs

**Files:**

- Modify: `packages/tokens/styles/theme.css`

- [ ] **Step 1: Confirm the Fumadocs default values**

Read `apps/docs` and `packages/docs` for any `--color-fd-*` overrides and the
font configured in the docs (`next/font` or CSS). Note the resolved default
sans font and the neutral primary the docs use.

- [ ] **Step 2: Set the default `--font-sans` to match the docs font**

If the docs use Inter, the `@theme` default already matches. If they use a
different family (for example Geist), update `--font-sans` to that stack.

- [ ] **Step 3: Confirm neutral semantics already match Fumadocs**

The Fumadocs default is a neutral (zinc/gray) scheme with a near-black primary.
The current `:root`/`.dark` already use `gray-900`/`gray-100` for primary, which
matches. Adjust only if Step 1 found a specific accent.

- [ ] **Step 4: Build and visually confirm in docs**

Run: `npx nx serve docs` and confirm the default render is unchanged in color
and now uses the tokenized font.

- [ ] **Step 5: Commit**

```bash
git add packages/tokens/styles/theme.css
git commit -m "feat(tokens): default theme mirrors the Fumadocs font and neutrals"
```

---

## Phase 3: The five brand themes

Each theme file has the same shape: a light block `[data-theme="X"]` and a dark
block `[data-theme="X"].dark`, redefining the semantic colors (pointing at
primitives), `--radius-base`, the three font tokens, and `--ring`. Use the
canonical template below, swapping the color family per theme.

### Canonical template (reference, do not commit as-is)

```css
[data-theme='THEME'] {
  --primary: var(--color-FAMILY-600);
  --primary-foreground: var(--color-gray-50);
  --accent: var(--color-FAMILY-100);
  --accent-foreground: var(--color-FAMILY-900);
  --ring: var(--color-FAMILY-500);
  --sidebar-primary: var(--color-FAMILY-600);
  --sidebar-primary-foreground: var(--color-gray-50);
  --sidebar-ring: var(--color-FAMILY-500);
  --chart-1: var(--color-FAMILY-500);
  --chart-2: var(--color-FAMILY-300);
  --chart-3: var(--color-FAMILY-700);
  --font-sans: FONT_SANS;
}
[data-theme='THEME'].dark {
  --primary: var(--color-FAMILY-400);
  --primary-foreground: var(--color-gray-950);
  --accent: var(--color-FAMILY-900);
  --accent-foreground: var(--color-FAMILY-50);
  --ring: var(--color-FAMILY-400);
  --sidebar-primary: var(--color-FAMILY-400);
  --sidebar-primary-foreground: var(--color-gray-950);
  --sidebar-ring: var(--color-FAMILY-400);
}
```

Background, foreground, card, muted, border stay neutral (inherited from the
default) so the themes read as accent reskins, not full repaints. Per-brand
radius and font overrides are listed in each task.

### Task 3.1: Mistral (orange)

**Files:** Modify `packages/tokens/styles/themes/mistral.css`

- [ ] **Step 1: Write the theme** using the template with `THEME=mistral`,
      `FAMILY=orange`, `FONT_SANS='Inter', ui-sans-serif, system-ui, sans-serif`,
      `--radius-base: 0.5rem` in the light block (Mistral reads slightly tighter).

- [ ] **Step 2: Build** `npx nx build tokens --skip-nx-cache` (success).

- [ ] **Step 3: Commit** `git add ... && git commit -m "feat(themes): Mistral (orange)"`.

### Task 3.2: Gemini (indigo)

**Files:** Modify `packages/tokens/styles/themes/gemini.css`

- [ ] **Step 1: Write the theme** with `THEME=gemini`, `FAMILY=indigo`,
      `FONT_SANS='Inter', ui-sans-serif, system-ui, sans-serif`,
      `--radius-base: 1rem` (Gemini reads rounder).

- [ ] **Step 2: Build.** **Step 3: Commit** `feat(themes): Gemini (indigo)`.

### Task 3.3: Perplexity (teal)

**Files:** Modify `packages/tokens/styles/themes/perplexity.css`

- [ ] **Step 1: Write the theme** with `THEME=perplexity`, `FAMILY=teal`,
      `FONT_SANS='Inter', ui-sans-serif, system-ui, sans-serif`,
      `--radius-base: 0.375rem` (sober, tighter).

- [ ] **Step 2: Build.** **Step 3: Commit** `feat(themes): Perplexity (teal)`.

### Task 3.4: ChatGPT (emerald, flat)

**Files:** Modify `packages/tokens/styles/themes/chatgpt.css`

- [ ] **Step 1: Write the theme** with `THEME=chatgpt`, `FAMILY=emerald`,
      `FONT_SANS='Inter', ui-sans-serif, system-ui, sans-serif`,
      `--radius-base: 0.75rem`. Flatten shadows by adding to the light block:

```css
--shadow-sm: 0 1px 2px 0 oklch(0 0 0 / 0.05);
--shadow: 0 1px 2px 0 oklch(0 0 0 / 0.05);
--shadow-md: 0 2px 4px 0 oklch(0 0 0 / 0.06);
```

- [ ] **Step 2: Build.** **Step 3: Commit** `feat(themes): ChatGPT (emerald, flat)`.

### Task 3.5: Claude (clay custom scale + serif)

**Files:**

- Modify: `packages/tokens/styles/theme.css` (add the `clay` primitive scale)
- Modify: `packages/tokens/styles/themes/claude.css`

- [ ] **Step 1: Add the `clay` primitive scale in `@theme`**

After the custom families (taupe/mauve/olive/mist), add the clay ramp anchored
on Claude's coral (`#D97757`, approx `oklch(0.68 0.087 47)`). Tune visually
later:

```css
--color-clay-50: oklch(0.97 0.012 50);
--color-clay-100: oklch(0.94 0.022 50);
--color-clay-200: oklch(0.88 0.04 49);
--color-clay-300: oklch(0.81 0.058 48);
--color-clay-400: oklch(0.74 0.075 48);
--color-clay-500: oklch(0.68 0.087 47);
--color-clay-600: oklch(0.61 0.09 46);
--color-clay-700: oklch(0.52 0.08 45);
--color-clay-800: oklch(0.43 0.065 44);
--color-clay-900: oklch(0.36 0.05 43);
--color-clay-950: oklch(0.26 0.035 42);
```

- [ ] **Step 2: Write `claude.css`** with the template, `THEME=claude`,
      `FAMILY=clay`, `--radius-base: 0.5rem`, and the serif display plus warm
      surfaces:

```css
[data-theme='claude'] {
  /* warm cream surfaces */
  --background: oklch(0.98 0.008 85);
  --card: oklch(0.99 0.006 85);
  --popover: oklch(0.99 0.006 85);
  --primary: var(--color-clay-600);
  --primary-foreground: var(--color-gray-50);
  --accent: var(--color-clay-100);
  --accent-foreground: var(--color-clay-900);
  --ring: var(--color-clay-500);
  --sidebar-primary: var(--color-clay-600);
  --chart-1: var(--color-clay-500);
  --chart-2: var(--color-clay-300);
  --chart-3: var(--color-clay-700);
  --radius-base: 0.5rem;
  --font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-serif: 'Tiempos Headline', Georgia, 'Times New Roman', serif;
}
[data-theme='claude'].dark {
  --background: oklch(0.2 0.01 60);
  --card: oklch(0.24 0.012 60);
  --popover: oklch(0.24 0.012 60);
  --primary: var(--color-clay-400);
  --primary-foreground: var(--color-gray-950);
  --accent: var(--color-clay-900);
  --accent-foreground: var(--color-clay-50);
  --ring: var(--color-clay-400);
  --sidebar-primary: var(--color-clay-400);
}
```

- [ ] **Step 3: Build** `npx nx build tokens --skip-nx-cache` (success).

- [ ] **Step 4: Commit** `git add packages/tokens && git commit -m "feat(themes): Claude (clay scale + serif, warm surfaces)"`.

---

## Phase 4: Demo, validation, and gates

### Task 4.1: Theme switcher in Storybook and docs

**Files:**

- Modify: `packages/rx-ai/.storybook/preview.ts` (or the shared Storybook preview) to add a `data-theme` global toolbar.
- Optionally: a small theme picker in the docs landing to demo theming.

- [ ] **Step 1: Add a Storybook global type `theme`** with options
      `default,claude,chatgpt,gemini,perplexity,mistral` and a decorator that
      sets `document.documentElement.dataset.theme` (clearing for `default`).

- [ ] **Step 2: Run Storybook** `npx nx storybook rx-ai` and confirm switching
      the toolbar recolors `Button`, `Card`, `FeaturedIcon`, charts, and changes
      radius and font, with no component edits.

- [ ] **Step 3: Commit** `git add ... && git commit -m "feat(storybook): theme switcher toolbar"`.

### Task 4.2: Token validation test (token-engine)

**Files:**

- Create: `packages/token-engine/src/parsers/css/themes.test.ts`

- [ ] **Step 1: Write a test** that parses `packages/tokens/styles/theme.css`
      and asserts: no token name contains `brand`; every theme block defines
      `--primary` and `--primary-foreground`; `--font-sans` exists. Use the
      existing `parseSemantics`/`parsePrimitives` helpers.

- [ ] **Step 2: Run** `npx nx test token-engine --skip-nx-cache` (PASS).

- [ ] **Step 3: Commit** `git add packages/token-engine && git commit -m "test(tokens): validate themes and the absence of brand"`.

### Task 4.3: Full gates

- [ ] **Step 1: Grep gates**

```bash
grep -rn "\-\-brand\|color-brand\|ng-core/theme.css\|ng-core/styles/theme" packages apps --include=*.css --include=*.ts --include=*.tsx | grep -v dist
```

Expected: no matches (the CLI keeps only the legacy-detection string, which is fine).

- [ ] **Step 2: Lint, format, build, test**

```bash
npx nx run-many -t lint --all --skip-nx-cache
npx nx format:check --all
npx nx run-many -t build --all --skip-nx-cache
npx nx run-many -t test --all --skip-nx-cache
```

Expected: all green.

- [ ] **Step 3: Commit any format fixes, then open the PR**

```bash
git add -A && git commit -m "chore: format and final gates for theming v2" || true
git push -u origin feat/theming-tokens
gh pr create --base develop --head feat/theming-tokens --title "feat: theming v2 (neutral @gremorie/tokens, 6 themes, drop brand)" --body "Implements docs/specs/2026-06-02-theming-tokens-design.md"
```

---

## Self-review notes

- Spec coverage: package extraction (Phase 0), brand removal (1.1, 1.2),
  tweakcn contract completion (1.3), mechanism + default (Phase 2), six themes
  (default in 2.2, five brands in Phase 3), single source for rx/ng (Phase 0),
  verification (Phase 4). All spec sections map to a task.
- Color values are real anchors using existing primitives (orange/indigo/teal/
  emerald already in the palette) plus one derived clay ramp; final hues are
  tuned visually in Task 4.1, which is expected for theme work, not a placeholder.
- Open implementation question from the spec (Fumadocs exact values) is resolved
  in Task 2.2 Step 1 before the default is finalized.
