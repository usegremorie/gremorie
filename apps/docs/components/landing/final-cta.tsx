import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";

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
          <Link
            href="/get-started/installation"
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Get Started
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            href="/get-started/philosophy"
            className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Read the docs
          </Link>
          <a
            href="https://github.com/usegremorie/gremorie"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Github className="size-4" aria-hidden="true" />
            Star on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
