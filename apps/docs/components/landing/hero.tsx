import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { HeroDemo } from "./hero-demo";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column: copy + CTAs */}
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              AI-native design system, in development
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              The AI-native design system
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Registry + MCP for AI-driven generation. Angular and React,
              copy-paste components. Your design system becomes a memory the
              LLM can read.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/get-started/installation"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Get Started
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/components/overview"
                className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View Components
              </Link>
              <a
                href="https://github.com/usegremorie/gremorie"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Github className="size-4" aria-hidden="true" />
                Star on GitHub
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">100</span>{" "}
                primitives
              </span>
              <span>
                <span className="font-medium text-foreground">React + Angular</span>{" "}
                editions
              </span>
              <span>
                <span className="font-medium text-foreground">MIT</span>{" "}
                licensed
              </span>
            </div>
          </div>

          {/* Right column: live demo */}
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-2xl" />
            <HeroDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
