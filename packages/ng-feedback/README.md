# @gremorie/ng-feedback

Feedback primitives for Angular: Spinner, Alert, Progress, and Skeleton. A
companion to Spartan-ng that fills the gap for the Spinner and wraps the
Spartan brain Progress idiomatically. Part of Gremorie, an AI native design
system.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/ng-feedback @gremorie/ng-core @spartan-ng/brain class-variance-authority
```

Requires Angular 21 (`@angular/core` ^21.2.0). `@spartan-ng/brain` powers the
Progress behavior.

## Styles

These primitives are styled with the Gremorie design tokens, so import the
core theme once in your global `styles.css`:

```css
@import 'tailwindcss';
@import '@gremorie/ng-core/theme.css';
```

## Usage

```ts
import { Component } from '@angular/core';
import {
  Alert,
  AlertTitle,
  AlertDescription,
  Spinner,
} from '@gremorie/ng-feedback';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [Alert, AlertTitle, AlertDescription, Spinner],
  template: `
    <gn-alert variant="default">
      <gn-alert-title>Heads up</gn-alert-title>
      <gn-alert-description>Your changes were saved.</gn-alert-description>
    </gn-alert>

    <gn-spinner size="sm" />
  `,
})
export class ExampleComponent {}
```

## Components

- `Spinner` (selector: `gn-spinner`) with the `SpinnerSize` type.
- `Alert` (selector: `gn-alert`) with `AlertTitle` (`gn-alert-title`) and
  `AlertDescription` (`gn-alert-description`), plus `alertVariants` and the
  `AlertVariant` type.
- `Progress` (selector: `gn-progress`).
- `Skeleton` (selector: `gn-skeleton`).

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
