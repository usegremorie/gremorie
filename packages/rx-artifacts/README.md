# @gremorie/rx-artifacts

Generative UI artifacts for the React edition of Gremorie, an AI native design system. Render model output as live UI: Artifact, CodeBlock, WebPreview, and ChartArtifact.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

This is an optional add on. It is intentionally not bundled in the
`@gremorie/react` meta package, so install it only when you render model output
as live UI.

```bash
npm i @gremorie/rx-artifacts @gremorie/rx-core @gremorie/rx-data @gremorie/rx-display @gremorie/rx-forms @gremorie/rx-overlays
```

Requires React 18 or 19 and Tailwind CSS v4 in the host project. Chart artifacts
embed the rx-data charts, which are powered by recharts, bundled as a
dependency.

## Styles

Import the pre compiled token stylesheet once, at your app entry. It ships the
design tokens (colors, radius, light and dark themes) as plain CSS variables, so
you do not need to wire Tailwind `@theme` yourself.

```css
@import 'tailwindcss';
@import '@gremorie/react/styles.css';
```

## Usage

These primitives rely on React context, so they are client components. In the
Next.js App Router, add `'use client'` to the file that renders them.

```tsx
'use client';

import { ChartArtifact } from '@gremorie/rx-artifacts';

const data = [
  { browser: 'Chrome', visitors: 275 },
  { browser: 'Safari', visitors: 200 },
  { browser: 'Firefox', visitors: 187 },
];

export function Example() {
  return (
    <ChartArtifact
      title="Visitors by browser"
      data={data}
      type="bar"
      categoryKey="browser"
      valueKey="visitors"
    />
  );
}
```

## Components

- `Artifact` (the generic artifact shell, with header, actions, and view toggle)
- `ChartArtifact` (chart preset with a chart and table toggle plus downloads)
- `CodeBlock` (syntax highlighted code, powered by Shiki)
- `WebPreview` (sandboxed live web preview)

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
