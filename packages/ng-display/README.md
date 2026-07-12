# @gremorie/ng-display

Display primitives for Angular: Card, Badge, and Carousel. A companion to
Spartan-ng that fills the gaps for surfaces and content presentation. Part of
Gremorie, an AI native design system.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/ng-display @gremorie/ng-core class-variance-authority embla-carousel
```

Requires Angular 21 (`@angular/core` ^21.2.0). The Carousel uses
`embla-carousel`, and the package shares the Gremorie tokens through
`@gremorie/ng-core`.

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
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '@gremorie/ng-display';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [Card, CardHeader, CardTitle, CardContent, Badge],
  template: `
    <gr-card class="max-w-sm">
      <gr-card-header>
        <gr-card-title>Welcome</gr-card-title>
      </gr-card-header>
      <gr-card-content>
        <gr-badge variant="secondary">New</gr-badge>
      </gr-card-content>
    </gr-card>
  `,
})
export class ExampleComponent {}
```

## Components

- `Card` (selector: `gr-card`) with `CardHeader` (`gr-card-header`),
  `CardTitle` (`gr-card-title`), `CardDescription` (`gr-card-description`),
  `CardAction` (`gr-card-action`), `CardContent` (`gr-card-content`), and
  `CardFooter` (`gr-card-footer`).
- `Badge` (selector: `gr-badge`) with `badgeVariants` and the `BadgeVariant`
  type.
- `Carousel` (selector: `gr-carousel`) with `CarouselContent`
  (`gr-carousel-content`), `CarouselItem` (`gr-carousel-item`),
  `CarouselPrevious` (`gr-carousel-previous`), and `CarouselNext`
  (`gr-carousel-next`), plus the `CarouselService` and `CarouselOrientation`
  type.

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
