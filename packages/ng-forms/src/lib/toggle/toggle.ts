import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { BrnToggle } from '@spartan-ng/brain/toggle';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@gremorie/ng-core';

/**
 * `toggleVariants` — the cva used by both `Toggle` and `ToggleGroupItem`.
 * Copied verbatim from React `toggleVariants` in `@gremorie/rx-forms` so the two
 * editions render identical classes. Exported so `ToggleGroupItem` can reuse it
 * (mirrors the React `toggle-group` importing `toggleVariants` from `toggle`).
 */
export const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none hover:bg-muted hover:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline:
          'border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-9 min-w-9 px-2',
        sm: 'h-8 min-w-8 px-1.5',
        lg: 'h-10 min-w-10 px-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export type ToggleVariant = NonNullable<
  VariantProps<typeof toggleVariants>['variant']
>;
export type ToggleSize = NonNullable<
  VariantProps<typeof toggleVariants>['size']
>;

/**
 * Toggle — single button with on/off state. Angular parity port of React
 * `Toggle` from `@gremorie/rx-forms`, which wraps Radix `Toggle`.
 *
 * A two-state button (`aria-pressed`) for stateful actions outside of form
 * submission — bold/italic in a text editor, view-mode switches, filter chips.
 *
 * The press behavior is delegated to the spartan brain `BrnToggle` directive
 * (the Angular equivalent of Radix Toggle), which owns `data-state`,
 * `aria-pressed`, `data-disabled` and the click-to-toggle wiring. React's
 * `Toggle` exposes a boolean `pressed`/`onPressedChange`; the brain models it as
 * a `state` of `'on' | 'off'`. We expose the React-shaped boolean `pressed`
 * model and bridge it to the brain `state` via a computed in/out.
 *
 * For form-bound boolean values use Checkbox or Switch. Don't use Toggle as
 * navigation — that's Tab or Link. ToggleGroup is the coordinated multi-button
 * equivalent.
 *
 * Parity with React `Toggle`:
 * - `pressed` (boolean model) ↔ React `pressed`/`onPressedChange`
 * - `variant` ('default'|'outline') ↔ React `variant`
 * - `size` ('default'|'sm'|'lg') ↔ React `size`
 * - `disabled` ↔ React `disabled`
 *
 * @example
 * ```html
 * <gn-toggle [(pressed)]="bold" ariaLabel="Toggle bold">B</gn-toggle>
 * ```
 */
@Component({
  selector: 'gn-toggle',
  standalone: true,
  imports: [BrnToggle],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      brnToggle
      data-slot="toggle"
      [state]="state()"
      (stateChange)="onStateChange($event)"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      [class]="toggleClass()"
    >
      <ng-content />
    </button>
  `,
})
export class Toggle {
  /** Visual variant. Mirrors React `variant`. */
  readonly variant = input<ToggleVariant>('default');
  /** Size preset. Mirrors React `size`. */
  readonly size = input<ToggleSize>('default');
  /** Whether the toggle is disabled. Mirrors React `disabled`. */
  readonly disabled = input<boolean>(false);
  /** Accessible label for icon-only toggles. Mirrors React `aria-label`. */
  readonly ariaLabel = input<string>('');
  /** Two-way pressed state. Mirrors React `pressed` / `onPressedChange`. */
  readonly pressed = model<boolean>(false);

  /** Bridges the React-shaped boolean `pressed` to the brain `'on' | 'off'` state. */
  protected readonly state = computed<'on' | 'off'>(() =>
    this.pressed() ? 'on' : 'off',
  );

  protected onStateChange(state: 'on' | 'off'): void {
    this.pressed.set(state === 'on');
  }

  protected readonly toggleClass = computed(() =>
    cn(toggleVariants({ variant: this.variant(), size: this.size() })),
  );
}
