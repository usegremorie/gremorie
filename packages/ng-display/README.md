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
    <gn-card class="max-w-sm">
      <gn-card-header>
        <gn-card-title>Welcome</gn-card-title>
      </gn-card-header>
      <gn-card-content>
        <gn-badge variant="secondary">New</gn-badge>
      </gn-card-content>
    </gn-card>
  `,
})
export class ExampleComponent {}
```

## Components

- `Card` (selector: `gn-card`) with `CardHeader` (`gn-card-header`),
  `CardTitle` (`gn-card-title`), `CardDescription` (`gn-card-description`),
  `CardAction` (`gn-card-action`), `CardContent` (`gn-card-content`), and
  `CardFooter` (`gn-card-footer`).
- `Badge` (selector: `gn-badge`) with `badgeVariants` and the `BadgeVariant`
  type.
- `Carousel` (selector: `gn-carousel`) with `CarouselContent`
  (`gn-carousel-content`), `CarouselItem` (`gn-carousel-item`),
  `CarouselPrevious` (`gn-carousel-previous`), and `CarouselNext`
  (`gn-carousel-next`), plus the `CarouselService` and `CarouselOrientation`
  type.

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
