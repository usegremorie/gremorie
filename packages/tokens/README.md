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

- **One source, many outputs.** The tokens live as W3C DTCG 2025.10 JSON in
  `tokens/` (primitives, semantics, one file per theme, and a Material 3 role
  map). Style Dictionary builds everything below from it.
- **CSS** (`theme.css`, `themes/*.css`): the full Tailwind palette plus a few
  custom families as OKLCH primitives; semantic tokens in the shadcn vocabulary
  (`primary`, `secondary`, `accent`, `muted`, `destructive`, `border`, `ring`,
  `card`, `popover`, the `sidebar-*` family and the chart schemes); theme
  controls (`--radius-base`, `--font-sans/serif/mono`, the `--shadow-*` set,
  `--spacing`, `--tracking-normal`).
- **Themes**: Claude, ChatGPT, Gemini, Perplexity, Mistral and Purple. The
  default (Gremorie) needs no theme attribute.
- **Resolved JSON** (`@gremorie/tokens/tokens.json`) and **TypeScript**
  (`import { themes } from '@gremorie/tokens'`): every theme and mode, each
  colour as sRGB hex and OKLCH, plus radius in px and font stacks.
- **Kotlin** (`@gremorie/tokens/compose/GremorieColorSchemes.kt`): a complete
  Material 3 `ColorScheme` (all 48 roles) per theme and mode for Jetpack
  Compose.
- **Swift** (`@gremorie/tokens/swift/GremorieTokens.swift`): the semantic
  colours per theme and mode for SwiftUI.

Colours wider than sRGB are gamut mapped (CSS Color 4) in every output that
cannot carry OKLCH.

## Material 3 roles

`tokens/platform/m3/roles.json` names, for each `ColorScheme` role, the
semantic token it takes or `derived`. Twelve roles take a semantic token:
`primary`, `onPrimary`, `secondaryContainer` and `onSecondaryContainer` (the
shadcn `secondary` is a low-emphasis tinted fill, so it maps to the container),
`background`, `onBackground`, `surface`, `onSurface`, `surfaceVariant`
(`muted`), `surfaceTint`, `error` and `onError`. The other 36 are derived with
Material Color Utilities from a `SchemeContent` seeded with the theme's
primary, so they are derived from its hue and chroma: among them the M3 `secondary`, the whole
tertiary family (shadcn `accent` is a hover surface with no M3 peer),
`onSurfaceVariant` and `outline`. The derived container roles and the derived
secondary and tertiary accents sit at the Material 3 baseline tones. The
surface ladder (`surfaceDim`, `surfaceBright` and `surfaceContainerLowest` to
`surfaceContainerHighest`) is anchored to the theme background instead: a
neutral palette with the background's hue and chroma, read at the background
tone plus the Material 3 baseline spacing. In light, `surfaceContainerLowest`
is lighter than `surface` and the other containers step darker; in dark,
`surfaceContainerLowest` is darker and the others step lighter. `surface`
stays equal to `--background`.

## Editing tokens

Edit the JSON in `tokens/`, or use the visual editor (`apps/tokens`), then run
`nx build tokens`. `styles/` is generated: never edit it by hand. A test keeps
the generated CSS equal to the 0.8.0 values (`reference/0.8.0/`) unless a change
is listed, with its reason, in `reference/intentional-changes.json`.

## License

MIT.
