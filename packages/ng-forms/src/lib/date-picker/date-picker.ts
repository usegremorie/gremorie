import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnPopover,
  BrnPopoverContent,
  BrnPopoverTrigger,
} from '@spartan-ng/brain/popover';
import { buttonVariants, cn } from '@gremorie/ng-core';
import { Calendar } from '../calendar/calendar';

/**
 * DatePicker — composite of Popover + Calendar with Gremorie defaults. Angular
 * parity port of React `DatePicker` from `@gremorie/rx-overlays`.
 *
 * Not a single primitive but the canonical composition the registry ships as a
 * ready-to-use wrapper, saving boilerplate. React composes its `Popover` +
 * `Calendar`; the Angular edition composes the spartan brain `BrnPopover`
 * (which owns the portalled, positioned overlay + open/close a11y) with the
 * local `gn-calendar`, and styles the trigger with the ng-core `buttonVariants`
 * (`variant: 'outline'`) exactly as React styles its `Button`.
 *
 * Single-date selection by default. The trigger shows the selected date (ISO
 * `yyyy-mm-dd`, since `date-fns` is not a dependency here) or the placeholder.
 *
 * ## React → Angular mapping
 *
 * - React `value` / `onValueChange` = the `date` two-way model, forwarded to
 *   the inner `gn-calendar`'s `[(date)]`.
 * - React `placeholder` / `disabled` / `className` map 1:1.
 * - React's `format(value, 'PP')` label → an ISO date string (no date-fns dep);
 *   consumers wanting a localized label can project their own trigger text.
 *
 * @example
 * ```html
 * <gn-date-picker [(date)]="due" placeholder="Pick a date" />
 * ```
 */
@Component({
  selector: 'gn-date-picker',
  standalone: true,
  imports: [BrnPopover, BrnPopoverTrigger, BrnPopoverContent, Calendar],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <brn-popover>
      <button
        brnPopoverTrigger
        type="button"
        data-slot="date-picker-trigger"
        [disabled]="disabled()"
        [class]="triggerClass()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="mr-2 size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M8 2v4" />
          <path d="M16 2v4" />
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <path d="M3 10h18" />
        </svg>
        @if (date()) {
          <span>{{ label() }}</span>
        } @else {
          <span>{{ placeholder() }}</span>
        }
      </button>
      <ng-template brnPopoverContent>
        <div
          class="w-auto rounded-md border bg-popover p-0 text-popover-foreground shadow-md"
        >
          <gn-calendar [(date)]="date" />
        </div>
      </ng-template>
    </brn-popover>
  `,
  host: {
    'data-slot': 'date-picker',
  },
})
export class DatePicker {
  /** Selected date. Mirrors React `value` / `onValueChange`. Two-way `[(date)]`. */
  readonly date = model<Date | undefined>(undefined);
  /** Trigger text when nothing is selected. Mirrors React `placeholder`. */
  readonly placeholder = input<string>('Pick a date');
  /** Disable the trigger. Mirrors React `disabled`. */
  readonly disabled = input<boolean>(false);
  /** Extra classes merged via `cn` on the trigger. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly triggerClass = computed(() =>
    cn(
      buttonVariants({ variant: 'outline' }),
      'w-[240px] justify-start text-left font-normal',
      !this.date() && 'text-muted-foreground',
      this.class(),
    ),
  );

  /** ISO `yyyy-mm-dd` label for the selected date. */
  protected readonly label = computed(() => {
    const value = this.date();
    if (!value) {
      return '';
    }
    const yyyy = value.getFullYear();
    const mm = String(value.getMonth() + 1).padStart(2, '0');
    const dd = String(value.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
}
