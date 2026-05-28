import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@gremorie/rx-forms";
import { Badge } from "@gremorie/rx-display";
import { HeroDemo } from "./hero-demo";

/**
 * Landing hero. Dogfood: status pill is rx-display Badge;
 * CTAs are rx-forms Button (asChild wraps Next Link / anchor).
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column: copy + CTAs */}
          <div className="flex flex-col gap-6">
            <Badge variant="secondary" className="w-fit gap-2 py-1">
              <span
                className="size-1.5 rounded-full bg-emerald-500"
                aria-hidden="true"
              />
              AI-native design system, in development
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              The AI-native design system
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              Registry + MCP for AI-driven generation. Angular and React,
              copy-paste components. Your design system becomes a memory the
              LLM can read.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" asChild>
                <Link href="/get-started/installation">
                  Get Started
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/components/overview">View Components</Link>
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

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-4 text-xs text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">85</span>{" "}
                primitives
              </span>
              <span>
                <span className="font-medium text-foreground">
                  React + Angular
                </span>{" "}
                editions
              </span>
              <span>
                <span className="font-medium text-foreground">MIT</span>{" "}
                licensed
              </span>
            </div>
          </div>

          {/* Right column: live demo (decorative, hidden from assistive tech) */}
          <div className="relative" aria-hidden="true">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-2xl" />
            <HeroDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
