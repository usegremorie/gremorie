# @gremorie/ng-containers

Container primitives for Angular: a themeable ScrollArea container.
Part of Gremorie, an AI native design system.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/ng-containers @gremorie/ng-core
```

Requires Angular 21 (`@angular/core` ^21.2.0). The ScrollArea is an overlay
scroll container implemented natively with signals and a `ResizeObserver`,
with no external dependency, themed with Gremorie tokens (thin,
rounded, `--border` thumb that fades in on hover).

## Styles

The ScrollArea draws its scrollbar colors from the Gremorie design tokens, so
import the core theme once in your global `styles.css`:

```css
@import 'tailwindcss';
@import '@gremorie/ng-core/theme.css';
```

## Usage

Import `ScrollArea` and use the `<gr-scroll-area>` element directly. Constrain
it with a fixed height/width via the host `class` so its content can overflow.

```ts
import { Component } from '@angular/core';
import { ScrollArea } from '@gremorie/ng-containers';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ScrollArea],
  template: `
    <gr-scroll-area class="h-72 w-64 rounded-md border">
      <div class="p-4">
        <!-- long content -->
      </div>
    </gr-scroll-area>
  `,
})
export class ExampleComponent {}
```

## Components

- `ScrollArea` (selector: `gr-scroll-area`): a relative box wrapping a
  scrollable viewport. Renders its own overlay scrollbar natively (signals +
  `ResizeObserver`), themed with Gremorie tokens (thin, rounded, `--border`
  thumb that fades in on hover).

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
