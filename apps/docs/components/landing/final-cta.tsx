import { Button } from '@gremorie/rx-forms';
import { ArrowRight, Github } from 'lucide-react';
import Link from 'next/link';

/**
 * Final CTA - the closing chord (home redesign, section 11).
 *
 * Every claim was already made once, in its best moment, higher on the page:
 * the pill carries MIT, the proof strip carries the numbers, the parity
 * section carries the proof. So the close has NO badge and does not restate
 * the hero. It reframes the promise as the outcome ("your own design system,
 * not a dependency") and recaps in one line where the pieces already agree:
 * React, Angular, and your AI tools.
 *
 * Two CTAs only - Get started (primary) and GitHub (outline). Star count
 * intentionally absent until we have a live count.
 *
 * Dogfood: rx-forms Button for the CTAs.
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
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Ship your own design system,
          <br />
          <span className="text-primary">not a dependency.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Start with 83 primitives and 5 blocks that already agree with each
          other: in React, in Angular, and in front of your AI tools.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/get-started/installation">
              Get started
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
