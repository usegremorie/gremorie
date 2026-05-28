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

const categories = [
  {
    name: "AI",
    count: 29,
    icon: Sparkles,
    slug: "ai",
    description:
      "Conversation, Message, PromptInput, Reasoning, Artifact, Canvas.",
  },
  {
    name: "Forms",
    count: 17,
    icon: Edit,
    slug: "forms",
    description: "Button, Input, Select, Checkbox, Switch, Form, Calendar.",
  },
  {
    name: "Overlays",
    count: 11,
    icon: Layers,
    slug: "overlays",
    description: "Dialog, Drawer, Sheet, Popover, Tooltip, Command.",
  },
  {
    name: "Display",
    count: 8,
    icon: Eye,
    slug: "display",
    description: "Card, Badge, Avatar, Accordion, Carousel, Table.",
  },
  {
    name: "Navigation",
    count: 6,
    icon: Compass,
    slug: "navigation",
    description: "Tabs, Sidebar, Breadcrumb, Pagination, NavigationMenu.",
  },
  {
    name: "Containers",
    count: 4,
    icon: LayoutGrid,
    slug: "containers",
    description: "ScrollArea, Stack, AspectRatio, Resizable.",
  },
  {
    name: "Feedback",
    count: 3,
    icon: Bell,
    slug: "feedback",
    description: "Alert, Progress, Skeleton.",
  },
  {
    name: "Data",
    count: 7,
    icon: BarChart3,
    slug: "data",
    description:
      "AreaChart, LineChart, BarChart, ScatterChart, PieChart, RadarChart.",
  },
];

/**
 * Dogfood: category tiles composed with rx-display Card + Badge,
 * "View all components" CTA uses rx-forms Button (ghost).
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
              className="group block"
            >
              <Card className="h-full gap-3 py-5 transition-all group-hover:border-primary/40 group-hover:shadow-sm">
                <CardHeader className="gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                      <cat.icon className="size-4.5" aria-hidden="true" />
                    </div>
                    <Badge variant="secondary">{cat.count}</Badge>
                  </div>
                  <CardTitle className="text-sm">{cat.name}</CardTitle>
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
