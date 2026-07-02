import type { Meta, StoryObj } from '@storybook/react';

import {
  ChartArtifact,
  type ChartArtifactDatum,
  type ChartArtifactProps,
} from './chart-artifact';

/**
 * # ChartArtifact
 *
 * A schema-driven bar chart rendered as a Gremorie **artifact** — the shape an
 * LLM emits and the UI renders live. The anatomy below is framework-agnostic:
 * it is the **same in both editions**, only the import / tag syntax differs.
 *
 * - **React** — `@gremorie/rx-artifacts` → `<ChartArtifact … />`
 * - **Angular** — `@gremorie/ng-artifacts` → `<gn-chart-artifact … />` (planned)
 *
 * It is a thin **preset** of the generic `Artifact` shell that **embeds any of
 * the styled chart primitives** (bar, area, line, pie, radar, radial, scatter)
 * from rx-data and a `Table`, toggling between them. Because it embeds the chart
 * primitives, any change to them reflects here.
 *
 * ## Anatomy
 *
 * - **Header**
 *   - **FeaturedIcon** — the badge that anchors the card.
 *   - **Title** — single line, truncates.
 *   - **Description** — optional, single line, truncates.
 *   - **Actions** — *view toggle* (chart ⇄ table, always visible) · *Download*
 *     menu · *More* menu. Actions collapse into a single More menu on a narrow
 *     card (< 448px) and expand on a wide one (container query).
 * - **Body** — toggled, both views from the same `data`:
 *   - **Chart** — the embedded chart for `type` (Y axis off for cartesian).
 *   - **Table** — **wide**: a category column + one column per value series
 *     (so multi-series charts keep every value); a color swatch in the series
 *     header, or per row for categorical single-series.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `title` * | `string` | — | Single-line heading. |
 * | `description` | `string` | — | One-line supporting text (truncates). |
 * | `data` * | `ChartArtifactDatum[]` | — | Rows — one object per category / point. |
 * | `type` | `"bar" \| "area" \| "line" \| "pie" \| "radar" \| "radial" \| "scatter"` | `"bar"` | Which chart primitive to embed. |
 * | `categoryKey` * | `string` | — | Category / X field (1st table column). |
 * | `valueKey` * | `string \| ChartArtifactSeries[]` | — | Value field (single series) or an array of `{ key, label?, color? }` (multi-series). Each becomes a table column. |
 * | `categoryLabel` | `string` | title-cased `categoryKey` | Table header for the category column. |
 * | `valueLabel` | `string` | title-cased `valueKey` | Label for a single value series (ignored for arrays). |
 * | `defaultView` | `"chart" \| "table"` | `"chart"` | Which view shows first. |
 * | `numberFormat` | `Intl.NumberFormatOptions` | — | Value formatting (table + tooltip + CSV). |
 * | `fileName` | `string` | `"chart"` | Base name for downloaded files. |
 * | `className` | `string` | — | Extra classes on the card root. |
 * | `onRegenerate` | `() => void` | — | Wired to the *Regenerate* menu item. |
 * | `onSave` | `() => void` | — | Wired to the *Save* menu item. |
 *
 * \* required. Props are JSON-serializable (generative-UI ready).
 *
 * ## Subcomponents
 *
 * | Component | Package | Role |
 * | --- | --- | --- |
 * | `Artifact`, `ArtifactHeader`, `ArtifactFeaturedIcon`, `ArtifactHeading`, `ArtifactTitle`, `ArtifactDescription`, `ArtifactActions`, `ArtifactViewToggle`, `ArtifactMenu`, `ArtifactContent` | `@gremorie/rx-artifacts` | The generic shell + header / action primitives |
 * | `BarChart`, `AreaChart`, `LineChart`, `PieChart`, `RadarChart`, `RadialChart`, `ScatterChart` | `@gremorie/rx-data` | The **embedded** styled chart, picked by `type` |
 * | `FeaturedIcon` | `@gremorie/rx-display` | Header badge |
 * | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` | `@gremorie/rx-display` | Table view |
 * | `ChartColumn`, `Table`, `Download`, `Ellipsis`, `ImageDown`, `Sheet`, `Copy`, `Bookmark`, `RefreshCw` | `lucide-react` | Icons |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--chart-1` … `--chart-5` | Bar colors, table swatches, tooltip dot (categorical, cycling) |
 * | `--border` | Card border, header divider, tooltip border |
 * | `--input` | Toggle (outline) border |
 * | `--background` | Card surface, tooltip background |
 * | `--foreground` | Title, value text |
 * | `--muted-foreground` | Description, axis labels, grid lines, table header |
 * | `--accent` / `--accent-foreground` | Toggle hover / active state |
 * | `--ring` | Keyboard focus rings |
 *
 * ## Behavior
 *
 * **Download → Image** rasterizes the live SVG (styles resolved) to a PNG;
 * **→ Data** writes the rows as CSV.
 */
const meta = {
  title: 'AI/Code/Chart',
  component: ChartArtifact,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text', description: 'Single-line heading.' },
    description: {
      control: 'text',
      description: 'One-line supporting text (truncates).',
    },
    data: { control: 'object', description: 'Rows — one object per category.' },
    categoryKey: {
      control: 'text',
      description: 'Field for the category (x axis / first column).',
    },
    valueKey: {
      control: 'text',
      description: 'Numeric field plotted as bar height.',
    },
    categoryLabel: {
      control: 'text',
      description: 'Table header for the category column.',
    },
    valueLabel: {
      control: 'text',
      description: 'Table header / tooltip label for the value.',
    },
    defaultView: {
      control: 'inline-radio',
      options: ['chart', 'table'],
      description: 'Which view shows first.',
    },
    fileName: { control: 'text', description: 'Base name for downloads.' },
    numberFormat: {
      control: 'object',
      description: 'Intl.NumberFormat options for value rendering.',
    },
    className: { control: false, description: 'Extra classes on the card.' },
    onRegenerate: { action: 'regenerate', description: 'More → Regenerate.' },
    onSave: { action: 'save', description: 'More → Save.' },
  },
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChartArtifact>;

export default meta;
type Story = StoryObj<typeof meta>;

const RATINGS: ChartArtifactDatum[] = [
  { department: 'Marketing', rating: 4.37 },
  { department: 'Product', rating: 4.12 },
  { department: 'Support', rating: 3.94 },
  { department: 'Sales', rating: 3.76 },
  { department: 'Finance', rating: 3.72 },
  { department: 'Ops', rating: 3.58 },
];

const REVENUE: ChartArtifactDatum[] = [
  { channel: 'Organic', revenue: 48200 },
  { channel: 'Paid social', revenue: 39100 },
  { channel: 'Email', revenue: 31500 },
  { channel: 'Referral', revenue: 24800 },
  { channel: 'Direct', revenue: 19300 },
  { channel: 'Affiliate', revenue: 12600 },
];

/**
 * The canonical use case: average review score across six departments. Bars
 * use the categorical palette; the description fits on one line.
 */
export const Default: Story = {
  args: {
    title: 'Average rating by department',
    description: 'Q3 review scores across six departments.',
    data: RATINGS,
    categoryKey: 'department',
    valueKey: 'rating',
    valueLabel: 'Rating',
    defaultView: 'chart',
    fileName: 'ratings-by-department',
    numberFormat: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  },
};

/**
 * Workbench preset: the canonical departments dataset, top-aligned (layout
 * `padded`) at a fixed 26rem width so the dual-framework workbench renders the
 * IDENTICAL use case as the Angular `Workbench` story. Keep both in sync.
 */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: Default.args,
};

/**
 * A currency dataset — shows the categorical palette cycling and value
 * formatting (USD, no decimals) carried into the table and CSV.
 */
export const Currency: Story = {
  args: {
    title: 'Revenue by channel',
    description: 'Last 30 days across acquisition channels.',
    data: REVENUE,
    categoryKey: 'channel',
    valueKey: 'revenue',
    valueLabel: 'Revenue',
    fileName: 'revenue-by-channel',
    numberFormat: {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    },
  },
};

/** Opens on the table view — use the toggle to switch back to the chart. */
export const TableFirst: Story = {
  args: {
    ...Default.args,
    defaultView: 'table',
  },
};

/**
 * Responsive header — the actions adapt to the **card's own width** (container
 * query, not the viewport). The view toggle is always visible; the Download
 * menu shows in the header on a wide card (≥ 448px) and collapses into the
 * single More menu on a narrow one (< 448px). Min card width is 280px.
 */
export const ResponsiveWidths: Story = {
  parameters: { layout: 'padded', controls: { disable: true } },
  decorators: [(Story) => <Story />],
  render: () => (
    <div className="flex flex-col gap-6">
      {[
        { w: '20rem', label: 'Narrow (320px) — actions collapse into More' },
        {
          w: '28rem',
          label: 'Threshold (448px) — Download expands into the header',
        },
        { w: '48rem', label: 'Wide (768px) — AI-chat default' },
      ].map(({ w, label }) => (
        <div key={w}>
          <p className="mb-2 text-muted-foreground text-xs">{label}</p>
          <div style={{ width: w, maxWidth: '100%' }}>
            <ChartArtifact {...(Default.args as ChartArtifactProps)} />
          </div>
        </div>
      ))}
    </div>
  ),
};
