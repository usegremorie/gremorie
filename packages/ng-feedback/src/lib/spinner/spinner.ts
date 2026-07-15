import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Spinner size variants. Matches the React companion spec.
 */
export type SpinnerSize = 'sm' | 'default' | 'lg';

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: 'size-3',
  default: 'size-4',
  lg: 'size-6',
};

/**
 * Spinner — indeterminate "thinking" indicator.
 *
 * Renders a single rotating SVG (same geometry as lucide `Loader2`) so it
 * lives anywhere a glyph fits — inline next to text, inside a button while
 * a request is in flight, in an empty state. Use `Spinner` when duration
 * is unknown; use `Progress` when you know the percent complete; use
 * `Skeleton` when you need to reserve layout for content shape.
 *
 * Spartan-ng does not ship a Spinner primitive — `ng-feedback` fills the
 * gap. Mirrors the conventions of `@gremorie/rx-feedback`.
 *
 * @example
 * ```html
 * <gr-spinner />
 * <gr-spinner size="sm" />
 * <gr-spinner size="lg" />
 * ```
 */
@Component({
  selector: 'gr-spinner',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="null"
      [attr.height]="null"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      [class]="iconClass()"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  `,
  host: {
    'data-slot': 'spinner',
    role: 'status',
    'aria-live': 'polite',
    'aria-label': 'Loading',
    class: 'inline-flex items-center justify-center text-current',
  },
})
export class Spinner {
  readonly size = input<SpinnerSize>('default');

  protected readonly iconClass = computed(
    () => `animate-spin ${SIZE_CLASSES[this.size()]}`,
  );
}
