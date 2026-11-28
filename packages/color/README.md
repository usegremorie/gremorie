# @gremorie/color

Framework-agnostic logic behind the Gremorie ColorPicker, shared by the React
(`@gremorie/rx-forms`) and Angular (`@gremorie/ng-forms`) editions so both
behave the same.

- OKLCH colour model with alpha (`Color`), read from any CSS colour and printed
  as `oklch`, `hex`, `rgb` or `hsl` (sRGB formats are gamut-mapped).
- Channels (`lightness`, `chroma`, `hue`, `alpha`) with ranges, steps,
  gradients and readable values for assistive technology.
- Keyboard steps for sliders and the 2D area (WAI-ARIA slider pattern).
- Area geometry and painting.
- Saved colours list helpers.

You rarely import it directly: `gremorie add color-picker` lists it as a
dependency of the component.

```ts
import { parseColor, formatColor } from '@gremorie/color';

const c = parseColor('#3366cc');
formatColor(c!, 'oklch'); // "oklch(0.5325 0.1679 262.29)"
```
