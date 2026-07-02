import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';

/**
 * Label — accessible label primitive. Mirrors React `Label` from
 * `@gremorie/rx-forms`.
 *
 * The React `Label` wraps Radix `Label.Root`, which is itself just a styled
 * native `<label>` that wires `htmlFor` and pointer/keyboard activation to the
 * associated control. Since there is no Angular Radix dependency, this is a
 * direct 1:1 mapping: a styled native `<label>` carrying `data-slot="label"`
 * and the exact React class string. Standard label semantics already provide
 * the focus-on-click behaviour Radix re-implemented.
 *
 * ## React → Angular mapping
 *
 * - React's `htmlFor` (spread from `Label.Root` props) → `for` signal input,
 *   bound to `[attr.for]`.
 * - React's `children` → projected content via `<ng-content/>`.
 * - React's `className` merge → `class` input merged via `cn`.
 *
 * @example
 * ```html
 * <gn-label for="email">Email</gn-label>
 * <gn-input id="email" type="email" />
 * ```
 */
@Component({
  selector: 'gn-label',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label data-slot="label" [class]="labelClass()" [attr.for]="for() || null">
      <ng-content />
    </label>
  `,
})
export class Label {
  /** Associates the label with a control `id`. Mirrors React `htmlFor`. */
  readonly for = input<string>('');
  /** Extra classes merged via `cn`. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly labelClass = computed(() =>
    cn(
      'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
      this.class(),
    ),
  );
}
