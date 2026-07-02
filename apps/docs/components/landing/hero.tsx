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
      {/* Faint dotted grid that fades toward the edges - the technical,
          docs-grade backdrop (Fumadocs / shadcn) in place of a colored glow.
          Dots use the border token; the radial mask keeps it a whisper. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--border)_1px,transparent_1px)] opacity-60 [background-size:22px_22px] [mask-image:radial-gradient(ellipse_55%_50%_at_50%_0%,#000_30%,transparent_75%)]"
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
          The production design system for{' '}
          <span className="text-cyan-600 dark:text-cyan-500">React</span> and{' '}
          <span className="text-rose-500 dark:text-rose-400">Angular</span>
        </h1>

        <div className="flex max-w-2xl flex-col gap-3 text-balance text-lg text-muted-foreground leading-relaxed">
          <p>
            85 primitives, design tokens, and production blocks, built once and
            shipped to both frameworks at parity. Install from the registry, own
            the source, customize with your tokens.
          </p>
          <p className="text-base">
            It is AI-native by design: a registry and MCP server make the whole
            system legible to your tools, so the code you generate is the code
            you ship.
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
