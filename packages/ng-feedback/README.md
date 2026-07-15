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
    <gr-alert variant="default">
      <gr-alert-title>Heads up</gr-alert-title>
      <gr-alert-description>Your changes were saved.</gr-alert-description>
    </gr-alert>

    <gr-spinner size="sm" />
  `,
})
export class ExampleComponent {}
```

## Components

- `Spinner` (selector: `gr-spinner`) with the `SpinnerSize` type.
- `Alert` (selector: `gr-alert`) with `AlertTitle` (`gr-alert-title`) and
  `AlertDescription` (`gr-alert-description`), plus `alertVariants` and the
  `AlertVariant` type.
- `Progress` (selector: `gr-progress`).
- `Skeleton` (selector: `gr-skeleton`).

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
