import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * PromptInputBody — wraps the textarea row inside the composer.
 *
 * Mirrors React `PromptInputBody`, which renders with `display: contents` so the
 * textarea participates directly in the `PromptInput` flex column. The Header and
 * Footer are SIBLINGS of the Body, never nested inside it — nesting them inside a
 * `contents` element re-introduces the thin-bar render bug documented in
 * `docs/anatomy/assistant.md`.
 */
@Component({
  selector: 'prompt-input-body',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    'data-slot': 'prompt-input-body',
    class: 'contents',
  },
})
export class PromptInputBody {}
