# @gremorie/rx-navigation

React navigation primitives for Gremorie, an AI native design system. Breadcrumb, Menubar, NavigationMenu, Pagination, Sidebar, and Tabs.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/rx-navigation @gremorie/rx-core @gremorie/rx-display @gremorie/rx-feedback @gremorie/rx-forms @gremorie/rx-overlays
```

Requires React 18 or 19 and Tailwind CSS v4 in the host project.

## Styles

Import the pre compiled token stylesheet once, at your app entry. It ships the
design tokens (colors, radius, light and dark themes) as plain CSS variables, so
you do not need to wire Tailwind `@theme` yourself.

```css
@import 'tailwindcss';
@import '@gremorie/react/styles.css';
```

## Usage

```tsx
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@gremorie/rx-navigation';

export function Example() {
  return (
    <Tabs defaultValue="overview" className="max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview panel.</TabsContent>
      <TabsContent value="activity">Activity panel.</TabsContent>
    </Tabs>
  );
}
```

## Components

- `Breadcrumb` (with `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, and more)
- `Menubar`
- `NavigationMenu`
- `Pagination`
- `Sidebar` (collapsible app shell navigation)
- `Tabs` (with `TabsList`, `TabsTrigger`, `TabsContent`)

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
