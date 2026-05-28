import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@gremorie/rx-forms";

/**
 * Dogfood: all 3 CTAs use rx-forms Button (default, outline, outline w/ icon).
 */
export function FinalCta() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          Start building with Gremorie
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Open source. AI-native. Production-ready.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link href="/get-started/installation">
              Get Started
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/get-started/philosophy">Read the docs</Link>
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
