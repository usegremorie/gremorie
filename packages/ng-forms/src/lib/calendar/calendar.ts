import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import {
  BrnCalendar,
  BrnCalendarCellButton,
  BrnCalendarGrid,
  BrnCalendarHeader,
  BrnCalendarNextButton,
  BrnCalendarPreviousButton,
  BrnCalendarWeek,
  BrnCalendarWeekday,
  injectBrnCalendar,
  injectBrnCalendarI18n,
} from '@spartan-ng/brain/calendar';
import {
  injectDateAdapter,
  provideNativeDateAdapter,
} from '@spartan-ng/brain/date-time';
import { buttonVariants, cn } from '@gremorie/ng-core';

/**
 * Calendar — month grid for picking dates. Mirrors React `Calendar` from
 * `@gremorie/rx-forms`, which is built on `react-day-picker` v10.
 *
 * The Angular edition composes the spartan brain calendar directives
 * (`brnCalendar` + grid / week / weekday / cell-button / nav directives) — the
 * Angular equivalent of react-day-picker. We use the brain because it owns the
 * full grid contract for free: the days matrix (with leading/trailing
 * out-of-month fill), `role="grid"` / `role="gridcell"` semantics, roving
 * focus + full arrow/Home/End/PageUp/PageDown keyboard navigation, selection
 * state, and `min` / `max` / `dateDisabled` constraints. It emits the same
 * per-cell state react-day-picker exposes — surfaced here as
 * `data-selected` / `data-today` / `data-outside` / `data-disabled` host
 * attributes — so the verbatim KDS class strings (which key off those
 * attributes) render identically across editions.
 *
 * Single-date selection (`mode="single"`), matching the React default and the
 * `DatePicker` composition. The native `Date` adapter is provided locally.
 *
 * ## React → Angular mapping
 *
 * - react-day-picker `DayPicker` (`selected` / `onSelect`) = `brnCalendar` on
 *   the root with the `date` two-way model. `min` / `max` / `disabled` map 1:1.
 * - react-day-picker's `classNames` map (per-part token merges) → the verbatim
 *   class strings applied to the corresponding brain parts here. `buttonVariants`
 *   from ng-core styles the nav + day buttons exactly as React's
 *   `buttonVariants({ variant: 'outline' | 'ghost' })`.
 * - react-day-picker's `Chevron` component override = the hand-inlined lucide
 *   `chevron-left` / `chevron-right` SVGs in the nav buttons.
 *
 * @example
 * ```html
 * <gn-calendar [(date)]="selected" />
 * ```
 */
@Component({
  selector: 'gn-calendar',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  hostDirectives: [
    {
      directive: BrnCalendar,
      inputs: [
        'min',
        'max',
        'disabled',
        'date',
        'dateDisabled',
        'weekStartsOn',
      ],
      outputs: ['dateChange'],
    },
  ],
  imports: [
    BrnCalendarHeader,
    BrnCalendarPreviousButton,
    BrnCalendarNextButton,
    BrnCalendarGrid,
    BrnCalendarWeekday,
    BrnCalendarWeek,
    BrnCalendarCellButton,
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'calendar',
    '[class]': 'rootClass()',
  },
  template: `
    <div class="flex flex-col gap-4">
      <div
        brnCalendarHeader
        class="flex h-7 items-center justify-center relative"
      >
        <button
          brnCalendarPreviousButton
          type="button"
          [class]="navButtonClass() + ' absolute left-1'"
          aria-label="Previous month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div class="text-sm font-medium">{{ heading() }}</div>
        <button
          brnCalendarNextButton
          type="button"
          [class]="navButtonClass() + ' absolute right-1'"
          aria-label="Next month"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <table brnCalendarGrid class="w-full border-collapse">
        <thead>
          <tr class="flex">
            <th
              *brnCalendarWeekday="let weekday"
              scope="col"
              class="w-8 text-[0.8rem] font-normal text-muted-foreground"
            >
              {{ formatWeekday(weekday) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr *brnCalendarWeek="let week" class="mt-2 flex w-full">
            @for (date of week; track trackDate(date)) {
              <td
                class="relative size-8 p-0 text-center text-sm focus-within:relative focus-within:z-20"
              >
                <button
                  brnCalendarCellButton
                  [date]="date"
                  [class]="cellButtonClass()"
                >
                  {{ formatDay(date) }}
                </button>
              </td>
            }
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class Calendar {
  private readonly dateAdapter = injectDateAdapter<Date>();
  private readonly i18n = injectBrnCalendarI18n();
  private readonly calendar = injectBrnCalendar<Date>();

  // `min`, `max`, `disabled`, `date`, `dateDisabled`, `weekStartsOn` are exposed
  // on this selector by the `BrnCalendar` host directive and owned by the brain,
  // so a two-way `[(date)]` works transparently.

  /** Extra classes merged via `cn` on the root. Mirrors React `className`. */
  readonly class = input<string>('');

  protected readonly rootClass = computed(() =>
    cn('group/calendar p-3', this.class()),
  );

  /** The visible month/year caption, derived from the brain's focused date. */
  protected readonly heading = computed(() => {
    const focused = this.calendar.focusedDate();
    return this.i18n
      .config()
      .formatHeader(
        this.dateAdapter.getMonth(focused),
        this.dateAdapter.getYear(focused),
      );
  });

  protected readonly navButtonClass = computed(() =>
    cn(
      buttonVariants({ variant: 'outline' }),
      'size-7 bg-transparent p-0 opacity-50 hover:opacity-100',
    ),
  );

  protected readonly cellButtonClass = computed(() =>
    cn(
      buttonVariants({ variant: 'ghost' }),
      'size-8 p-0 font-normal',
      'data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground',
      'data-[today]:bg-accent data-[today]:text-accent-foreground',
      'data-[outside]:text-muted-foreground',
      'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
    ),
  );

  protected formatWeekday(index: number): string {
    return this.i18n.config().formatWeekdayName(index);
  }

  protected formatDay(date: Date): string {
    return String(this.dateAdapter.getDate(date));
  }

  protected trackDate(date: Date): number {
    return this.dateAdapter.getTime(date);
  }
}
