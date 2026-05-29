import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  InjectionToken,
  model,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Tool — collapsible card for an AI SDK tool invocation. Mirrors React
 * `Tool`. Owns open/close state shared with `ToolHeader` and `ToolContent`.
 *
 * The host surface mirrors React `Tool` (`not-prose mb-4 w-full
 * rounded-md border`) — not `gn-card`, because the React blueprint uses
 * a tighter border + radius than Card. The header badge dogfoods
 * `gn-badge` from `@gremorie/ng-display`.
 */
export interface ToolHostState {
  isOpen: () => boolean;
  setOpen(open: boolean): void;
  toggle(): void;
}

export const TOOL = new InjectionToken<ToolHostState>('ToolHostState');

@Component({
  selector: 'tool',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'not-prose mb-4 block w-full rounded-md border',
    '[attr.data-state]': 'open() ? "open" : "closed"',
  },
  providers: [{ provide: TOOL, useExisting: forwardRef(() => Tool) }],
})
export class Tool implements ToolHostState {
  readonly open = model<boolean>(false);

  readonly isOpen = () => this.open();

  setOpen(open: boolean): void {
    this.open.set(open);
  }

  toggle(): void {
    this.open.update((v) => !v);
  }
}
