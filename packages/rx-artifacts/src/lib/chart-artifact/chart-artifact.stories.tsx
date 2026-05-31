import type { Meta, StoryObj } from "@storybook/react";

import { ChartArtifact, type ChartArtifactDatum } from "./chart-artifact";

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
 * It is a thin card composed from existing primitives only — the Artifact
 * shell, the headless chart engine, Table, ToggleGroup, DropdownMenu and
 * Button. It does **not** wrap the styled `BarChart`; it draws the bars from
 * the same headless engine so it can do per-category colors and the tooltip.
 *
 * ## Anatomy
 *
 * - **Header**
 *   - **Title** — single line, truncates.
 *   - **Description** — optional, single line, truncates.
 *   - **Actions**
 *     - **View toggle** — segmented *chart ⇄ table*.
 *     - **Download** — one button → menu: *Image (PNG)* · *Data (CSV)*.
 *     - **More** — *Copy values* · *Save* · *Regenerate*.
 * - **Body** — toggled, both views render from the same `data`:
 *   - **Chart** — vertical bars in the categorical palette
 *     (`--chart-1…5`, cycling), faint horizontal grid, no Y axis, hover
 *     tooltip + cursor band.
 *   - **Table** — category + value, each row prefixed with its color swatch.
 *
 * ## Behavior
 *
 * - **Download → Image** rasterizes the live SVG (styles resolved) to a PNG;
 *   **→ Data** writes the rows as CSV.
 * - Props are JSON-serializable (generative-UI ready) — see the table below.
 */
const meta = {
  title: "Artifacts/Chart",
  component: ChartArtifact,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Single-line heading." },
    description: {
      control: "text",
      description: "One-line supporting text (truncates).",
    },
    categoryKey: {
      control: "text",
      description: "Field for the category (x axis / first column).",
    },
    valueKey: {
      control: "text",
      description: "Numeric field plotted as bar height.",
    },
    categoryLabel: {
      control: "text",
      description: "Table header for the category column.",
    },
    valueLabel: {
      control: "text",
      description: "Table header / tooltip label for the value.",
    },
    defaultView: {
      control: "inline-radio",
      options: ["chart", "table"],
      description: "Which view shows first.",
    },
    fileName: { control: "text", description: "Base name for downloads." },
    numberFormat: {
      control: "object",
      description: "Intl.NumberFormat options for value rendering.",
    },
    data: { control: "object" },
  },
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story) => (
      <div className="w-[26rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ChartArtifact>;

export default meta;
type Story = StoryObj<typeof meta>;

const RATINGS: ChartArtifactDatum[] = [
  { department: "Marketing", rating: 4.37 },
  { department: "Product", rating: 4.12 },
  { department: "Support", rating: 3.94 },
  { department: "Sales", rating: 3.76 },
  { department: "Finance", rating: 3.72 },
  { department: "Ops", rating: 3.58 },
];

const REVENUE: ChartArtifactDatum[] = [
  { channel: "Organic", revenue: 48200 },
  { channel: "Paid social", revenue: 39100 },
  { channel: "Email", revenue: 31500 },
  { channel: "Referral", revenue: 24800 },
  { channel: "Direct", revenue: 19300 },
  { channel: "Affiliate", revenue: 12600 },
];

/**
 * The canonical use case: average review score across six departments. Bars
 * use the categorical palette; the description fits on one line.
 */
export const Default: Story = {
  args: {
    title: "Average rating by department",
    description: "Q3 review scores across six departments.",
    data: RATINGS,
    categoryKey: "department",
    valueKey: "rating",
    valueLabel: "Rating",
    defaultView: "chart",
    fileName: "ratings-by-department",
    numberFormat: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  },
};

/**
 * A currency dataset — shows the categorical palette cycling and value
 * formatting (USD, no decimals) carried into the table and CSV.
 */
export const Currency: Story = {
  args: {
    title: "Revenue by channel",
    description: "Last 30 days across acquisition channels.",
    data: REVENUE,
    categoryKey: "channel",
    valueKey: "revenue",
    valueLabel: "Revenue",
    fileName: "revenue-by-channel",
    numberFormat: {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    },
  },
};

/** Opens on the table view — use the toggle to switch back to the chart. */
export const TableFirst: Story = {
  args: {
    ...Default.args,
    defaultView: "table",
  },
};
