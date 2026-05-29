"use client";

import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gremorie/rx-display";
import { BarChart, type ChartConfig, type Datum } from "@gremorie/rx-data";

const SCHEMA = `{
  type: "chart-bar",
  data: Array<{ category: string; value: number }>,
  config: { xKey: string; yKey: string; label: string },
}`;

const DATA: Datum[] = [
  { category: "Q1", value: 42000 },
  { category: "Q2", value: 51000 },
  { category: "Q3", value: 48000 },
  { category: "Q4", value: 62000 },
];

const CONFIG: ChartConfig = {
  value: { label: "Revenue", color: "var(--chart-1)" },
};

export function ChartBar() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div>
              <CardTitle>Quarterly revenue</CardTitle>
              <CardDescription>
                Generated from a chart schema returned by the LLM.
              </CardDescription>
            </div>
            <Badge variant="outline">JSON Schema</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <BarChart data={DATA} config={CONFIG} xKey="category" />
        </CardContent>
      </Card>
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm">Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-x-auto text-xs font-mono text-muted-foreground">
            {SCHEMA}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
