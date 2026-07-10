import { defineContract } from '../../types';

/**
 * Calendar - an inline month grid for picking dates. React wraps
 * `react-day-picker`; Angular wraps the spartan brain calendar.
 * React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 *
 * Divergence: React supports single/range/multiple modes; the Angular edition
 * is single-date only (see `mode` / `selected`).
 */
export const calendar = defineContract({
  name: 'calendar',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <calendar>
    └─ calendar
       ├─ nav (previous / next month buttons)
       ├─ caption (month + year)
       └─ month grid
          ├─ weekday header row
          └─ day cells (selected / today / outside / disabled)`,
  props: [
    {
      name: 'mode',
      type: "'single' | 'range' | 'multiple'",
      default: 'single',
      options: ['single', 'range', 'multiple'],
      adapts: { ng: 'n/a (single-date only)' },
      desc: 'Selection mode. React only; Angular supports single date.',
    },
    {
      name: 'selected',
      type: 'Date | Date[] | { from: Date; to: Date }',
      adapts: { ng: 'model: date (Date, single)' },
      desc: 'Selected date(s); shape follows mode.',
    },
    {
      name: 'onSelect',
      type: '(value) => void',
      adapts: { ng: 'output: dateChange (Date)' },
      desc: 'Fires when the selection changes.',
    },
    {
      name: 'disabled',
      type: 'Date[] | ((date: Date) => boolean)',
      adapts: {
        rx: 'boolean | Date[] | matcher',
        ng: 'input: disabled + dateDisabled',
      },
      desc: 'Dates to disable (predicate or list).',
    },
    { name: 'min', type: 'Date | string', desc: 'Earliest selectable date.' },
    { name: 'max', type: 'Date | string', desc: 'Latest selectable date.' },
    {
      name: 'weekStartsOn',
      type: 'number',
      adapts: { rx: 'react-day-picker prop' },
      desc: 'First day of the week (0=Sunday … 6=Saturday).',
    },
    {
      name: 'showOutsideDays',
      type: 'boolean',
      default: true,
      adapts: { ng: 'n/a' },
      desc: 'React-only: render leading/trailing days of adjacent months.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the root.',
    },
  ],
  guidance: {
    summary: 'An inline month grid for selecting one or more dates.',
    whenToUse: [
      'Show a persistent, always-visible date picker (e.g. in a sidebar or filter panel).',
    ],
    whenNotToUse: [
      {
        text: 'A compact field that opens the grid on demand',
        use: 'date-picker',
      },
      { text: 'Time-only selection', use: 'input' },
    ],
    rules: [
      'React: pick mode (single/range/multiple); the shape of selected/onSelect follows it.',
      'Angular currently supports single-date selection only.',
    ],
    example: '<calendar mode="single" selected={date} onSelect={setDate} />',
  },
  preview: {
    rx: 'inputs-date-calendar--workbench',
    ng: 'inputs-date-calendar--workbench',
  },
  tag: { rx: 'Calendar', ng: 'gn-calendar' },
  example: {
    disabled: false,
  },
  figma: { nodeId: null },
});
