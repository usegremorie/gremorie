import { Badge } from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

import { HeroDemo } from './hero-demo';

/**
 * Landing hero. Dogfood: status pill is rx-display Badge;
 * CTAs are rx-forms Button (asChild wraps Next Link / anchor).
 *
 * Brand identity (Deanna refresh):
 * - Background halo behind demo uses --brand (violet) instead of --primary,
 *   giving the hero its first dose of brand color without touching primary.
 * - 3 CTA hierarchy: primary "Get Started" (filled), secondary "View Components"
 *   (outline), tertiary "Star on GitHub" (ghost). The ghost variant pulls back
 *   visually so the eye lands on Get Started first.
 * - Subtitle split in two paragraphs - tagline + clarifier - improves rhythm
 *   and keeps each sentence under ~12 words.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient brand halo - top-right corner, very low intensity. Sits below
          everything (`-z-10`) and is decorative (`aria-hidden`). Sets the
          mystical tone without competing with content. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 -z-10 h-[480px] w-[480px] rounded-full bg-brand/15 blur-[120px]"
      />
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column: copy + CTAs */}
          <div className="flex flex-col gap-6">
            <Badge variant="secondary" className="w-fit gap-2 py-1">
              <span
                className="size-1.5 rounded-full bg-success"
                aria-hidden="true"
              />
              In active development
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              The AI-native design system for{' '}
              <span className="text-cyan-600 dark:text-cyan-500">React</span>{' '}
              and{' '}
              <span className="text-rose-500 dark:text-rose-400">Angular</span>
            </h1>

            <div className="flex max-w-xl flex-col gap-3 text-lg leading-relaxed text-muted-foreground">
              <p>
                AI-native components and blocks, available through an MCP server
                and a registry. Its documentation runs as a chain — design
                principles into components, components into the blocks built
                from them — so an LLM reads the whole system.
              </p>
              <p className="text-base">
                Designers prototype with the real components through MCP;
                developers ship the same ones to production.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/get-started/installation">
                  Get Started
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/components">View Components</Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <a
                  href="https://github.com/usegremorie/gremorie"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Github aria-hidden="true" />
                  Star on GitHub
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">85</span>{' '}
                primitives
              </span>
              <span>
                <span className="font-medium text-foreground">
                  React + Angular
                </span>{' '}
                editions
              </span>
              <span>
                <span className="font-medium text-foreground">MIT</span>{' '}
                licensed
              </span>
            </div>
          </div>

          {/*
            Right column: live demo (decorative, hidden from assistive tech).
            Use `inert` (not just aria-hidden) so descendant buttons/textarea
            are removed from the tab order entirely. WCAG 4.1.2 fix.

            Halo updated to brand/15 -> brand/5 fade so the demo card sits in
            a warm violet glow instead of the previous neutral primary tint.
          */}
          <div className="relative" aria-hidden="true" inert>
            {/*
              Halo bumped from brand/20 to brand/30 + blur-3xl per Odo
              final audit. brand/20 read as subliminal in light mode -
              users could not tell the violet identity was already there.
              brand/30 + larger blur radius pushes the violet glow into
              "visible but ambient" territory without becoming a tint.
            */}
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-brand/30 via-brand/5 to-transparent blur-3xl" />
            <HeroDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
