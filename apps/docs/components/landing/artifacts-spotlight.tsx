'use client';

import { ChartArtifact, CodeBlock } from '@gremorie/rx-artifacts';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { ArrowRight, Code2, TrendingUpIcon } from 'lucide-react';
import Link from 'next/link';

/**
 * Spotlights the REAL `ChartArtifact` from @gremorie/rx-artifacts - the same
 * component shipped in the registry, with its working header (featured icon,
 * title, description, chart/table view toggle, Download menu, More menu).
 *
 * The pair reads as "component + its source": the left card IS the rendered
 * artifact; the right card shows the exact JSX that renders it, inside the
 * real `CodeBlock` primitive. No invented components, no fake chrome.
 */

// Believable product dataset: monthly revenue, first half of the year,
// in USD thousands. Rendered by the artifact AND interpolated into the
// snippet below so chart and code can never drift apart.
const revenueData = [
  { month: 'Jan', revenue: 42 },
  { month: 'Feb', revenue: 58 },
  { month: 'Mar', revenue: 51 },
  { month: 'Apr', revenue: 66 },
  { month: 'May', revenue: 74 },
  { month: 'Jun', revenue: 69 },
];

// Faithful usage snippet: the `data` rows are generated from `revenueData`
// and the ChartArtifact props mirror the JSX rendered on the left 1:1.
// If you change a prop below, change it here too (and vice versa).
const ARTIFACT_CODE = `import { ChartArtifact } from '@gremorie/rx-artifacts';
import { TrendingUpIcon } from 'lucide-react';

const revenueData = [
${revenueData.map((d) => `  { month: '${d.month}', revenue: ${d.revenue} },`).join('\n')}
];

export function RevenueArtifact() {
  return (
    <ChartArtifact
      title="Monthly revenue"
      description="Last 6 months, USD thousands"
      icon={TrendingUpIcon}
      type="bar"
      data={revenueData}
      categoryKey="month"
      valueKey="revenue"
      categoryLabel="Month"
      valueLabel="Revenue ($k)"
      fileName="monthly-revenue"
    />
  );
}`;

export function ArtifactsSpotlight() {
  return (
    <section className="relative py-20">
      {/*
        Section-level gradient halo behind the pair. Ties the artifact and
        its source card into one "artifacts surface": chart-1 -> brand ->
        chart-3, echoing the chart palette on one side and the brand violet
        on the code side. Decorative.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 h-96 -translate-y-1/2 blur-3xl"
        style={{
          background:
            'linear-gradient(90deg, color-mix(in oklch, var(--chart-1) 12%, transparent) 0%, color-mix(in oklch, var(--primary) 12%, transparent) 50%, color-mix(in oklch, var(--chart-3) 12%, transparent) 100%)',
        }}
      />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Artifacts that render real output
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Schema in, component out. This is the real ChartArtifact from the
            registry, complete with its chart and table views, downloads and
            actions, paired with the exact code that renders it.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* The real ChartArtifact, rendered live. Its header carries the
              working chart/table toggle, the Download menu (PNG / CSV) and
              the More menu, exactly as shipped in the registry. Props are
              mirrored 1:1 by ARTIFACT_CODE in the card beside it. */}
          <ChartArtifact
            title="Monthly revenue"
            description="Last 6 months, USD thousands"
            icon={TrendingUpIcon}
            type="bar"
            data={revenueData}
            categoryKey="month"
            valueKey="revenue"
            categoryLabel="Month"
            valueLabel="Revenue ($k)"
            fileName="monthly-revenue"
            className="h-full"
          />

          {/* The code behind the artifact - the faithful usage snippet in
              the real CodeBlock primitive (shiki, light + dark themes). */}
          <Card className="relative flex h-full flex-col gap-0 overflow-hidden py-0">
            {/* Brand-tinted halo: code is the AI-native specialty, so the
                violet brand tone ties it to the AI value prop. Decorative. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 opacity-50"
              style={{
                background:
                  'radial-gradient(ellipse at top, color-mix(in oklch, var(--primary) 12%, transparent), transparent 70%)',
              }}
            />
            <CardHeader className="border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Code2 className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <CardTitle className="truncate text-sm font-medium">
                    The code behind this artifact
                  </CardTitle>
                  <CardDescription className="truncate text-sm">
                    The exact JSX rendering the card on the left
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="shrink-0 text-[10px] uppercase tracking-wider"
                >
                  TSX
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="min-h-0 flex-1 p-0">
              <CodeBlock
                code={ARTIFACT_CODE}
                language="tsx"
                className="h-full rounded-none border-0"
              />
            </CardContent>

            <CardFooter className="border-t border-border/60 p-0">
              <Button
                variant="ghost"
                className="h-auto w-full justify-start rounded-none px-5 py-3 text-xs font-medium"
                asChild
              >
                <Link href="/artifacts">
                  Learn more about artifacts
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
