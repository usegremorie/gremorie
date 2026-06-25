import { Badge } from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

/**
 * Landing hero - centered composition (shadcnblocks-style): status pill, the
 * tagline, a two-paragraph subtitle, the CTA hierarchy, and the edition marks,
 * all centered in a single column. The live chat surface that used to sit in a
 * right column now lives below the hero as the Assistant showcase.
 *
 * Dogfood: status pill is rx-display Badge; CTAs are rx-forms Button (asChild
 * wraps Next Link / anchor). The primary halo follows the active theme.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient primary halo, centered behind the headline - sets the mystical
          tone without competing with content. Decorative. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[520px] w-[820px] max-w-full -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
      />
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center lg:py-28">
        <Badge variant="secondary" className="gap-2 py-1">
          <span
            className="size-1.5 rounded-full bg-success"
            aria-hidden="true"
          />
          In active development
        </Badge>

        <h1 className="text-balance font-bold text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl">
          The AI-native design system for{' '}
          <span className="text-cyan-600 dark:text-cyan-500">React</span> and{' '}
          <span className="text-rose-500 dark:text-rose-400">Angular</span>
        </h1>

        <div className="flex max-w-2xl flex-col gap-3 text-balance text-lg text-muted-foreground leading-relaxed">
          <p>
            AI-native components and blocks, delivered through an MCP server and
            a registry. The documentation runs as a chain - design principles
            into components, components into the blocks built from them - so an
            LLM reads the whole system.
          </p>
          <p className="text-base">
            Designers prototype with the real components through MCP; developers
            ship the same ones to production.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
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

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-muted-foreground text-xs">
          <span>
            <span className="font-medium text-foreground">85</span> primitives
          </span>
          <span>
            <span className="font-medium text-foreground">React + Angular</span>{' '}
            editions
          </span>
          <span>
            <span className="font-medium text-foreground">MIT</span> licensed
          </span>
        </div>
      </div>
    </section>
  );
}
