# @gremorie/rx-overlays

React overlay primitives for Gremorie, an AI native design system. Dialogs,
popovers, menus, command palettes, and toasts that render above the page.

## Install

```bash
npm i @gremorie/rx-overlays @gremorie/rx-core @gremorie/rx-forms
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

These components rely on React context. In the Next.js App Router, add
`'use client'` to the file that renders them.

```tsx
'use client';

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@gremorie/rx-overlays';
import { Button } from '@gremorie/rx-forms';

export function EditDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
```

## Components

- `Dialog`
- `Sheet`
- `Popover`
- `Tooltip`
- `DropdownMenu`
- `HoverCard`
- `Command`
- `AlertDialog`
- `ContextMenu`
- `Drawer`
- `Sonner` (toast)
- `DatePicker`

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).

Full documentation lives at [gremorie.com](https://gremorie.com).
