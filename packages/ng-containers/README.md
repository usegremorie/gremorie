# @gremorie/ng-containers

Container primitives for Angular: a styled ScrollArea built on `ngx-scrollbar`.
Part of Gremorie, an AI native design system.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/ng-containers @gremorie/ng-core ngx-scrollbar
```

Requires Angular 21 (`@angular/core` ^21.2.0). The ScrollArea is a thin styling
layer over `ngx-scrollbar`.

## Styles

The ScrollArea draws its scrollbar colors from the Gremorie design tokens, so
import the core theme once in your global `styles.css`:

```css
@import 'tailwindcss';
@import '@gremorie/ng-core/theme.css';
```

## Usage

The ScrollArea is a directive on `ngx-scrollbar`. Use the `ScrollAreaImports`
bundle, which exposes both `NgScrollbarModule` and the Gremorie styling
directive in a single import.

```ts
import { Component } from '@angular/core';
import { ScrollAreaImports } from '@gremorie/ng-containers';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ScrollAreaImports],
  template: `
    <ng-scrollbar gremorie class="h-72 w-64 rounded-md border">
      <div class="p-4">
        <!-- long content -->
      </div>
    </ng-scrollbar>
  `,
})
export class ExampleComponent {}
```

## Components

- `ScrollArea` (selector: `ng-scrollbar[gremorie], ng-scrollbar[gremorieScrollbar]`):
  the styling directive applied to an `ngx-scrollbar` host.
- `ScrollAreaImports`: a convenience array bundling `NgScrollbarModule` and the
  `ScrollArea` directive for use in `imports: [...]`.
- `NgScrollbar`, `NgScrollbarModule`: re exported from `ngx-scrollbar`.

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
