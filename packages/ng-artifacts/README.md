# @gremorie/ng-artifacts

Artifact surfaces for Angular: the generic `Artifact` shell plus typed presets
that wrap a piece of styled content (a chart, code, a web preview) as a card with
a header (featured icon · title · description · actions) and a content area.
Ships `ChartArtifact` today, embedding the `@gremorie/ng-data` chart primitives
with a working chart ⇄ table toggle and PNG / CSV downloads. Part of Gremorie, an
AI native design system.

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/ng-artifacts @gremorie/ng-data @gremorie/ng-core @ng-icons/core @ng-icons/lucide
```

Requires Angular 21 (`@angular/core` and `@angular/compiler` ^21.2.0).

## Styles

The artifacts pull their colors from the Gremorie design tokens, so import the
core theme once in your global `styles.css`:

```css
@import 'tailwindcss';
@import '@gremorie/ng-core/theme.css';
```

## Usage

```ts
import { Component } from '@angular/core';
import { ChartArtifact } from '@gremorie/ng-artifacts';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ChartArtifact],
  template: `
    <chart-artifact
      title="Monthly revenue"
      description="Net new revenue per month"
      [data]="data"
      type="bar"
      categoryKey="month"
      valueKey="revenue"
    />
  `,
})
export class ExampleComponent {
  data = [
    { month: 'Jan', revenue: 1860 },
    { month: 'Feb', revenue: 3050 },
    { month: 'Mar', revenue: 2370 },
  ];
}
```

## Components

The generic shell parts:

- `Artifact` (selector: `artifact`).
- `ArtifactHeader`, `ArtifactFeaturedIcon`, `ArtifactHeading`, `ArtifactTitle`,
  `ArtifactDescription`.
- `ArtifactActions`, `ArtifactActionsExpanded`, `ArtifactActionsCollapsed`.
- `ArtifactViewToggle` (segmented control), `ArtifactMenu` (icon dropdown).
- `ArtifactContent`.

The typed presets:

- `ChartArtifact` (selector: `chart-artifact`).

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
