import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@gremorie/rx-forms";

/**
 * Landing-only header. Lives outside the DocsLayout. Sticky, blurred
 * background, minimal navigation. The DocsLayout has its own Fumadocs
 * header with the sidebar trigger; this one is just for the standalone
 * landing at `/`.
 *
 * Dogfood: GitHub link uses rx-forms Button (variant=ghost, asChild).
 * Nav links stay as plain Next Link for routing simplicity.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          Gremorie
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link
            href="/get-started/installation"
            className="transition-colors hover:text-foreground"
          >
            Docs
          </Link>
          <Link
            href="/components/overview"
            className="transition-colors hover:text-foreground"
          >
            Components
          </Link>
          <Link
            href="/blocks/overview"
            className="transition-colors hover:text-foreground"
          >
            Blocks
          </Link>
          <Link
            href="/corpus"
            className="transition-colors hover:text-foreground"
          >
            Corpus
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <a
              href="https://github.com/usegremorie/gremorie"
              target="_blank"
              rel="noreferrer noopener"
              aria-label="View Gremorie on GitHub"
            >
              <Github aria-hidden="true" />
              <span className="sr-only md:not-sr-only">GitHub</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
