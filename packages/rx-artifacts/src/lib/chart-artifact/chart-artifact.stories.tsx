import type { Meta, StoryObj } from "@storybook/react";

import {
  Artifact,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "../artifact";
import { ChartArtifact, type ChartArtifactDatum } from "./chart-artifact";

/**
 * # ChartArtifact
 *
 * A schema-driven bar chart rendered as a Gremorie **artifact** — the shape an
 * LLM returns and the UI renders live. Composes existing primitives only:
 * the `Artifact` shell, the `rx-data` headless chart, `Table`, `ToggleGroup`,
 * `DropdownMenu` and `Button`.
 *
 * ## Anatomy
 *
 * ```tsx
 * <Artifact>
 *   <ArtifactHeader>
 *     <ArtifactTitle />          // single line, truncates
 *     <ArtifactDescription />    // single line, truncates
 *     <ArtifactActions>
 *       <ToggleGroup>            // chart ⇄ table (segmented)
 *       <DropdownMenu>           // Download → Image (PNG) · Data (CSV)
 *       <DropdownMenu>           // More → Copy · Save · Regenerate
 *     </ArtifactActions>
 *   </ArtifactHeader>
 *   <ArtifactContent>
 *     <ChartView /> | <TableView />   // toggled; bars use the categorical palette
 *   </ArtifactContent>
 * </Artifact>
 * ```
 *
 * - **Categorical colors** — each bar takes the next chart token
 *   (`--chart-1 … --chart-5`, cycling); the table mirrors them with a swatch.
 * - **Chart ⇄ Table** — the segmented toggle swaps the body; both render from
 *   the same `data`.
 * - **Download** — one button, a menu with **Image (PNG)** (rasterized from the
 *   live SVG with resolved styles) and **Data (CSV)**.
 * - **More** — Copy values, Save, Regenerate.
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
    categoryLabel: { control: "text" },
    valueLabel: { control: "text" },
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

/**
 * The raw primitives behind the artifact, for reference. The real component
 * wires the toggle, the download menu and the categorical chart for you.
 */
export const AnatomyParts: Story = {
  args: Default.args,
  render: () => (
    <Artifact>
      <ArtifactHeader>
        <div className="min-w-0 flex-1">
          <ArtifactTitle className="truncate">ArtifactTitle</ArtifactTitle>
          <ArtifactDescription className="truncate">
            ArtifactDescription — one line, truncates
          </ArtifactDescription>
        </div>
        <ArtifactActions>
          <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
            ToggleGroup
          </span>
          <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
            Download ▾
          </span>
          <span className="rounded-md border px-2 py-1 text-xs text-muted-foreground">
            More ⋯
          </span>
        </ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent>
        <div className="grid h-40 place-items-center rounded-md border border-dashed text-sm text-muted-foreground">
          ArtifactContent — ChartView | TableView
        </div>
      </ArtifactContent>
    </Artifact>
  ),
};
