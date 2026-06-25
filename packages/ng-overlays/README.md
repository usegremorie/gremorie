# @gremorie/ng-overlays

Overlay primitives for Angular: Dialog, AlertDialog, Sheet, Drawer, Popover,
HoverCard, Tooltip, DropdownMenu, ContextMenu, Command and Sonner. A companion
to Spartan-ng that fills the gaps for layered surfaces. Part of Gremorie, an AI
native design system.

The React reference is [`@gremorie/rx-overlays`](../rx-overlays); this package
is built at parity with it. Behavior is delegated to
[`@spartan-ng/brain`](https://www.spartan.ng/) primitives (CDK overlay based).

Full documentation lives at [gremorie.com](https://gremorie.com).

## Install

```bash
npm i @gremorie/ng-overlays @gremorie/ng-core @spartan-ng/brain @angular/cdk
```

Requires Angular 21 (`@angular/core` ^21.2.0). The overlays share the Gremorie
tokens through `@gremorie/ng-core`.

## Styles

These primitives are styled with the Gremorie design tokens, so import the
core theme once in your global `styles.css`:

```css
@import 'tailwindcss';
@import '@gremorie/ng-core/theme.css';
```

## Usage

Brain overlays render their content from a `<ng-template>` referenced by the
trigger — the documented divergence from Radix's portal model. For Dialog:

```ts
import { Component } from '@angular/core';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@gremorie/ng-overlays';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
  ],
  template: `
    <gn-dialog #dialog>
      <button [gnDialogTriggerFor]="dialog">Open</button>
      <ng-template gnDialogContent>
        <gn-dialog-content>
          <gn-dialog-header>
            <gn-dialog-title>Edit profile</gn-dialog-title>
            <gn-dialog-description>Make changes here.</gn-dialog-description>
          </gn-dialog-header>
        </gn-dialog-content>
      </ng-template>
    </gn-dialog>
  `,
})
export class ExampleComponent {}
```

## Components

- `Dialog` / `AlertDialog` / `Sheet` / `Drawer` — modal surfaces on the brain
  dialog primitive (Drawer is a bottom-anchored Sheet variant since there is no
  Angular `vaul`).
- `Popover` / `HoverCard` / `Tooltip` — anchored overlays.
- `DropdownMenu` / `ContextMenu` — action menus built on the brain popover
  (brain ships no menu primitive).
- `Command` — keyboard-first palette on the brain command primitive.
- `Sonner` (`Toaster` + `toast`) — transient toasts on the brain sonner
  primitive.

## License

MIT. See [LICENSE](https://github.com/usegremorie/gremorie/blob/main/LICENSE).
