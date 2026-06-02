# @gremorie/react

The complete React edition of Gremorie, an AI native design system. This
meta package bundles every component category in a single install. The per
category packages stay available for granular installs and for the registry.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/react
```

Requires React 18 or 19 and Tailwind CSS v4 in the host project.

## Styles

Import the pre compiled token stylesheet once, at your app entry. It ships the
design tokens (colors, radius, light and dark themes) as plain CSS variables,
so you do not need to wire Tailwind `@theme` yourself.

```css
@import 'tailwindcss';
@import '@gremorie/react/styles.css';
```

## Usage

```tsx
'use client';

import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@gremorie/react';

export function Example() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Get started</Button>
      </CardContent>
    </Card>
  );
}
```

Components that use React context (most overlays, AI primitives) are client
components. In the Next.js App Router, add `'use client'` to the file that
renders them.

## What is included

This package re exports every React category:

- `@gremorie/rx-core` (utilities)
- `@gremorie/rx-forms` (Button, Input, Select, Checkbox, and more)
- `@gremorie/rx-display` (Card, Badge, Table, Carousel, and more)
- `@gremorie/rx-overlays` (Dialog, Popover, Tooltip, Command, and more)
- `@gremorie/rx-feedback` (Alert, Progress, Skeleton)
- `@gremorie/rx-navigation` (Tabs, Sidebar, Breadcrumb, and more)
- `@gremorie/rx-containers` (ScrollArea, Resizable, AspectRatio, Stack)
- `@gremorie/rx-data` (recharts based charts)
- `@gremorie/rx-ai` (PromptInput, Message, Reasoning, and more)

## Optional add ons

Generative UI artifacts are shipped separately so they stay optional:

```bash
npm i @gremorie/rx-artifacts
```

See [@gremorie/rx-artifacts](https://www.npmjs.com/package/@gremorie/rx-artifacts).

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
