# @gremorie/tokens

Framework-free design tokens for Gremorie. Primitives, semantic tokens, and
themes as plain CSS. The React (`rx-*`) and Angular (`ng-*`) editions both
consume this package, so the token source belongs to no framework.

## Install

```bash
npm i @gremorie/tokens
```

## Usage

Import once at your app entry:

```css
@import 'tailwindcss';
@import '@gremorie/tokens/theme.css';
```

Switch themes with `data-theme` on the root element and dark mode with the
`.dark` class:

```html
<html data-theme="claude" class="dark"></html>
```

## What is inside

- Color primitives: the full Tailwind palette plus a few custom families, each
  a 50..950 OKLCH scale.
- Semantic tokens (shadcn vocabulary): `primary`, `secondary`, `accent`,
  `muted`, `destructive`, `border`, `ring`, `card`, `popover`, `chart-1..5`,
  and the `sidebar-*` family.
- Theme controls: `--radius`, `--font-sans/serif/mono`, the `--shadow-*` set,
  `--spacing`, `--tracking-normal`.
- Themes under `themes/`: Claude, ChatGPT, Gemini, Perplexity, Mistral. The
  default (Gremorie) needs no theme attribute.

## License

MIT.
