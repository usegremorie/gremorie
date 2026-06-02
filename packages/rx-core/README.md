# @gremorie/rx-core

Core React utilities for Gremorie, an AI native design system. Provides the
`cn()` helper for merging Tailwind class names and ships the shared design
token stylesheet used by every other category package.

## Install

```bash
npm i @gremorie/rx-core
```

Requires React 18 or 19 and Tailwind CSS v4 in the host project.

## Styles

Import the pre compiled token stylesheet once, at your app entry. It ships the
design tokens (colors, radius, light and dark themes) as plain CSS variables,
so you do not need to wire Tailwind `@theme` yourself.

```css
@import 'tailwindcss';
@import '@gremorie/rx-core/styles/globals.css';
```

If you already pull in the meta package stylesheet, you can use that single
import instead:

```css
@import '@gremorie/react/styles.css';
```

## Usage

```tsx
import { cn } from '@gremorie/rx-core';

export function Box({
  active,
  className,
}: {
  active?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-md p-4',
        active && 'bg-primary text-primary-foreground',
        className,
      )}
    />
  );
}
```

## What is included

- `cn` (class name merge helper built on clsx and tailwind-merge)
- `@gremorie/rx-core/styles/globals.css` (design token stylesheet)

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).

Full documentation lives at [gremorie.com](https://gremorie.com).
