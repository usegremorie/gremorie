# @gremorie/ng-navigation

Navigation primitives for Angular: Breadcrumb, Menubar, NavigationMenu,
Pagination, Sidebar, and Tabs. Part of Gremorie, an AI native design system.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/ng-navigation @gremorie/ng-core class-variance-authority @spartan-ng/brain
```

Requires Angular 21 (`@angular/core` ^21.2.0). Behavior for Tabs and
NavigationMenu is delegated to `@spartan-ng/brain`; the package shares the
Gremorie tokens through `@gremorie/ng-core`.

## Styles

These primitives are styled with the Gremorie design tokens, so import the
core theme once in your global `styles.css`:

```css
@import 'tailwindcss';
@import '@gremorie/ng-core/theme.css';
```

## Components

- `Breadcrumb` (selector: `gr-breadcrumb`) with `BreadcrumbList`,
  `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`,
  and `BreadcrumbEllipsis`.
- `Menubar` (selector: `gr-menubar`) with its menu/trigger/content/item parts.
- `NavigationMenu` (selector: `gr-navigation-menu`) with list/item/trigger/
  content/link/indicator/viewport parts.
- `Pagination` (selector: `gr-pagination`) with content/item/link/previous/
  next/ellipsis parts.
- `Sidebar` (selector: `gr-sidebar`) — the composable app-shell sidebar with
  20+ parts, wrapped in a `gr-sidebar-provider`.
- `Tabs` (selector: `gr-tabs`) with list/trigger/content parts.

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
