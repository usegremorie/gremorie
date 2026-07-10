import { defineContract } from '../../types';

/**
 * ChartTooltip - the floating card the cartesian charts show on hover. React:
 * `ChartTooltipContent` (`@gremorie/rx-data`). Angular: `<chart-tooltip-content>`
 * (`@gremorie/ng-data`). Presentational: it renders the hovered category + one
 * row per series; the charts keep it inside the plot area.
 */
export const chartTooltip = defineContract({
  name: 'chart-tooltip',
  category: 'data',
  status: 'stable',
  anatomy: `
    <chart-tooltip-content>
    ├─ label        (category header; hidden when hideLabel)
    └─ row (per series)
       ├─ indicator (dot / line / dashed swatch; hidden when hideIndicator)
       ├─ label
       └─ value`,
  props: [
    {
      name: 'indicator',
      type: 'ChartTooltipIndicator',
      default: 'dot',
      options: ['dot', 'line', 'dashed'],
      desc: 'Swatch style for each series row.',
    },
    {
      name: 'hideLabel',
      type: 'boolean',
      default: false,
      desc: 'Hide the category header line.',
    },
    {
      name: 'hideIndicator',
      type: 'boolean',
      default: false,
      desc: 'Hide the color swatch on each row.',
    },
  ],
  guidance: {
    summary:
      'The floating hover card for the charts: a category header and one color-coded row per series.',
    whenToUse: [
      'Show the values under the cursor on a bar / line / area chart.',
    ],
    whenNotToUse: [{ text: 'A general-purpose hover popover', use: 'tooltip' }],
    rules: [
      'It is bound to the chart: React passes it to a recharts <Tooltip>; Angular renders it from the chartTooltip directive and keeps it inside the plot area.',
      'indicator picks the swatch; hideLabel/hideIndicator trim the card for categorical / single-series charts.',
    ],
    example: '<ChartTooltipContent indicator="line" />',
  },
  preview: {
    rx: 'layout-display-data-tooltip--workbench',
    ng: 'layout-display-data-tooltip--workbench',
  },
  tag: { rx: 'ChartTooltipContent', ng: 'chart-tooltip-content' },
  example: {
    indicator: 'dot',
    hideLabel: false,
    hideIndicator: false,
  },
  figma: { nodeId: null },
});
