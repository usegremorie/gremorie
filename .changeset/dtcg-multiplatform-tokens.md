---
'@gremorie/tokens': minor
---

One token source, every platform: `@gremorie/tokens` now builds from W3C DTCG

The tokens moved from hand-written CSS to **W3C DTCG 2025.10 JSON**, compiled by
Style Dictionary. `theme.css` and the theme files keep every value they had in
0.8.0 (a test compares them token by token), so nothing changes for the React and
Angular editions.

The same source now ships for native and JavaScript platforms:

- **`@gremorie/tokens/tokens.json`** and **`import { themes } from '@gremorie/tokens'`**:
  every theme and mode, each colour as sRGB hex and OKLCH, radius and font stacks.
- **`@gremorie/tokens/compose/GremorieColorSchemes.kt`**: a complete Material 3
  `ColorScheme` (all 48 roles) per theme and mode. Twelve roles take a semantic
  token (the shadcn `secondary` fills `secondaryContainer`); the other 36 are
  derived from the theme's primary with Material Color Utilities.
- **`@gremorie/tokens/swift/GremorieTokens.swift`**: the semantic colours for
  SwiftUI.

A seventh theme, **Purple** (`data-theme="purple"`), adapts the Fumadocs Purple
preset, with two foregrounds corrected so every text pair clears WCAG AA. Every
theme and mode is now checked for contrast; the pairs that 0.8.0 already shipped
under AA are listed with their reason in `contrast-deviations.json`.
