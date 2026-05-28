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
