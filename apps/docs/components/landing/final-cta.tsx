import { Badge } from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

/**
 * Final CTA - reworked per Odo audit, then reframed away from AI-hype.
 *
 * Old version was a copy-paste of the hero ("Start building with
 * Gremorie" + same 3 CTAs). Current version:
 *  - Pre-headline badge states the open-source / dual-edition fact
 *  - Headline closes on the core promise: a design system you own,
 *    shipped to both frameworks - AI is supporting, not the hook
 *  - Supporting paragraph recaps own-the-code + parity + AI-native
 *  - Two CTAs instead of three - Get Started (primary) and GitHub
 *    (outline). Star count removed for now; we will add it once we have
 *    a live count.
 *  - Brand-tinted halo behind the section gives it a "closing" mood
 *    distinct from the hero's halo
 *
 * Dogfood: rx-display Badge for the pill, rx-forms Button for CTAs.
 */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Closing halo - centered, brand-tinted. Larger and more diffuse
          than the hero halo so this reads as a "closing chord" not a
          repeat of the hero. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[140px]"
      />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Badge variant="secondary" className="mb-6 gap-2 py-1">
          <span
            className="size-1.5 rounded-full bg-primary"
            aria-hidden="true"
          />
          Open source, MIT licensed, React and Angular
        </Badge>

        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          A design system you own,
          <br />
          <span className="text-primary">on both frameworks.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          85 primitives, design tokens, and production blocks, with a registry
          and MCP server that keep the system legible to your tools. Install
          from the registry and ship your own UI in your next sprint.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/get-started/installation">
              Get Started
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
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
