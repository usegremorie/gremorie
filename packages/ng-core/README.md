# @gremorie/ng-core

The Angular core of Gremorie, an AI native design system. It ships the shared
utilities, the design token stylesheet, and the Button primitive that every
other Gremorie Angular package builds on.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/ng-core class-variance-authority clsx tailwind-merge
```

Requires Angular 21 (`@angular/core` ^21.2.0) and Tailwind CSS v4 in the host
project.

## Styles

Import the pre compiled token stylesheet once, in your global `styles.css`. It
ships the design tokens (colors, radius, light and dark themes) as plain CSS
variables, so you do not need to wire Tailwind `@theme` yourself.

```css
@import 'tailwindcss';
@import '@gremorie/ng-core/theme.css';
```

Every other `@gremorie/ng-*` package reuses these tokens, so this import is all
you need for the whole system.

## Usage

```ts
import { Component } from '@angular/core';
import { Button } from '@gremorie/ng-core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [Button],
  template: `
    <ai-button variant="default" size="default">Get started</ai-button>
  `,
})
export class ExampleComponent {}
```

The `cn` helper merges class lists (clsx plus tailwind-merge) and is handy when
composing your own components on top of the tokens:

```ts
import { cn } from '@gremorie/ng-core';

const classes = cn('px-4 py-2', condition && 'bg-primary');
```

## Components

- `Button` (selector: `ai-button`): the shared button primitive, with 6 visual
  variants (default, destructive, outline, secondary, ghost, link) and 4 sizes
  (default, sm, lg, icon).
- `cn`: class merge utility built on clsx and tailwind-merge.
- `buttonVariants`: the class-variance-authority recipe behind `ai-button`,
  exported for advanced composition.

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
