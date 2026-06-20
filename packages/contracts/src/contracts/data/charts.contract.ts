import { defineContract, type ComponentContract } from '../../types';

/**
 * The 7 chart primitives. React: `@gremorie/rx-data` (recharts). Angular:
 * `@gremorie/ng-data` (headless d3 SVG). Same public surface; `className` is the
 * only per-framework delta (React prop vs Angular host class).
 */

const CARTESIAN_ANATOMY = `
  <area|bar|line|scatter-chart> (role=img, card)
  ├─ grid · x-axis · y-axis (opt: yAxis)
  ├─ series geometry (1 per config key)
  ├─ value labels / dots (opt)
  ├─ tooltip (opt) · legend
  └─ sr-only data table`;

const POLAR_ANATOMY = `
  <pie|radial-chart> (role=img, card)
  ├─ slices | concentric bars (1 per row)
  ├─ slice labels (opt) · tooltip (opt)
  ├─ legend
  └─ sr-only data table`;

const CN = { name: 'className', type: 'string', adapts: { ng: 'host class' }, desc: 'Merged onto the card.' } as const;
const DATA = { name: 'data', type: 'ChartDatum[]', required: true, desc: 'Tabular rows.' } as const;
const CONFIG = { name: 'config', type: 'ChartConfig', required: true, desc: 'label + color per series.' } as const;
const XKEY = { name: 'xKey', type: 'string', required: true, desc: 'Category field.' } as const;
const TOOLTIP = { name: 'tooltip', type: 'boolean', default: true, desc: 'Hover tooltip.' } as const;
const YAXIS = { name: 'yAxis', type: 'boolean', default: true, desc: 'Show the numeric Y axis.' } as const;
const CURVE = {
  name: 'type',
  type: 'CurveType',
  default: 'natural',
  options: ['natural', 'monotone', 'linear', 'step'],
  desc: 'Curve interpolation.',
} as const;

export const areaChart = defineContract({
  name: 'area-chart',
  category: 'data',
  status: 'stable',
  anatomy: CARTESIAN_ANATOMY,
  props: [
    DATA,
    CONFIG,
    XKEY,
    { name: 'stacked', type: 'boolean', default: false, desc: 'Stack the series.' },
    CURVE,
    YAXIS,
    TOOLTIP,
    CN,
  ],
  guidance: {
    summary: 'Filled magnitude over an ordered domain.',
    whenToUse: ['Show a trend whose filled area conveys volume.'],
    whenNotToUse: [
      { text: 'Discrete bucket comparison', use: 'bar-chart' },
      { text: 'Shape over trend with no fill', use: 'line-chart' },
    ],
    example: '<area-chart [data]="data" [config]="config" xKey="month" [stacked]="true" />',
  },
  preview: { rx: 'layout-display-data-area--default', ng: 'charts-areachart--default' },
});

export const barChart = defineContract({
  name: 'bar-chart',
  category: 'data',
  status: 'stable',
  anatomy: CARTESIAN_ANATOMY,
  props: [
    DATA,
    CONFIG,
    XKEY,
    { name: 'stacked', type: 'boolean', default: false, desc: 'Stack the series.' },
    { name: 'horizontal', type: 'boolean', default: false, desc: 'Horizontal bars.' },
    YAXIS,
    { name: 'showLabels', type: 'boolean', default: false, desc: 'Draw a value on each bar.' },
    TOOLTIP,
    { name: 'radius', type: 'number', default: 8, desc: 'Bar corner radius.' },
    CN,
  ],
  guidance: {
    summary: 'Categorical comparison as grouped / stacked bars.',
    whenToUse: ['Compare discrete buckets (revenue by region, errors by service).'],
    whenNotToUse: [
      { text: 'Trend over an ordered domain', use: 'line-chart' },
      { text: 'Raw tabular data', use: 'table' },
    ],
    rules: ['Keep 2-3 series; more and the bars get unreadable.'],
    example: '<bar-chart [data]="data" [config]="config" xKey="month" />',
  },
  preview: { rx: 'layout-display-data-bar--default', ng: 'charts-barchart--default' },
});

export const lineChart = defineContract({
  name: 'line-chart',
  category: 'data',
  status: 'stable',
  anatomy: CARTESIAN_ANATOMY,
  props: [
    DATA,
    CONFIG,
    XKEY,
    CURVE,
    { name: 'dots', type: 'boolean', default: false, desc: 'Show a dot at each point.' },
    YAXIS,
    TOOLTIP,
    CN,
  ],
  guidance: {
    summary: 'Ordered-domain trend where shape matters.',
    whenToUse: ['Show how a metric moves over an ordered domain.'],
    whenNotToUse: [{ text: 'Discrete bucket comparison', use: 'bar-chart' }],
    example: '<line-chart [data]="data" [config]="config" xKey="month" [dots]="true" />',
  },
  preview: { rx: 'layout-display-data-line--default', ng: 'charts-linechart--default' },
});

export const scatterChart = defineContract({
  name: 'scatter-chart',
  category: 'data',
  status: 'stable',
  anatomy: CARTESIAN_ANATOMY,
  props: [DATA, CONFIG, { ...XKEY, desc: 'Numeric X field (linear axis).' }, YAXIS, TOOLTIP, CN],
  guidance: {
    summary: 'Two numeric axes - X plotted against Y.',
    whenToUse: ['Show correlation / distribution across two numeric dimensions.'],
    whenNotToUse: [{ text: 'A categorical X axis', use: 'bar-chart' }],
    example: '<scatter-chart [data]="data" [config]="config" xKey="weight" />',
  },
  preview: { rx: 'layout-display-data-scatter--default', ng: 'charts-scatterchart--default' },
});

export const pieChart = defineContract({
  name: 'pie-chart',
  category: 'data',
  status: 'stable',
  anatomy: POLAR_ANATOMY,
  props: [
    { ...DATA, type: 'ChartDatum[]', desc: 'Rows; each row fill colors a slice.' },
    { name: 'nameKey', type: 'string', required: true, desc: 'Slice label field.' },
    { name: 'dataKey', type: 'string', required: true, desc: 'Numeric value field.' },
    { name: 'config', type: 'ChartConfig', desc: 'Optional label/color map.' },
    { name: 'donut', type: 'boolean', default: false, desc: 'Render as a donut.' },
    { name: 'showLabels', type: 'boolean', default: false, desc: 'Draw slice labels.' },
    TOOLTIP,
    CN,
  ],
  guidance: {
    summary: 'Part-to-whole as pie / donut slices.',
    whenToUse: ['Show a small set of parts summing to a whole.'],
    whenNotToUse: [
      { text: 'Many categories or precise comparison', use: 'bar-chart' },
    ],
    example: '<pie-chart [data]="data" nameKey="browser" dataKey="visitors" [donut]="true" />',
  },
  preview: { rx: 'layout-display-data-pie--default', ng: 'charts-piechart--pie' },
});

export const radarChart = defineContract({
  name: 'radar-chart',
  category: 'data',
  status: 'stable',
  anatomy: `
  <radar-chart> (role=img, card)
  ├─ polar grid (gridType: polygon | circle)
  ├─ angle axis (spokes from xKey)
  ├─ radar polygon (1 per config key)
  ├─ tooltip (opt) · legend
  └─ sr-only data table`,
  props: [
    DATA,
    CONFIG,
    { ...XKEY, desc: 'Spoke (angle) field.' },
    {
      name: 'gridType',
      type: 'GridType',
      default: 'polygon',
      options: ['polygon', 'circle'],
      desc: 'Polar grid shape.',
    },
    TOOLTIP,
    CN,
  ],
  guidance: {
    summary: 'Multivariate comparison across shared spokes.',
    whenToUse: ['Compare a few series across the same set of metrics.'],
    whenNotToUse: [{ text: 'A single metric over time', use: 'line-chart' }],
    example: '<radar-chart [data]="data" [config]="config" xKey="metric" gridType="circle" />',
  },
  preview: { rx: 'layout-display-data-radar--default', ng: 'charts-radarchart--default' },
});

export const radialChart = defineContract({
  name: 'radial-chart',
  category: 'data',
  status: 'stable',
  anatomy: POLAR_ANATOMY,
  props: [
    { ...DATA, desc: 'Rows; each row fill colors a bar.' },
    { name: 'nameKey', type: 'string', required: true, desc: 'Category label field.' },
    { name: 'dataKey', type: 'string', required: true, desc: 'Numeric value field.' },
    { name: 'config', type: 'ChartConfig', desc: 'Optional label/color map.' },
    TOOLTIP,
    CN,
  ],
  guidance: {
    summary: 'Ranked values as concentric radial bars.',
    whenToUse: ['Show a ranking of a handful of categories with a radial flourish.'],
    whenNotToUse: [{ text: 'Precise value comparison', use: 'bar-chart' }],
    example: '<radial-chart [data]="data" nameKey="browser" dataKey="visitors" />',
  },
  preview: { rx: 'layout-display-data-radial--default', ng: 'charts-radialchart--default' },
});

/** All 7 chart contracts. */
export const CHART_CONTRACTS: ComponentContract[] = [
  areaChart,
  barChart,
  lineChart,
  scatterChart,
  pieChart,
  radarChart,
  radialChart,
];
