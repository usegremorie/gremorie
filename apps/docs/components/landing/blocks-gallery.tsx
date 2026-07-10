import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

type BlockShape = 'sign-in' | 'dashboard' | 'chat' | 'settings' | 'empty';

/**
 * Each block has a `shape` slot driving a small inline SVG mockup that previews
 * the layout. Mockups are intentionally low-detail (rectangles + circles) so
 * they read as schematic, not as final UI - and they render monochrome (the
 * muted-foreground token) so the gallery stays neutral and professional rather
 * than a rainbow of tinted cards.
 */
const blocks: ReadonlyArray<{
  name: string;
  category: string;
  description: string;
  href: string;
  shape: BlockShape;
}> = [
  {
    name: 'Sign-in',
    category: 'Auth',
    description: 'Email and password card with OAuth slot.',
    href: '/blocks/sign-in',
    shape: 'sign-in',
  },
  {
    name: 'Dashboard',
    category: 'Shell',
    description: 'Sidebar plus KPI grid plus chart plus recent activity.',
    href: '/blocks/dashboard',
    shape: 'dashboard',
  },
  {
    name: 'Assistant',
    category: 'AI',
    description: 'Conversation, reasoning, artifact, sources + a B2B composer.',
    href: '/blocks/assistant',
    shape: 'chat',
  },
  {
    name: 'Settings form',
    category: 'Forms',
    description: 'Multi-section form with save bar and validation.',
    href: '/blocks/settings-form',
    shape: 'settings',
  },
  {
    name: 'Empty state',
    category: 'Patterns',
    description: 'No data, no results, error, permission denied.',
    href: '/blocks/empty-state',
    shape: 'empty',
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
  const stroke = 'currentColor';
  switch (shape) {
    case 'sign-in':
      return (
        <svg viewBox="0 0 120 60" className="size-full" aria-hidden="true">
          <rect
            x="20"
            y="10"
            width="80"
            height="6"
            rx="2"
            fill={stroke}
            opacity="0.25"
          />
          <rect
            x="20"
            y="22"
            width="80"
            height="8"
            rx="2"
            fill="none"
            stroke={stroke}
            strokeOpacity="0.5"
          />
          <rect
            x="20"
            y="34"
            width="80"
            height="8"
            rx="2"
            fill="none"
            stroke={stroke}
            strokeOpacity="0.5"
          />
          <rect
            x="20"
            y="46"
            width="80"
            height="8"
            rx="2"
            fill={stroke}
            opacity="0.9"
          />
        </svg>
      );
    case 'dashboard':
      return (
        <svg viewBox="0 0 120 60" className="size-full" aria-hidden="true">
          <rect
            x="2"
            y="2"
            width="20"
            height="56"
            rx="2"
            fill={stroke}
            opacity="0.15"
          />
          <rect
            x="28"
            y="2"
            width="20"
            height="18"
            rx="2"
            fill={stroke}
            opacity="0.5"
          />
          <rect
            x="52"
            y="2"
            width="20"
            height="18"
            rx="2"
            fill={stroke}
            opacity="0.5"
          />
          <rect
            x="76"
            y="2"
            width="20"
            height="18"
            rx="2"
            fill={stroke}
            opacity="0.5"
          />
          <rect
            x="100"
            y="2"
            width="18"
            height="18"
            rx="2"
            fill={stroke}
            opacity="0.5"
          />
          <rect
            x="28"
            y="26"
            width="90"
            height="32"
            rx="2"
            fill="none"
            stroke={stroke}
            strokeOpacity="0.6"
          />
          <polyline
            points="32,52 42,42 52,46 62,36 72,40 82,30 92,34 102,28 112,32"
            fill="none"
            stroke={stroke}
            strokeOpacity="0.9"
            strokeWidth="1.5"
          />
        </svg>
      );
    case 'chat':
      return (
        <svg viewBox="0 0 120 60" className="size-full" aria-hidden="true">
          <rect
            x="60"
            y="6"
            width="50"
            height="10"
            rx="5"
            fill={stroke}
            opacity="0.7"
          />
          <rect
            x="10"
            y="22"
            width="65"
            height="10"
            rx="5"
            fill="none"
            stroke={stroke}
            strokeOpacity="0.5"
          />
          <rect
            x="10"
            y="36"
            width="45"
            height="6"
            rx="3"
            fill="none"
            stroke={stroke}
            strokeOpacity="0.4"
          />
          <rect
            x="10"
            y="48"
            width="100"
            height="8"
            rx="2"
            fill={stroke}
            opacity="0.2"
          />
          <circle cx="105" cy="52" r="3" fill={stroke} opacity="0.9" />
        </svg>
      );
    case 'settings':
      return (
        <svg viewBox="0 0 120 60" className="size-full" aria-hidden="true">
          <rect
            x="10"
            y="8"
            width="40"
            height="4"
            rx="2"
            fill={stroke}
            opacity="0.7"
          />
          <rect
            x="10"
            y="16"
            width="100"
            height="6"
            rx="2"
            fill="none"
            stroke={stroke}
            strokeOpacity="0.4"
          />
          <rect
            x="10"
            y="26"
            width="40"
            height="4"
            rx="2"
            fill={stroke}
            opacity="0.7"
          />
          <rect
            x="10"
            y="34"
            width="100"
            height="6"
            rx="2"
            fill="none"
            stroke={stroke}
            strokeOpacity="0.4"
          />
          <rect
            x="80"
            y="46"
            width="30"
            height="8"
            rx="2"
            fill={stroke}
            opacity="0.9"
          />
        </svg>
      );
    case 'empty':
      return (
        <svg viewBox="0 0 120 60" className="size-full" aria-hidden="true">
          <circle
            cx="60"
            cy="22"
            r="10"
            fill="none"
            stroke={stroke}
            strokeOpacity="0.4"
            strokeDasharray="2 2"
          />
          <rect
            x="40"
            y="38"
            width="40"
            height="4"
            rx="2"
            fill={stroke}
            opacity="0.5"
          />
          <rect
            x="32"
            y="46"
            width="56"
            height="3"
            rx="1"
            fill={stroke}
            opacity="0.25"
          />
          <rect
            x="48"
            y="54"
            width="24"
            height="6"
            rx="2"
            fill={stroke}
            opacity="0.9"
          />
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
              Blocks, not just primitives
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Whole screens composed from the primitives. Install one block and
              get a wired-up layout, variations included, in either framework.
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
              <Card className="h-64 justify-between gap-0 overflow-hidden py-0 transition-colors duration-200 group-hover:border-foreground/20 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ring">
                {/* Schematic preview - monochrome (muted-foreground via
                    currentColor) on a subtle muted frame. */}
                <div className="flex h-28 items-center justify-center border-b bg-muted/30 px-6 text-muted-foreground">
                  <BlockMockup shape={block.shape} />
                </div>

                <CardHeader className="gap-1 pt-4 pb-5">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {block.category}
                  </span>
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
