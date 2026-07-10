import { Badge } from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

import { InstallCommand } from '@/components/landing/install-command';

/**
 * Landing hero - centered composition (shadcnblocks-style): version pill, the
 * parity headline, a one-paragraph subtitle, the install command box, and the
 * CTA hierarchy, all centered in a single column. The live chat surface lives
 * below the hero as the Assistant showcase.
 *
 * Home redesign, section 1: the pill states version + license (not stage), the
 * headline leads with the parity claim, and the install box is the immediate
 * proof of code above the fold. The old "edition marks" row is gone - its
 * numbers moved to the proof strip right below.
 *
 * Dogfood: pill is rx-display Badge; CTAs are rx-forms Button (asChild wraps
 * Next Link / anchor); the install box composes rx Tabs + Button.
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
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pt-20 pb-12 text-center lg:pt-28 lg:pb-14">
        <Badge variant="secondary" className="py-1">
          v0 · Open source · MIT
        </Badge>

        <h1 className="text-balance font-bold text-4xl text-foreground tracking-tight sm:text-5xl lg:text-6xl">
          One design system.{' '}
          <span className="text-cyan-600 dark:text-cyan-500">React</span> and{' '}
          <span className="text-rose-500 dark:text-rose-400">Angular</span>, at
          parity.
        </h1>

        <p className="max-w-2xl text-balance text-lg text-muted-foreground leading-relaxed">
          83 copy-paste primitives, tokens, and production blocks, shipped to
          both frameworks from one registry. Install with one command, own the
          source, restyle with your tokens.
        </p>

        <InstallCommand />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/components">
              Browse components
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/get-started/installation">Get started</Link>
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
      </div>
    </section>
  );
}
