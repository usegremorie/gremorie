import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@gremorie/rx-forms";
import {
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gremorie/rx-display";

type BlockShape =
  | "sign-in"
  | "dashboard"
  | "chat"
  | "settings"
  | "marketing"
  | "empty";

/**
 * Each block cycles through chart-1..5 (with chart-1 reused for the 6th).
 * Accent is rendered inline via color-mix so we stay token-driven and
 * theme-aware (chart tokens already remap between light and dark).
 *
 * Adds a `shape` slot per block - drives a small inline SVG mockup that
 * visually previews the block layout. Mockups are intentionally low-detail
 * (rectangles + circles) so they read as schematic, not as final UI -
 * cleaner than a screenshot, cheaper than a screenshot, and they reuse
 * the same chart accent that powers the card halo.
 */
const blocks: ReadonlyArray<{
  name: string;
  category: string;
  description: string;
  href: string;
  chart: string;
  shape: BlockShape;
}> = [
  {
    name: "Sign-in",
    category: "Auth",
    description: "Email and password card with OAuth slot.",
    href: "/blocks#sign-in",
    chart: "var(--chart-1)",
    shape: "sign-in",
  },
  {
    name: "Dashboard",
    category: "Shell",
    description: "Sidebar plus KPI grid plus chart plus recent activity.",
    href: "/blocks#dashboard",
    chart: "var(--chart-2)",
    shape: "dashboard",
  },
  {
    name: "Chat surface",
    category: "AI",
    description: "Conversation, Message, PromptInput - fully wired.",
    href: "/blocks#chat-surface",
    chart: "var(--brand)",
    shape: "chat",
  },
  {
    name: "Settings form",
    category: "Forms",
    description: "Multi-section form with save bar and validation.",
    href: "/blocks#settings",
    chart: "var(--chart-4)",
    shape: "settings",
  },
  {
    name: "Marketing hero",
    category: "Marketing",
    description: "Hero with CTA, feature grid, social proof.",
    href: "/blocks#marketing",
    chart: "var(--chart-5)",
    shape: "marketing",
  },
  {
    name: "Empty state",
    category: "Patterns",
    description: "No data, no results, error, permission denied.",
    href: "/blocks#empty-state",
    chart: "var(--chart-3)",
    shape: "empty",
  },
];

/**
 * Tiny schematic mockups - one per block.
 * - All elements use `currentColor` so the SVG inherits the card's accent
 *   (we set `style={{ color }}` on the wrapper to feed the accent in).
 * - Opacity tiers: 1.0 = strong elements (primary action), 0.5 = secondary,
 *   0.25 = ambient lines / labels - gives the diagram visible hierarchy.
 */
function BlockMockup({ shape }: { shape: BlockShape }) {
  const stroke = "currentColor";
  switch (shape) {
    case "sign-in":
      return (
        <svg viewBox="0 0 120 60" className="size-full" aria-hidden="true">
          <rect x="20" y="10" width="80" height="6" rx="2" fill={stroke} opacity="0.25" />
          <rect x="20" y="22" width="80" height="8" rx="2" fill="none" stroke={stroke} strokeOpacity="0.5" />
          <rect x="20" y="34" width="80" height="8" rx="2" fill="none" stroke={stroke} strokeOpacity="0.5" />
          <rect x="20" y="46" width="80" height="8" rx="2" fill={stroke} opacity="0.9" />
        </svg>
      );
    case "dashboard":
      return (
        <svg viewBox="0 0 120 60" className="size-full" aria-hidden="true">
          <rect x="2" y="2" width="20" height="56" rx="2" fill={stroke} opacity="0.15" />
          <rect x="28" y="2" width="20" height="18" rx="2" fill={stroke} opacity="0.5" />
          <rect x="52" y="2" width="20" height="18" rx="2" fill={stroke} opacity="0.5" />
          <rect x="76" y="2" width="20" height="18" rx="2" fill={stroke} opacity="0.5" />
          <rect x="100" y="2" width="18" height="18" rx="2" fill={stroke} opacity="0.5" />
          <rect x="28" y="26" width="90" height="32" rx="2" fill="none" stroke={stroke} strokeOpacity="0.6" />
          <polyline points="32,52 42,42 52,46 62,36 72,40 82,30 92,34 102,28 112,32"
            fill="none" stroke={stroke} strokeOpacity="0.9" strokeWidth="1.5" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 120 60" className="size-full" aria-hidden="true">
          <rect x="60" y="6" width="50" height="10" rx="5" fill={stroke} opacity="0.7" />
          <rect x="10" y="22" width="65" height="10" rx="5" fill="none" stroke={stroke} strokeOpacity="0.5" />
          <rect x="10" y="36" width="45" height="6" rx="3" fill="none" stroke={stroke} strokeOpacity="0.4" />
          <rect x="10" y="48" width="100" height="8" rx="2" fill={stroke} opacity="0.2" />
          <circle cx="105" cy="52" r="3" fill={stroke} opacity="0.9" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 120 60" className="size-full" aria-hidden="true">
          <rect x="10" y="8" width="40" height="4" rx="2" fill={stroke} opacity="0.7" />
          <rect x="10" y="16" width="100" height="6" rx="2" fill="none" stroke={stroke} strokeOpacity="0.4" />
          <rect x="10" y="26" width="40" height="4" rx="2" fill={stroke} opacity="0.7" />
          <rect x="10" y="34" width="100" height="6" rx="2" fill="none" stroke={stroke} strokeOpacity="0.4" />
          <rect x="80" y="46" width="30" height="8" rx="2" fill={stroke} opacity="0.9" />
        </svg>
      );
    case "marketing":
      return (
        <svg viewBox="0 0 120 60" className="size-full" aria-hidden="true">
          <rect x="20" y="8" width="80" height="6" rx="2" fill={stroke} opacity="0.9" />
          <rect x="28" y="18" width="64" height="3" rx="1" fill={stroke} opacity="0.3" />
          <rect x="34" y="26" width="22" height="8" rx="2" fill={stroke} opacity="0.9" />
          <rect x="62" y="26" width="22" height="8" rx="2" fill="none" stroke={stroke} strokeOpacity="0.5" />
          <rect x="14" y="44" width="28" height="12" rx="2" fill={stroke} opacity="0.2" />
          <rect x="46" y="44" width="28" height="12" rx="2" fill={stroke} opacity="0.2" />
          <rect x="78" y="44" width="28" height="12" rx="2" fill={stroke} opacity="0.2" />
        </svg>
      );
    case "empty":
      return (
        <svg viewBox="0 0 120 60" className="size-full" aria-hidden="true">
          <circle cx="60" cy="22" r="10" fill="none" stroke={stroke} strokeOpacity="0.4" strokeDasharray="2 2" />
          <rect x="40" y="38" width="40" height="4" rx="2" fill={stroke} opacity="0.5" />
          <rect x="32" y="46" width="56" height="3" rx="1" fill={stroke} opacity="0.25" />
          <rect x="48" y="54" width="24" height="6" rx="2" fill={stroke} opacity="0.9" />
        </svg>
      );
  }
}

/**
 * Dogfood: blocks gallery uses rx-display Card + Badge,
 * "See all blocks" uses rx-forms Button (ghost).
 *
 * Visual changes:
 * - Inline SVG mockup per card sits at top, schematic layout preview
 * - Card height bumped to fit mockup + heading + description
 * - Hover intensifies the gradient halo (opacity 60 -> 100)
 */
export function BlocksGallery() {
  return (
    <section className="border-t border-border/60 bg-muted/20 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Production-ready blocks
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Compositions of multiple primitives. Install one block, get a
              wired-up screen. Variations included.
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/blocks">
              See all blocks
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => (
            <Link
              key={block.name}
              href={block.href}
              className="group block focus-visible:outline-none"
            >
              <Card className="relative h-64 justify-between gap-0 overflow-hidden py-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ring">
                <div
                  className="absolute inset-0 -z-10 opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(to bottom right, color-mix(in oklch, ${block.chart} 18%, transparent), transparent 60%)`,
                  }}
                  aria-hidden="true"
                />

                {/* Mockup region. Fixed height, accent color injected here
                    so the SVG inherits it via currentColor. */}
                <div
                  className="flex h-28 items-center justify-center border-b border-border/40 px-6 transition-colors group-hover:border-border/70"
                  style={{ color: block.chart }}
                >
                  <BlockMockup shape={block.shape} />
                </div>

                <CardHeader className="flex flex-row items-start justify-between gap-2 pt-4">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {block.category}
                  </span>
                  <Badge variant="outline" className="bg-background/80 text-[10px] backdrop-blur">
                    Coming soon
                  </Badge>
                </CardHeader>
                <CardHeader className="gap-1 pb-5">
                  <CardTitle className="text-base">{block.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {block.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
