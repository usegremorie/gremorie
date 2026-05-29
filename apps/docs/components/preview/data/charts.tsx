"use client";

import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart,
  RadarChart,
  RadialChart,
  ScatterChart,
} from "@gremorie/rx-data";
import type { ChartConfig, Datum } from "@gremorie/rx-data";

// Shared mock data used across the cartesian previews.
const monthlyData: Datum[] = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
];

const monthlyConfig: ChartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
};

// ---------- Area ----------

export function AreaChartPreview() {
  return <AreaChart data={monthlyData} config={monthlyConfig} xKey="month" />;
}

// ---------- Bar ----------

export function BarChartPreview() {
  return <BarChart data={monthlyData} config={monthlyConfig} xKey="month" />;
}

// ---------- Line ----------

export function LineChartPreview() {
  return <LineChart data={monthlyData} config={monthlyConfig} xKey="month" />;
}

// ---------- Scatter ----------

const scatterData: Datum[] = [
  { x: 30, y: 100 },
  { x: 50, y: 200 },
  { x: 70, y: 150 },
  { x: 90, y: 250 },
  { x: 110, y: 175 },
  { x: 130, y: 300 },
  { x: 150, y: 220 },
];

const scatterConfig: ChartConfig = {
  y: { label: "Value", color: "var(--chart-1)" },
};

export function ScatterChartPreview() {
  return (
    <ScatterChart data={scatterData} config={scatterConfig} xKey="x" />
  );
}

// ---------- Pie ----------

const pieData: Datum[] = [
  { browser: "Chrome", visitors: 275 },
  { browser: "Safari", visitors: 200 },
  { browser: "Firefox", visitors: 187 },
  { browser: "Edge", visitors: 173 },
  { browser: "Other", visitors: 90 },
];

export function PieChartPreview() {
  return (
    <PieChart data={pieData} nameKey="browser" valueKey="visitors" />
  );
}

export function PieChartDonutPreview() {
  return (
    <PieChart data={pieData} nameKey="browser" valueKey="visitors" donut />
  );
}

// ---------- Radar ----------

const radarData: Datum[] = [
  { skill: "Speed", a: 90, b: 60 },
  { skill: "Power", a: 70, b: 80 },
  { skill: "Stamina", a: 85, b: 70 },
  { skill: "Agility", a: 75, b: 90 },
  { skill: "Skill", a: 95, b: 65 },
];

const radarConfig: ChartConfig = {
  a: { label: "Player A", color: "var(--chart-1)" },
  b: { label: "Player B", color: "var(--chart-2)" },
};

export function RadarChartPreview() {
  return <RadarChart data={radarData} config={radarConfig} xKey="skill" />;
}

// ---------- Radial ----------

const radialData: Datum[] = [
  { category: "Chrome", visitors: 275 },
  { category: "Safari", visitors: 200 },
  { category: "Firefox", visitors: 187 },
  { category: "Edge", visitors: 173 },
];

export function RadialChartPreview() {
  return (
    <RadialChart data={radialData} nameKey="category" valueKey="visitors" />
  );
}

// ---------- Variation helpers (used by MDX) ----------

const areaSingleData: Datum[] = [
  { month: "Jan", visits: 186 },
  { month: "Feb", visits: 305 },
  { month: "Mar", visits: 237 },
  { month: "Apr", visits: 273 },
  { month: "May", visits: 209 },
  { month: "Jun", visits: 314 },
];

const areaSingleConfig: ChartConfig = {
  visits: { label: "Visits", color: "var(--chart-1)" },
};

export function AreaChartSinglePreview() {
  return (
    <AreaChart data={areaSingleData} config={areaSingleConfig} xKey="month" />
  );
}

const lineSingleData: Datum[] = [
  { week: "W1", signups: 32 },
  { week: "W2", signups: 41 },
  { week: "W3", signups: 28 },
  { week: "W4", signups: 56 },
  { week: "W5", signups: 47 },
  { week: "W6", signups: 71 },
];

const lineSingleConfig: ChartConfig = {
  signups: { label: "Sign-ups", color: "var(--chart-1)" },
};

export function LineChartSinglePreview() {
  return (
    <LineChart data={lineSingleData} config={lineSingleConfig} xKey="week" />
  );
}

const barSingleData: Datum[] = [
  { region: "AMER", revenue: 124 },
  { region: "EMEA", revenue: 88 },
  { region: "APAC", revenue: 61 },
  { region: "LATAM", revenue: 42 },
];

const barSingleConfig: ChartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
};

export function BarChartSinglePreview() {
  return (
    <BarChart data={barSingleData} config={barSingleConfig} xKey="region" />
  );
}

const scatterMultiData: Datum[] = [
  { weight: 60, height: 168, max: 175 },
  { weight: 65, height: 170, max: 180 },
  { weight: 70, height: 174, max: 186 },
  { weight: 75, height: 178, max: 192 },
  { weight: 80, height: 180, max: 198 },
  { weight: 85, height: 182, max: 200 },
  { weight: 90, height: 184, max: 204 },
];

const scatterMultiConfig: ChartConfig = {
  height: { label: "Median", color: "var(--chart-1)" },
  max: { label: "Max", color: "var(--chart-2)" },
};

export function ScatterChartMultiPreview() {
  return (
    <ScatterChart
      data={scatterMultiData}
      config={scatterMultiConfig}
      xKey="weight"
    />
  );
}
