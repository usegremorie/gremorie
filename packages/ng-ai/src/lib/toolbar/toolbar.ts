import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Toolbar — generic row of small actions for AI message/conversation
 * contexts.
 *
 * Anatomy diff vs rx-ai: the React `Toolbar` wraps `@xyflow/react`
 * `NodeToolbar` and is tied to the workflow-canvas world. AI Elements (the
 * upstream blueprint) actually uses a generic `<div role="toolbar">` outside
 * the canvas, so this Angular port is the generic primitive — three
 * components (Toolbar / ToolbarGroup / ToolbarButton) that compose without
 * @xyflow/angular. Workflow-canvas users compose `<toolbar>` inside an
 * `@xyflow/angular` `<node-toolbar>` wrapper at the app level.
 */
@Component({
  selector: 'toolbar',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'toolbar',
    class: 'flex items-center gap-1 rounded-sm border bg-background p-1.5',
  },
})
export class Toolbar {}
