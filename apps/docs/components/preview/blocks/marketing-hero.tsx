'use client';

import { Badge, Card } from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * Marketing hero block: brand-tinted halo, badge, headline with brand
 * highlight, dual CTA, and a window mockup card. Pure layout
 * composition over rx-display + rx-forms primitives.
 */
export function MarketingHero() {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl border bg-background px-6 py-14 lg:px-12 lg:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-[640px] -translate-x-1/2 rounded-full bg-gradient-to-br from-brand/30 via-brand/5 to-transparent blur-3xl"
      />
      <div className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <Badge variant="secondary" className="w-fit gap-2">
            <Sparkles className="size-3" aria-hidden="true" />
            v1.0 just shipped
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Build faster with <span className="text-brand">design systems</span>{' '}
            that LLMs understand.
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">
            Registry plus MCP, 85 primitives, two editions. Copy-paste your way
            to a production-ready surface in minutes.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg">
              Start free
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline">
              Book a demo
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Open source, MIT licensed. No credit card required.
          </p>
        </div>
        <div className="relative">
          <Card className="overflow-hidden border-2 p-0">
            <div className="flex items-center gap-1.5 border-b bg-muted/40 px-3 py-2">
              <span className="size-2.5 rounded-full bg-destructive/70" />
              <span className="size-2.5 rounded-full bg-amber-500/70" />
              <span className="size-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">
                gremorie.tsx
              </span>
            </div>
            <div className="grid gap-3 p-6 text-xs">
              <div className="h-3 w-3/5 rounded bg-foreground/80" />
              <div className="h-2 w-4/5 rounded bg-muted-foreground/40" />
              <div className="mt-2 grid grid-cols-3 gap-3">
                <div className="h-16 rounded bg-brand/20" />
                <div className="h-16 rounded bg-chart-1/20" />
                <div className="h-16 rounded bg-chart-2/20" />
              </div>
              <div className="mt-2 h-32 rounded bg-muted/60" />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
