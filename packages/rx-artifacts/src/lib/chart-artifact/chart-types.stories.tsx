import type { Meta, StoryObj } from "@storybook/react";
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  RadialChart,
  ScatterChart,
  type ChartConfig,
  type ChartDatum,
} from "@gremorie/rx-data";
import {
  Activity,
  ChartArea,
  ChartColumn,
  ChartLine,
  ChartPie,
  ChartScatter,
  Radar as RadarIcon,
} from "lucide-react";

import {
  Artifact,
  ArtifactActions,
  ArtifactContent,
  ArtifactDescription,
  ArtifactFeaturedIcon,
  ArtifactHeader,
  ArtifactHeading,
  ArtifactMenu,
  ArtifactTitle,
} from "../artifact";
import { Download, Ellipsis } from "lucide-react";

/**
 * # Artifact — every chart type
 *
 * The generic `Artifact` shell wrapping **each chart primitive** from
 * `@gremorie/rx-data`. The shell is content-agnostic: it provides the card
 * (background `--card`), the header (featured icon sized to the title +
 * description block, title, description, actions) and the content slot — and
 * any of the seven chart types drops into `ArtifactContent`.
 *
 * Charts inside an artifact run with the **Y axis disabled** (`yAxis={false}`),
 * the compact look the artifact card is designed for. The standalone chart
 * primitives keep the Y axis on by default.
 */
const meta = {
  title: "Artifacts/Chart types",
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="w-[26rem] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── shared mock data ─────────────────────────────────────────────────────────

const MONTHS: ChartDatum[] = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];
const SERIES: ChartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
};
const SINGLE: ChartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
};

const CATEGORICAL: ChartDatum[] = [
  { dept: "Marketing", rating: 4.37, fill: "var(--chart-1)" },
  { dept: "Product", rating: 4.12, fill: "var(--chart-2)" },
  { dept: "Support", rating: 3.94, fill: "var(--chart-3)" },
  { dept: "Sales", rating: 3.76, fill: "var(--chart-4)" },
  { dept: "Finance", rating: 3.58, fill: "var(--chart-5)" },
];
const RATING: ChartConfig = { rating: { label: "Rating" } };

const BROWSERS: ChartDatum[] = [
  { browser: "Chrome", visitors: 275, fill: "var(--chart-1)" },
  { browser: "Safari", visitors: 200, fill: "var(--chart-2)" },
  { browser: "Firefox", visitors: 187, fill: "var(--chart-3)" },
  { browser: "Edge", visitors: 173, fill: "var(--chart-4)" },
  { browser: "Other", visitors: 90, fill: "var(--chart-5)" },
];
const BROWSER_CFG: ChartConfig = {
  visitors: { label: "Visitors" },
  Chrome: { label: "Chrome" },
  Safari: { label: "Safari" },
  Firefox: { label: "Firefox" },
  Edge: { label: "Edge" },
  Other: { label: "Other" },
};

const SCATTER: ChartDatum[] = [
  { weight: 60, height: 165 },
  { weight: 65, height: 170 },
  { weight: 70, height: 174 },
  { weight: 75, height: 178 },
  { weight: 80, height: 180 },
  { weight: 85, height: 182 },
  { weight: 90, height: 184 },
];
const SCATTER_CFG: ChartConfig = {
  height: { label: "Height (cm)", color: "var(--chart-1)" },
};

// ── shell helper ─────────────────────────────────────────────────────────────

function ChartCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof ChartColumn;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Artifact>
      <ArtifactHeader>
        <ArtifactFeaturedIcon icon={Icon} />
        <ArtifactHeading>
          <ArtifactTitle>{title}</ArtifactTitle>
          <ArtifactDescription>{description}</ArtifactDescription>
        </ArtifactHeading>
        <ArtifactActions>
          <ArtifactMenu
            icon={Download}
            label="Download"
            heading="Download"
            items={[{ label: "Image (PNG)" }, { label: "Data (CSV)" }]}
          />
          <ArtifactMenu
            icon={Ellipsis}
            label="More actions"
            items={[{ label: "Copy values" }, { label: "Save" }]}
          />
        </ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent>{children}</ArtifactContent>
    </Artifact>
  );
}

// ── one story per chart type ─────────────────────────────────────────────────

/** Bar — categorical single series, Y axis off. */
export const Bar: Story = {
  render: () => (
    <ChartCard
      icon={ChartColumn}
      title="Average rating by department"
      description="Q3 review scores across departments."
    >
      <BarChart data={CATEGORICAL} config={RATING} xKey="dept" yAxis={false} />
    </ChartCard>
  ),
};

/** Bar (stacked) — outer corners rounded, segments square, Y axis off. */
export const BarStacked: Story = {
  render: () => (
    <ChartCard
      icon={ChartColumn}
      title="Traffic by device"
      description="Desktop vs. mobile, stacked per month."
    >
      <BarChart data={MONTHS} config={SERIES} xKey="month" stacked yAxis={false} />
    </ChartCard>
  ),
};

/** Area — stacked, Y axis off. */
export const Area: Story = {
  render: () => (
    <ChartCard
      icon={ChartArea}
      title="Visitors over time"
      description="Stacked sessions across the last six months."
    >
      <AreaChart data={MONTHS} config={SERIES} xKey="month" stacked yAxis={false} />
    </ChartCard>
  ),
};

/** Line — multi-series trend, Y axis off. */
export const Line: Story = {
  render: () => (
    <ChartCard
      icon={ChartLine}
      title="Engagement trend"
      description="Desktop vs. mobile, month over month."
    >
      <LineChart data={MONTHS} config={SERIES} xKey="month" yAxis={false} />
    </ChartCard>
  ),
};

/** Pie / donut — share of total. */
export const Pie: Story = {
  render: () => (
    <ChartCard
      icon={ChartPie}
      title="Browser share"
      description="Sessions by browser, last 30 days."
    >
      <PieChart
        data={BROWSERS}
        config={BROWSER_CFG}
        nameKey="browser"
        dataKey="visitors"
        donut
      />
    </ChartCard>
  ),
};

/** Radar — multi-axis profile. */
export const Radar: Story = {
  render: () => (
    <ChartCard
      icon={RadarIcon}
      title="Capability profile"
      description="Desktop vs. mobile across six metrics."
    >
      <RadarChart data={MONTHS} config={SERIES} xKey="month" />
    </ChartCard>
  ),
};

/** Radial — concentric bars. */
export const Radial: Story = {
  render: () => (
    <ChartCard
      icon={Activity}
      title="Browser share (radial)"
      description="Concentric bars, one per browser."
    >
      <RadialChart
        data={BROWSERS}
        config={BROWSER_CFG}
        nameKey="browser"
        dataKey="visitors"
      />
    </ChartCard>
  ),
};

/** Scatter — two numeric axes (keeps both axes; they ARE the chart). */
export const Scatter: Story = {
  render: () => (
    <ChartCard
      icon={ChartScatter}
      title="Height vs. weight"
      description="Correlation across a small sample."
    >
      <ScatterChart data={SCATTER} config={SCATTER_CFG} xKey="weight" />
    </ChartCard>
  ),
};

/** Every type at a glance — the seven charts in identical shells. */
export const AllTypes: Story = {
  name: "All chart types",
  parameters: { layout: "padded" },
  decorators: [(Story) => <Story />],
  render: () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ChartCard icon={ChartColumn} title="Bar" description="Categorical, Y axis off.">
        <BarChart data={CATEGORICAL} config={RATING} xKey="dept" yAxis={false} />
      </ChartCard>
      <ChartCard icon={ChartArea} title="Area" description="Stacked, Y axis off.">
        <AreaChart data={MONTHS} config={SERIES} xKey="month" stacked yAxis={false} />
      </ChartCard>
      <ChartCard icon={ChartLine} title="Line" description="Trend, Y axis off.">
        <LineChart data={MONTHS} config={SERIES} xKey="month" yAxis={false} />
      </ChartCard>
      <ChartCard icon={ChartPie} title="Pie" description="Share of total.">
        <PieChart data={BROWSERS} config={BROWSER_CFG} nameKey="browser" dataKey="visitors" donut />
      </ChartCard>
      <ChartCard icon={RadarIcon} title="Radar" description="Multi-axis profile.">
        <RadarChart data={MONTHS} config={SERIES} xKey="month" />
      </ChartCard>
      <ChartCard icon={Activity} title="Radial" description="Concentric bars.">
        <RadialChart data={BROWSERS} config={BROWSER_CFG} nameKey="browser" dataKey="visitors" />
      </ChartCard>
      <ChartCard icon={ChartScatter} title="Scatter" description="Two numeric axes.">
        <ScatterChart data={SCATTER} config={SCATTER_CFG} xKey="weight" />
      </ChartCard>
    </div>
  ),
};
