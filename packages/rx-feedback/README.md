# @gremorie/rx-feedback

React feedback primitives for Gremorie, an AI native design system. Alerts,
progress bars, and skeletons for communicating status and loading states.

## Install

```bash
npm i @gremorie/rx-feedback @gremorie/rx-core
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
import { Alert, AlertTitle, AlertDescription } from '@gremorie/rx-feedback';

export function SavedNotice() {
  return (
    <Alert>
      <AlertTitle>Saved</AlertTitle>
      <AlertDescription>Your changes have been stored.</AlertDescription>
    </Alert>
  );
}
```

## Components

- `Alert`
- `Progress`
- `Skeleton`

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).

Full documentation lives at [gremorie.com](https://gremorie.com).
