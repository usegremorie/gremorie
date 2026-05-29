import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@gremorie/rx-forms";
import { Badge } from "@gremorie/rx-display";

/**
 * Final CTA - reworked per Odo audit.
 *
 * Old version was a copy-paste of the hero ("Start building with
 * Gremorie" + same 3 CTAs). New version:
 *  - Pre-headline badge sets the AI-native pitch
 *  - Headline focuses on the differentiator (legibility for LLMs), not
 *    a generic "start building" CTA
 *  - Supporting paragraph names the audience (AI engineers) and the
 *    promise (ship in your next sprint)
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
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[140px]"
      />
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Badge variant="secondary" className="mb-6 gap-2 py-1">
          <span
            className="size-1.5 rounded-full bg-brand"
            aria-hidden="true"
          />
          Built by AI engineers, for AI engineers
        </Badge>

        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Stop fighting your design system.
          <br />
          <span className="text-brand">Make it AI-legible.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Open source. MCP-ready. Production-grade. Ship a brand-aware UI
          your LLM can read and your team can own in their next sprint.
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
