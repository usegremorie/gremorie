# @gremorie/angular

The complete Angular edition of Gremorie, an AI native design system. This meta
package bundles every component category in a single install. The per category
packages stay available for granular installs and for the registry.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/angular
```

Requires Angular 21 (`@angular/core` and `@angular/common` ^21.2.0) and
Tailwind CSS v4 in the host project. The category packages are pulled in as
peer dependencies, so install them alongside if your package manager does not
add them automatically:

```bash
npm i @gremorie/ng-core @gremorie/ng-ai @gremorie/ng-display @gremorie/ng-containers @gremorie/ng-data @gremorie/ng-feedback
```

## Styles

Import the Gremorie token stylesheet once, in your global `styles.css`. It
ships the design tokens (colors, radius, light and dark themes) as plain CSS
variables, so you do not need to wire Tailwind `@theme` yourself.

```css
@import 'tailwindcss';
@import '@gremorie/ng-core/theme.css';
```

## Usage

Every primitive is standalone. Import the ones you use and reference their
selectors in the template.

```ts
import { Component } from '@angular/core';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@gremorie/angular';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [Button, Card, CardHeader, CardTitle, CardContent],
  template: `
    <gr-card class="max-w-sm">
      <gr-card-header>
        <gr-card-title>Welcome</gr-card-title>
      </gr-card-header>
      <gr-card-content>
        <ai-button>Get started</ai-button>
      </gr-card-content>
    </gr-card>
  `,
})
export class ExampleComponent {}
```

## What is included

This package re exports every Angular category:

- `@gremorie/ng-core` (utilities, design tokens, Button)
- `@gremorie/ng-ai` (PromptInput, Message, Reasoning, and more)
- `@gremorie/ng-display` (Card, Badge, Carousel)
- `@gremorie/ng-containers` (ScrollArea)
- `@gremorie/ng-data` (D3 based charts)
- `@gremorie/ng-feedback` (Spinner, Alert, Progress, Skeleton)

Optional add ons (blocks, artifacts) are not bundled here. Install those from
their own packages when you need them.

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
