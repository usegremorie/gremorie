'use client';

import { ChartArtifact } from '@gremorie/rx-artifacts';
import { Button } from '@gremorie/rx-forms';
import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { ArrowRight, TrendingUpIcon } from 'lucide-react';
import Link from 'next/link';

/**
 * Spotlights the REAL `ChartArtifact` from @gremorie/rx-artifacts - the same
 * component shipped in the registry, with its working header (featured icon,
 * title, description, chart/table view toggle, Download menu, More menu).
 *
 * The pair reads as "component + its source": the left card IS the rendered
 * artifact; the right panel shows the exact code that renders it in BOTH
 * editions, inside the same Fumadocs Tabs + DynamicCodeBlock surface the docs
 * pages use (see `component-preview.tsx`). No invented components, no fake
 * chrome.
 */

// Believable product dataset: monthly revenue, first half of the year,
// in USD thousands. Rendered by the artifact AND interpolated into the
// snippets below so chart and code can never drift apart.
const revenueData = [
  { month: 'Jan', revenue: 42 },
  { month: 'Feb', revenue: 58 },
  { month: 'Mar', revenue: 51 },
  { month: 'Apr', revenue: 66 },
  { month: 'May', revenue: 74 },
  { month: 'Jun', revenue: 69 },
];

// Shared `revenueData` literal, generated from the constant above so the
// rows in both snippets always match the rendered chart.
const REVENUE_ROWS = revenueData
  .map((d) => `  { month: '${d.month}', revenue: ${d.revenue} },`)
  .join('\n');

// Faithful React usage snippet: the ChartArtifact props mirror the JSX
// rendered on the left 1:1. If you change a prop below, change it here too
// (and vice versa).
const REACT_ARTIFACT_CODE = `import { ChartArtifact } from '@gremorie/rx-artifacts';
import { TrendingUpIcon } from 'lucide-react';

const revenueData = [
${REVENUE_ROWS}
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

// Faithful Angular usage snippet: the same artifact from @gremorie/ng-artifacts
// (selector `chart-artifact`, identical input names). The NG `icon` input takes
// a registered @ng-icons name, so the equivalent of `icon={TrendingUpIcon}` is
// providing `lucideTrendingUp` and passing its name.
const ANGULAR_ARTIFACT_CODE = `import { Component } from '@angular/core';
import { ChartArtifact } from '@gremorie/ng-artifacts';
import { provideIcons } from '@ng-icons/core';
import { lucideTrendingUp } from '@ng-icons/lucide';

@Component({
  selector: 'app-revenue-artifact',
  imports: [ChartArtifact],
  providers: [provideIcons({ lucideTrendingUp })],
  template: \`
    <chart-artifact
      title="Monthly revenue"
      description="Last 6 months, USD thousands"
      icon="lucideTrendingUp"
      type="bar"
      [data]="revenueData"
      categoryKey="month"
      valueKey="revenue"
      categoryLabel="Month"
      valueLabel="Revenue ($k)"
      fileName="monthly-revenue"
    />
  \`,
})
export class RevenueArtifact {
  readonly revenueData = [
${REVENUE_ROWS}
  ];
}`;

export function ArtifactsSpotlight() {
  return (
    <section className="relative py-20">
      {/*
        Section-level gradient halo behind the pair. Ties the artifact and
        its source panel into one "artifacts surface": chart-1 -> brand ->
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
        {/* Header CTA placement mirrors components-showcase: heading +
            description on the left, one ghost-button link on the right. */}
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Artifacts that render real output
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Schema in, component out. This is the real ChartArtifact from the
              registry, complete with its chart and table views, downloads and
              actions, paired with the exact code that renders it.
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/artifacts">
              Learn more about artifacts
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* The real ChartArtifact, rendered live. Its header carries the
              working chart/table toggle, the Download menu (PNG / CSV) and
              the More menu, exactly as shipped in the registry. Props are
              mirrored 1:1 by REACT_ARTIFACT_CODE in the panel beside it. */}
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

          {/* The code behind the artifact, on the SAME surface the docs use:
              Fumadocs Tabs + DynamicCodeBlock (shiki, copy button), with one
              faithful snippet per framework edition. */}
          <Tabs className="my-0 min-w-0" items={['React', 'Angular']}>
            <Tab className="my-0 [&_figure]:my-0" value="React">
              <DynamicCodeBlock code={REACT_ARTIFACT_CODE} lang="tsx" />
            </Tab>
            <Tab className="my-0 [&_figure]:my-0" value="Angular">
              <DynamicCodeBlock
                code={ANGULAR_ARTIFACT_CODE}
                lang="angular-ts"
              />
            </Tab>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
