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
  Sparkles
} from "lucide-react";

const categories = [
  {
    name: "AI",
    count: 29,
    icon: Sparkles,
    slug: "ai",
    description:
      "Conversation, Message, PromptInput, Reasoning, Artifact, Canvas."
  },
  {
    name: "Forms",
    count: 17,
    icon: Edit,
    slug: "forms",
    description: "Button, Input, Select, Checkbox, Switch, Form, Calendar."
  },
  {
    name: "Overlays",
    count: 11,
    icon: Layers,
    slug: "overlays",
    description: "Dialog, Drawer, Sheet, Popover, Tooltip, Command."
  },
  {
    name: "Display",
    count: 8,
    icon: Eye,
    slug: "display",
    description: "Card, Badge, Avatar, Accordion, Carousel, Table."
  },
  {
    name: "Navigation",
    count: 6,
    icon: Compass,
    slug: "navigation",
    description: "Tabs, Sidebar, Breadcrumb, Pagination, NavigationMenu."
  },
  {
    name: "Containers",
    count: 4,
    icon: LayoutGrid,
    slug: "containers",
    description: "ScrollArea, Stack, AspectRatio, Resizable."
  },
  {
    name: "Feedback",
    count: 3,
    icon: Bell,
    slug: "feedback",
    description: "Alert, Progress, Skeleton."
  },
  {
    name: "Data",
    count: 7,
    icon: BarChart3,
    slug: "data",
    description:
      "AreaChart, LineChart, BarChart, ScatterChart, PieChart, RadarChart."
  }
];

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
          <Link
            href="/components/overview"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            View all components
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href="/components/overview"
              className="group flex flex-col gap-3 rounded-lg border border-border bg-background p-5 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-9 items-center justify-center rounded-md bg-muted text-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <cat.icon className="size-4.5" aria-hidden="true" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">
                  {cat.count}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
