import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnResizableGroup,
  BrnResizableHandle,
  BrnResizablePanel,
} from '@spartan-ng/brain/resizable';

/**
 * Resizable — split panes with draggable handles. Mirrors React
 * `Resizable*` from `@gremorie/rx-containers`.
 *
 * Where the React reference is built on `react-resizable-panels`, the
 * Angular port wraps `@spartan-ng/brain`'s headless resizable primitives
 * (`BrnResizableGroup` / `BrnResizablePanel` / `BrnResizableHandle`) via
 * `hostDirectives` — the same brain-as-behavior pattern used by the rest
 * of the Gremorie NG library (e.g. Reasoning over BrnCollapsible). Brain
 * owns the drag math, keyboard a11y, and percentage sizing; these
 * components own the Gremorie visual tokens.
 *
 * Three parts compose, matching the React anatomy 1:1:
 * - `ResizablePanelGroup` — the frame; `direction` sets the axis.
 * - `ResizablePanel` — a region sized by `defaultSize` / `minSize` /
 *   `maxSize` (percentages).
 * - `ResizableHandle` — the drag divider; pass `withHandle` for a grip.
 *
 * @example
 * ```html
 * <gn-resizable-panel-group direction="horizontal" class="h-48 w-96 rounded-lg border">
 *   <gn-resizable-panel [defaultSize]="40" [minSize]="20">…</gn-resizable-panel>
 *   <gn-resizable-handle withHandle />
 *   <gn-resizable-panel [defaultSize]="60">…</gn-resizable-panel>
 * </gn-resizable-panel-group>
 * ```
 */
@Component({
  selector: 'gn-resizable-panel-group',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  // BrnResizableGroup carries `direction`, `layout`, `dragStart`/`dragEnd`
  // etc. through to the host so consumers bind them directly on
  // <gn-resizable-panel-group>, matching react-resizable-panels' Group API.
  hostDirectives: [
    {
      directive: BrnResizableGroup,
      inputs: ['direction', 'layout', 'id'],
      outputs: ['dragStart', 'dragEnd', 'layoutChange', 'layoutChanged'],
    },
  ],
  template: `<ng-content />`,
  host: {
    // brain already sets data-slot="resizable-panel-group" + the
    // data-panel-group-direction attr the aria selectors below key off.
    class:
      'flex h-full w-full aria-[orientation=vertical]:flex-col data-[panel-group-direction=vertical]:flex-col',
  },
})
export class ResizablePanelGroup {}

/**
 * ResizablePanel — a resizable region. Mirrors React `ResizablePanel`.
 * `defaultSize` / `minSize` / `maxSize` are percentages; `collapsible`
 * allows the panel to collapse fully.
 */
@Component({
  selector: 'gn-resizable-panel',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: BrnResizablePanel,
      inputs: ['defaultSize', 'minSize', 'maxSize', 'collapsible', 'id'],
    },
  ],
  template: `<ng-content />`,
  // brain sets data-slot="resizable-panel" + style.flex/overflow on the host.
})
export class ResizablePanel {}

/**
 * ResizableHandle — the drag divider. Mirrors React `ResizableHandle`.
 * Pass `withHandle` for a visible grip affordance.
 *
 * The Tailwind here is a verbatim port of the React reference's classes —
 * brain exposes `aria-orientation` (and `data-panel-group-direction`) on
 * the host, so the `aria-[orientation=horizontal]:*` selectors flip the
 * divider between vertical/horizontal exactly as in React.
 */
@Component({
  selector: 'gn-resizable-handle',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: BrnResizableHandle,
      inputs: ['withHandle', 'disabled'],
    },
  ],
  template: `
    @if (handle.withHandle()) {
      <div
        class="z-10 flex h-4 w-3 items-center justify-center rounded-xs border bg-border"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-2.5"
          aria-hidden="true"
        >
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>
    }
  `,
  host: {
    // brain sets data-slot="resizable-handle"? (it sets role=separator +
    // aria-orientation); add the slot for parity with the React data-slot.
    'data-slot': 'resizable-handle',
    class:
      'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90',
  },
})
export class ResizableHandle {
  /** The host BrnResizableHandle — read back `withHandle` to render the grip. */
  protected readonly handle = inject(BrnResizableHandle, { self: true });
}
