import { Badge, Separator } from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import Link from 'next/link';

import { GithubMark } from '@/components/github-mark';
import { GremorieSymbol } from '@/components/gremorie-symbol';

// Workbench is intentionally absent from Resources: the workbench app has no
// public deployment URL yet (docs/workbench.md still says "<set by your Vercel
// project>"). Add it here, and to the navbar in lib/layout.shared.tsx, once it
// ships publicly.
const resourceLinks = [
  { label: 'Get started', href: '/get-started/installation' },
  { label: 'Components', href: '/components' },
  { label: 'Blocks', href: '/blocks' },
  { label: 'Corpus', href: '/corpus' },
  { label: 'Tokens', href: '/tokens' },
];

const communityLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/usegremorie/gremorie',
    icon: GithubMark,
    external: true,
  },
  {
    label: 'Issues',
    href: 'https://github.com/usegremorie/gremorie/issues',
    icon: GithubMark,
    external: true,
  },
];

const legalLinks = [
  {
    label: 'License',
    href: 'https://github.com/usegremorie/gremorie/blob/develop/LICENSE',
    external: true,
  },
  {
    label: 'NOTICE',
    href: 'https://github.com/usegremorie/gremorie/blob/develop/NOTICE.md',
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
            {/* The brand is the symbol, as in the navbar (symbol alone, no
                wordmark); the visually hidden name is the accessible one. */}
            <p className="text-foreground" data-slot="footer-logo">
              <GremorieSymbol className="size-8" />
              <span className="sr-only">Gremorie</span>
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Copy-paste primitives, tokens, and blocks for React and Angular.
              Open source under MIT, made to be read by humans and machines.
            </p>
            <Button asChild className="mt-5" variant="secondary">
              <a
                href="https://github.com/usegremorie/gremorie"
                rel="noreferrer noopener"
                target="_blank"
              >
                <GithubMark className="size-4" />
                Star on GitHub
                <Badge variant="outline">MIT</Badge>
              </a>
            </Button>
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
        </div>
      </div>
    </footer>
  );
}
