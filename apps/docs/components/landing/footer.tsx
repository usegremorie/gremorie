import Link from "next/link";
import { Separator } from "@gremorie/rx-display";

const links = [
  { label: "Docs", href: "/get-started/installation" },
  { label: "Components", href: "/components/overview" },
  { label: "Blocks", href: "/blocks/overview" },
  { label: "Corpus", href: "/corpus" },
];

/**
 * Dogfood: top rule uses rx-display Separator instead of CSS border.
 * Links remain as plain Next Link / anchor for routing.
 */
export function Footer() {
  return (
    <footer className="bg-background">
      <Separator />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>
            <span className="font-medium text-foreground">Gremorie</span> ·{" "}
            <span>© 2026 Kalvner</span>
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <a
              href="https://github.com/usegremorie/gremorie"
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
          <p>
            <span>MIT Licensed</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
