# @gremorie/rx-display

React display primitives for Gremorie, an AI native design system. Cards,
badges, tables, and the layout pieces you use to present content.

## Install

```bash
npm i @gremorie/rx-display @gremorie/rx-core @gremorie/rx-forms
```

Requires React 18 or 19 and Tailwind CSS v4 in the host project.

## Styles

Import the pre compiled token stylesheet once, at your app entry. It ships the
design tokens (colors, radius, light and dark themes) as plain CSS variables,
so you do not need to wire Tailwind `@theme` yourself.

```css
@import 'tailwindcss';
@import '@gremorie/react/styles.css';
```

If you prefer a granular import, pull the tokens straight from the core
package:

```css
@import '@gremorie/rx-core/styles/globals.css';
```

## Usage

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '@gremorie/rx-display';

export function PlanCard() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Pro plan</CardTitle>
      </CardHeader>
      <CardContent>
        <Badge>Most popular</Badge>
      </CardContent>
    </Card>
  );
}
```

## Components

- `Accordion`
- `Avatar`
- `Badge`
- `Card`
- `Carousel`
- `Collapsible`
- `FeaturedIcon`
- `Separator`
- `Table`

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).

Full documentation lives at [gremorie.com](https://gremorie.com).
