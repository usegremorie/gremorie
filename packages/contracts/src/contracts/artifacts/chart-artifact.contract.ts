import { defineContract } from '../../types';

/**
 * ChartArtifact - the Chart preset of the artifact shell. Embeds any of the 7
 * chart primitives with a chart/table toggle + PNG/CSV downloads.
 * React: `@gremorie/rx-artifacts`. Angular: `@gremorie/ng-artifacts`.
 */
export const chartArtifact = defineContract({
  name: 'chart-artifact',
  category: 'artifacts',
  status: 'stable',
  anatomy: `
    <chart-artifact>
    └─ artifact
       ├─ header
       │  ├─ featured-icon
       │  ├─ heading (title + description)
       │  └─ actions
       │     ├─ view-toggle (chart / table)
       │     ├─ download menu (PNG / CSV)   (>=448px)
       │     └─ more menu                   (collapses <448px)
       └─ content
          ├─ chart view (one of the 7 chart primitives, by type)
          └─ table view (one column per value series)`,
  props: [
    {
      name: 'title',
      type: 'string',
      required: true,
      desc: 'Single-line heading.',
    },
    {
      name: 'description',
      type: 'string',
      desc: 'Optional supporting line (truncates).',
    },
    {
      name: 'data',
      type: 'ChartArtifactDatum[]',
      required: true,
      desc: 'Tabular rows: one object per category / point.',
    },
    {
      name: 'type',
      type: 'ChartArtifactType',
      default: 'bar',
      options: ['bar', 'area', 'line', 'pie', 'radar', 'radial', 'scatter'],
      desc: 'Which chart primitive to embed.',
    },
    {
      name: 'categoryKey',
      type: 'string',
      required: true,
      desc: 'Category / X field.',
    },
    {
      name: 'valueKey',
      type: 'string | ChartArtifactSeries[]',
      required: true,
      desc: 'Value field(s): a string for one series, or a series array for multi-series.',
    },
    {
      name: 'categoryLabel',
      type: 'string',
      desc: 'Header label for the category column.',
    },
    {
      name: 'valueLabel',
      type: 'string',
      desc: 'Label for a single value series.',
    },
    {
      name: 'defaultView',
      type: 'ChartArtifactView',
      default: 'chart',
      options: ['chart', 'table'],
      desc: 'Which view is shown first.',
    },
    {
      name: 'numberFormat',
      type: 'Intl.NumberFormatOptions',
      desc: 'Number formatting for the table, CSV and tooltip.',
    },
    {
      name: 'fileName',
      type: 'string',
      default: 'chart',
      desc: 'Base name for downloads.',
    },
    { name: 'icon', type: 'LucideIcon', desc: 'Featured icon in the header.' },
    {
      name: 'accent',
      type: 'ChartArtifactColor',
      default: 'primary',
      options: ['primary', 'gray', 'success', 'error'],
      desc: 'Featured-icon color.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { ng: 'host class' },
      desc: 'Merged onto the card surface.',
    },
    {
      name: 'onRegenerate',
      type: '() => void',
      adapts: { ng: 'output: regenerate' },
      desc: 'Wired to the Regenerate item.',
    },
    {
      name: 'onSave',
      type: '() => void',
      adapts: { ng: 'output: save' },
      desc: 'Wired to the Save item.',
    },
  ],
  guidance: {
    summary:
      'A chart wrapped as a downloadable, toggleable artifact (chart or table).',
    whenToUse: [
      'Present a model-generated dataset as a chart the user can also read as a table and download.',
    ],
    whenNotToUse: [
      {
        text: 'A plain static chart with no toggle / download / header',
        use: 'bar-chart',
      },
      { text: 'Raw tabular data with no chart', use: 'table' },
    ],
    rules: [
      'type picks the embedded chart; categorical types (bar/pie/radial) with one series color each row from the palette.',
      'valueKey as an array gives multi-series (one table column each).',
    ],
    example:
      '<chart-artifact title="Monthly revenue" type="bar" categoryKey="month" valueKey="revenue" [data]="data" />',
  },
  preview: {
    rx: 'ai-code-chart--workbench',
    ng: 'artifacts-chartartifact--workbench',
  },
  figma: { nodeId: null },
});
