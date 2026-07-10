import { defineContract } from '../../types';

/**
 * DatePicker - a compact trigger button that opens a Calendar in a popover to
 * pick a single date.
 *
 * Edition note: both editions ship a packaged DatePicker, but the package
 * placement differs. Angular ships it from `@gremorie/ng-forms`; React ships it
 * from `@gremorie/rx-overlays` (the canonical Popover + Calendar composition),
 * because it composes Popover from rx-overlays with Calendar/Button from
 * rx-forms, and rx-overlays already depends on rx-forms - hosting it in
 * rx-forms would create a circular package dependency.
 */
export const datePicker = defineContract({
  name: 'date-picker',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <date-picker>
    └─ date-picker
       ├─ trigger (button: calendar icon + formatted date / placeholder)
       └─ popover content
          └─ calendar (single-date)`,
  props: [
    {
      name: 'date',
      type: 'Date | undefined',
      adapts: { rx: 'prop: value', ng: 'model: date (two-way)' },
      desc: 'Selected date.',
    },
    {
      name: 'dateChange',
      type: '(date: Date | undefined) => void',
      adapts: { rx: 'prop: onValueChange', ng: 'output: dateChange' },
      desc: 'Fires when the date changes.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: 'Pick a date',
      desc: 'Trigger text when no date is selected.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      desc: 'Disables the trigger.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'input: class' },
      desc: 'Merged onto the trigger.',
    },
  ],
  guidance: {
    summary: 'A compact field that opens a calendar popover to pick one date.',
    whenToUse: [
      'Collect a single date in a form without spending the space of an always-open grid.',
    ],
    whenNotToUse: [
      { text: 'A persistent, always-visible date grid', use: 'calendar' },
      { text: 'Selecting a date range or multiple dates', use: 'calendar' },
    ],
    rules: [
      'Angular imports it from @gremorie/ng-forms; React imports it from @gremorie/rx-overlays.',
      'Shows the formatted date once selected, the placeholder otherwise.',
    ],
    example: '<date-picker [(date)]="date" placeholder="Pick a date" />',
  },
  preview: {
    rx: 'inputs-date-datepicker--workbench',
    ng: 'inputs-date-datepicker--workbench',
  },
  tag: { rx: 'DatePicker', ng: 'gn-date-picker' },
  example: {
    placeholder: 'Pick a date',
    disabled: false,
  },
  figma: { nodeId: null },
});
