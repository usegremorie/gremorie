import Link from "next/link";
import { Github } from "lucide-react";

/**
 * Landing-only header. Lives outside the DocsLayout. Sticky, blurred
 * background, minimal navigation. The DocsLayout has its own Fumadocs
 * header with the sidebar trigger; this one is just for the standalone
 * landing at `/`.
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
          <a
            href="https://github.com/usegremorie/gremorie"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="View Gremorie on GitHub"
            className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Github className="size-4" aria-hidden="true" />
            <span className="sr-only md:not-sr-only md:ml-2">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
