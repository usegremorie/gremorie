# @gremorie/rx-containers

React container and layout primitives for Gremorie, an AI native design system. AspectRatio, Resizable, ScrollArea, and Stack.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/rx-containers @gremorie/rx-core
```

Requires React 18 or 19 and Tailwind CSS v4 in the host project.

## Styles

Import the pre compiled token stylesheet once, at your app entry. It ships the
design tokens (colors, radius, light and dark themes) as plain CSS variables, so
you do not need to wire Tailwind `@theme` yourself.

```css
@import 'tailwindcss';
@import '@gremorie/react/styles.css';
```

## Usage

```tsx
import { Stack, ScrollArea } from '@gremorie/rx-containers';

export function Example() {
  return (
    <Stack gap="md" className="max-w-sm">
      <ScrollArea className="h-40 rounded-md border p-4">
        Long content scrolls inside a styled viewport.
      </ScrollArea>
    </Stack>
  );
}
```

## Components

- `AspectRatio` (constrain content to a fixed ratio)
- `Resizable` (draggable, resizable panel groups)
- `ScrollArea` (with `ScrollBar`)
- `Stack` (vertical and horizontal flex layout with gap tokens)

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
