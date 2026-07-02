import { defineContract } from '../../types';

/**
 * DatePicker - a compact trigger button that opens a Calendar in a popover to
 * pick a single date.
 *
 * Edition note: only the Angular edition (`@gremorie/ng-forms`) ships a packaged
 * DatePicker component. In React (`@gremorie/rx-forms`) the same pattern is
 * composed by hand from `Popover` + `Calendar`, so every prop below is marked
 * `adapts.rx = 'compose Popover + Calendar'`.
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
      adapts: { rx: 'compose Popover + Calendar', ng: 'model: date (two-way)' },
      desc: 'Selected date.',
    },
    {
      name: 'dateChange',
      type: '(date: Date | undefined) => void',
      adapts: { rx: 'compose Popover + Calendar', ng: 'output: dateChange' },
      desc: 'Fires when the date changes.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: 'Pick a date',
      adapts: { rx: 'compose Popover + Calendar' },
      desc: 'Trigger text when no date is selected.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: false,
      adapts: { rx: 'compose Popover + Calendar' },
      desc: 'Disables the trigger.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { rx: 'compose Popover + Calendar', ng: 'input: class' },
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
      'Angular ships this as a packaged component; in React, compose Popover + Calendar.',
      'Shows the formatted date once selected, the placeholder otherwise.',
    ],
    example: '<date-picker [(date)]="date" placeholder="Pick a date" />',
  },
  preview: {
    ng: 'forms-datepicker--workbench',
  },
  tag: { rx: 'DatePicker', ng: 'gn-date-picker' },
  example: {
    placeholder: 'Pick a date',
    disabled: false,
  },
  figma: { nodeId: null },
});
