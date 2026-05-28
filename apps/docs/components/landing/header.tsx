"use client";

import Link from "next/link";
import { useState } from "react";
import { Github, Menu } from "lucide-react";
import { Button } from "@gremorie/rx-forms";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@gremorie/rx-overlays";

/**
 * Landing-only header. Lives outside the DocsLayout. Sticky, blurred
 * background, minimal navigation. The DocsLayout has its own Fumadocs
 * header with the sidebar trigger; this one is just for the standalone
 * landing at `/`.
 *
 * Dogfood: GitHub link uses rx-forms Button (variant=ghost, asChild).
 * Desktop nav links stay as plain Next Link for routing simplicity.
 * Mobile nav uses Sheet from rx-overlays (Bug 1 fix from Odo audit).
 *
 * Accessibility:
 * - Desktop nav has aria-label="Main" (Bug 4: landmark-unique)
 * - Mobile nav inside Sheet has aria-label="Mobile" (Bug 4)
 * - Hamburger button has dynamic aria-label that switches between
 *   "Open menu" and "Close menu" based on Sheet state
 */
const NAV_LINKS = [
  { href: "/get-started/installation", label: "Docs" },
  { href: "/components/overview", label: "Components" },
  { href: "/blocks/overview", label: "Blocks" },
  { href: "/corpus", label: "Corpus" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          Gremorie
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-6 text-sm text-muted-foreground md:flex"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
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

          {/* Mobile menu trigger - visible below md breakpoint */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav
                aria-label="Mobile"
                className="flex flex-col gap-1 px-4 pb-4 text-sm"
              >
                {NAV_LINKS.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <a
                    href="https://github.com/usegremorie/gremorie"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Github aria-hidden="true" className="size-4" />
                    GitHub
                  </a>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
