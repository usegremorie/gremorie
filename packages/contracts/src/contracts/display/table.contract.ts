import { defineContract } from '../../types';

/**
 * Table - a styled wrapper around the native `<table>` element. Skin only
 * (rules, hover, padding, typography); no behavior.
 * React: `@gremorie/rx-display` (styled <table> subcomponents).
 * Angular: `@gremorie/ng-display` (`gn-table` host + attribute directives on
 * native thead/tbody/tfoot/tr/th/td/caption to keep table DOM valid).
 */
export const table = defineContract({
  name: 'table',
  category: 'display',
  status: 'stable',
  anatomy: `
    <table> (overflow container + <table data-slot="table">)
    ├─ table-caption (<caption>, rendered below)
    ├─ table-header (<thead>; bottom-bordered rows)
    │  └─ table-row (<tr>) -> table-head (<th> column header)
    ├─ table-body (<tbody>)
    │  └─ table-row (<tr>) -> table-cell (<td>)
    └─ table-footer (<tfoot>; muted, top border)`,
  props: [
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class / directive class' },
      desc: 'Extra classes on any part (each part is a styled native table element; no variants).',
    },
  ],
  guidance: {
    summary:
      'A semantic-markup table skin: rules, hover, padding and typography over native <table>.',
    whenToUse: [
      'Display static or lightly-styled tabular data.',
      'As the rendering layer beneath a richer data pattern.',
    ],
    whenNotToUse: [
      {
        text: 'Sorting, filtering, pagination or row selection are needed',
        use: 'data-table',
      },
      {
        text: 'A chart with a chart/table toggle + downloads',
        use: 'chart-artifact',
      },
    ],
    rules: [
      'Brings no behavior — it is purely the skin over semantic <table> markup.',
      'Angular applies the sub-parts as attribute directives on native elements (thead[gnTableHeader], tr[gnTableRow], td[gnTableCell], ...) to emit valid table DOM.',
      'Selected rows are styled via data-[state=selected] on the row.',
    ],
    example:
      '<table><table-header><table-row><table-head>Invoice</table-head><table-head>Amount</table-head></table-row></table-header><table-body><table-row><table-cell>INV001</table-cell><table-cell>$250</table-cell></table-row></table-body></table>',
  },
  preview: {
    rx: 'layout-display-display-table--default',
    ng: 'display-table--workbench',
  },
  tag: { rx: 'Table', ng: 'gn-table' },
  // No controllable scalar props (className only); nothing to seed.
  example: {},
  figma: { nodeId: null },
});
