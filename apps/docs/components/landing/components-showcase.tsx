import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Compass,
  Edit,
  Eye,
  LayoutGrid,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button } from "@gremorie/rx-forms";
import {
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gremorie/rx-display";

/**
 * Each category gets its own accent. AI gets the brand violet (it is the
 * flagship category). The rest rotate through chart-1..5 so the 2x4 grid
 * has visible rhythm without becoming a rainbow.
 */
const categories = [
  {
    name: "AI",
    count: 29,
    icon: Sparkles,
    slug: "ai",
    description:
      "Conversation, Message, PromptInput, Reasoning, Artifact, Canvas.",
    accent: "var(--brand)",
    accentSubtle: "var(--brand-subtle)",
  },
  {
    name: "Forms",
    count: 17,
    icon: Edit,
    slug: "forms",
    description: "Button, Input, Select, Checkbox, Switch, Form, Calendar.",
    accent: "var(--chart-2)",
    accentSubtle: "color-mix(in oklch, var(--chart-2) 12%, transparent)",
  },
  {
    name: "Overlays",
    count: 11,
    icon: Layers,
    slug: "overlays",
    description: "Dialog, Drawer, Sheet, Popover, Tooltip, Command.",
    accent: "var(--chart-3)",
    accentSubtle: "color-mix(in oklch, var(--chart-3) 12%, transparent)",
  },
  {
    name: "Display",
    count: 8,
    icon: Eye,
    slug: "display",
    description: "Card, Badge, Avatar, Accordion, Carousel, Table.",
    accent: "var(--chart-4)",
    accentSubtle: "color-mix(in oklch, var(--chart-4) 12%, transparent)",
  },
  {
    name: "Navigation",
    count: 6,
    icon: Compass,
    slug: "navigation",
    description: "Tabs, Sidebar, Breadcrumb, Pagination, NavigationMenu.",
    accent: "var(--chart-5)",
    accentSubtle: "color-mix(in oklch, var(--chart-5) 12%, transparent)",
  },
  {
    name: "Containers",
    count: 4,
    icon: LayoutGrid,
    slug: "containers",
    description: "ScrollArea, Stack, AspectRatio, Resizable.",
    accent: "var(--chart-1)",
    accentSubtle: "color-mix(in oklch, var(--chart-1) 12%, transparent)",
  },
  {
    name: "Feedback",
    count: 3,
    icon: Bell,
    slug: "feedback",
    description: "Alert, Progress, Skeleton.",
    accent: "var(--chart-2)",
    accentSubtle: "color-mix(in oklch, var(--chart-2) 12%, transparent)",
  },
  {
    name: "Data",
    count: 7,
    icon: BarChart3,
    slug: "data",
    description:
      "AreaChart, LineChart, BarChart, ScatterChart, PieChart, RadarChart.",
    accent: "var(--chart-3)",
    accentSubtle: "color-mix(in oklch, var(--chart-3) 12%, transparent)",
  },
];

/**
 * Dogfood: category tiles composed with rx-display Card + Badge,
 * "View all components" CTA uses rx-forms Button (ghost).
 *
 * Visual rhythm: each tile has its own accent (icon tile bg + hover border).
 * Aspect-square keeps the grid uniform and gives the cards a "tile" feel
 * vs. the previous compressed rectangle. Hover lift + the icon tile scaling
 * adds tactile feedback without being noisy.
 */
export function ComponentsShowcase() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              85 primitives across 8 categories
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Every primitive is copy-paste. Install with the CLI, own the
              source, customize with your tokens.
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/components/overview">
              View all components
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href="/components/overview"
              className="group block focus-visible:outline-none"
            >
              <Card
                className="relative h-full gap-3 overflow-hidden py-5 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ring"
                style={{
                  ["--cat-accent" as string]: cat.accent,
                  ["--cat-accent-subtle" as string]: cat.accentSubtle,
                  // Border accent 2px on the left, in the category color.
                  // Replicates the pattern from the Features grid so the 8
                  // category tiles are visually distinguishable in a static
                  // screenshot (Odo final audit - previously the accent only
                  // appeared on the icon tile, which read as monotone).
                  borderLeft: `2px solid ${cat.accent}`,
                }}
              >
                {/* Faint top-right accent halo per tile - sets it apart
                    without overpowering the description. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
                  style={{ background: "var(--cat-accent-subtle)" }}
                />

                <CardHeader className="gap-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex size-10 items-center justify-center rounded-md transition-transform duration-200 group-hover:scale-110"
                      style={{
                        background: "var(--cat-accent-subtle)",
                        color: "var(--cat-accent)",
                      }}
                    >
                      <cat.icon className="size-5" aria-hidden="true" />
                    </div>
                    <Badge variant="secondary">{cat.count}</Badge>
                  </div>
                  <CardTitle className="text-base">{cat.name}</CardTitle>
                  <CardDescription className="text-xs leading-relaxed">
                    {cat.description}
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
