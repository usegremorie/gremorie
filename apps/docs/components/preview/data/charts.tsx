"use client";

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

const monthlyData: ChartDatum[] = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const monthlyConfig: ChartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
};

// Categorical (pie / radial): one chart token per row via `fill`.
const browserData: ChartDatum[] = [
  { browser: "Chrome", visitors: 275, fill: "var(--chart-1)" },
  { browser: "Safari", visitors: 200, fill: "var(--chart-2)" },
  { browser: "Firefox", visitors: 187, fill: "var(--chart-3)" },
  { browser: "Edge", visitors: 173, fill: "var(--chart-4)" },
  { browser: "Other", visitors: 90, fill: "var(--chart-5)" },
];

const browserConfig: ChartConfig = {
  visitors: { label: "Visitors" },
  Chrome: { label: "Chrome" },
  Safari: { label: "Safari" },
  Firefox: { label: "Firefox" },
  Edge: { label: "Edge" },
  Other: { label: "Other" },
};

const scatterData: ChartDatum[] = [
  { weight: 60, height: 165 },
  { weight: 72, height: 178 },
  { weight: 55, height: 160 },
  { weight: 90, height: 185 },
  { weight: 68, height: 172 },
  { weight: 80, height: 180 },
];

const scatterConfig: ChartConfig = {
  height: { label: "Height (cm)", color: "var(--chart-1)" },
};

// Single-series config (Desktop only) for the "single" preview variants.
const singleConfig: ChartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
};

const scatterMultiData: ChartDatum[] = [
  { weight: 60, height: 165, target: 170 },
  { weight: 72, height: 178, target: 176 },
  { weight: 55, height: 160, target: 168 },
  { weight: 90, height: 185, target: 184 },
  { weight: 68, height: 172, target: 174 },
  { weight: 80, height: 180, target: 181 },
];
const scatterMultiConfig: ChartConfig = {
  height: { label: "Height (cm)", color: "var(--chart-1)" },
  target: { label: "Target (cm)", color: "var(--chart-2)" },
};

export function AreaChartPreview() {
  return <AreaChart data={monthlyData} config={monthlyConfig} xKey="month" stacked />;
}

export function BarChartPreview() {
  return <BarChart data={monthlyData} config={monthlyConfig} xKey="month" />;
}

export function LineChartPreview() {
  return <LineChart data={monthlyData} config={monthlyConfig} xKey="month" />;
}

export function ScatterChartPreview() {
  return <ScatterChart data={scatterData} config={scatterConfig} xKey="weight" />;
}

export function PieChartPreview() {
  return (
    <PieChart
      data={browserData}
      config={browserConfig}
      nameKey="browser"
      dataKey="visitors"
      donut
    />
  );
}

export function RadarChartPreview() {
  return <RadarChart data={monthlyData} config={monthlyConfig} xKey="month" />;
}

export function RadialChartPreview() {
  return (
    <RadialChart
      data={browserData}
      config={browserConfig}
      nameKey="browser"
      dataKey="visitors"
    />
  );
}

// ── single-series / variant previews (referenced by the MDX pages) ───────────

export function AreaChartSinglePreview() {
  return <AreaChart data={monthlyData} config={singleConfig} xKey="month" />;
}

export function BarChartSinglePreview() {
  return <BarChart data={monthlyData} config={singleConfig} xKey="month" />;
}

export function LineChartSinglePreview() {
  return <LineChart data={monthlyData} config={singleConfig} xKey="month" />;
}

export function PieChartDonutPreview() {
  return (
    <PieChart
      data={browserData}
      config={browserConfig}
      nameKey="browser"
      dataKey="visitors"
      donut
    />
  );
}

export function ScatterChartMultiPreview() {
  return (
    <ScatterChart
      data={scatterMultiData}
      config={scatterMultiConfig}
      xKey="weight"
    />
  );
}
