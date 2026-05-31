import Link from "next/link";
import { Github } from "lucide-react";
import { Separator } from "@gremorie/rx-display";

const resourceLinks = [
  { label: "Get started", href: "/get-started/installation" },
  { label: "Components", href: "/components" },
  { label: "Blocks", href: "/blocks" },
  { label: "Corpus", href: "/corpus" },
  { label: "Tokens", href: "/tokens" },
];

const communityLinks = [
  {
    label: "GitHub",
    href: "https://github.com/usegremorie/gremorie",
    icon: Github,
    external: true,
  },
  {
    label: "Issues",
    href: "https://github.com/usegremorie/gremorie/issues",
    icon: Github,
    external: true,
  },
];

const legalLinks = [
  {
    label: "License",
    href: "https://github.com/usegremorie/gremorie/blob/develop/LICENSE",
    external: true,
  },
  {
    label: "NOTICE",
    href: "https://github.com/usegremorie/gremorie/blob/develop/NOTICE.md",
    external: true,
  },
];

/**
 * Footer - expanded per Odo audit.
 *
 * The previous single-line footer felt like a placeholder. New version
 * is a 3-column footer with a brand column, a resources column, and a
 * community+legal column. Bottom bar carries the MIT line + copyright
 * + license link, kept light.
 *
 * Dogfood: top + mid rules use rx-display Separator. Links remain Next
 * Link / anchor for routing.
 */
export function Footer() {
  return (
    <footer className="bg-background">
      <Separator />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <p className="text-base font-semibold tracking-tight text-foreground">
              Gremorie
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              The AI-native design system. A registry, a corpus, and an MCP
              server so your LLM can read your DS as memory, not noise.
            </p>
            <a
              href="https://github.com/usegremorie/gremorie"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-5 inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Github className="size-3.5" aria-hidden="true" />
              <span>Star on GitHub</span>
              <span className="ml-1 inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-foreground">
                MIT
              </span>
            </a>
          </div>

          {/* Resources column */}
          <nav aria-label="Resources" className="lg:col-span-3">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Resources
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              {resourceLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Community + Legal column */}
          <div className="grid grid-cols-2 gap-6 lg:col-span-4 lg:grid-cols-2">
            <nav aria-label="Community">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Community
              </p>
              <ul className="flex flex-col gap-2 text-sm">
                {communityLinks.map((l) => {
                  const Icon = l.icon;
                  if (l.external) {
                    return (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          <Icon className="size-3.5" aria-hidden="true" />
                          {l.label}
                        </a>
                      </li>
                    );
                  }
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="inline-flex items-center gap-2 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        <Icon className="size-3.5" aria-hidden="true" />
                        {l.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <nav aria-label="Legal">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Legal
              </p>
              <ul className="flex flex-col gap-2 text-sm">
                {legalLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        {/* Bottom bar - copyright + MIT */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 Kalvner. Open source under MIT.</p>
          <p>Made with care in Brazil.</p>
        </div>
      </div>
    </footer>
  );
}
