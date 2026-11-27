import {
  Badge,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  FeaturedIcon,
} from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
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
} from 'lucide-react';
import Link from 'next/link';

/** The eight component categories, with a representative sample of each. */
const categories = [
  {
    name: 'AI',
    count: 23,
    icon: Sparkles,
    slug: 'ai',
    description:
      'Conversation, Message, PromptInput, Reasoning, Artifact, Tool.',
  },
  {
    name: 'Forms',
    count: 17,
    icon: Edit,
    slug: 'forms',
    description: 'Button, Input, Select, Checkbox, Switch, Form, Calendar.',
  },
  {
    name: 'Overlays',
    count: 11,
    icon: Layers,
    slug: 'overlays',
    description: 'Dialog, Drawer, Sheet, Popover, Tooltip, Command.',
  },
  {
    name: 'Display',
    count: 10,
    icon: Eye,
    slug: 'display',
    description: 'Card, Badge, Avatar, Accordion, Carousel, Table, Item.',
  },
  {
    name: 'Navigation',
    count: 6,
    icon: Compass,
    slug: 'navigation',
    description: 'Tabs, Sidebar, Breadcrumb, Pagination, NavigationMenu.',
  },
  {
    name: 'Containers',
    count: 4,
    icon: LayoutGrid,
    slug: 'containers',
    description: 'ScrollArea, Stack, AspectRatio, Resizable.',
  },
  {
    name: 'Feedback',
    count: 4,
    icon: Bell,
    slug: 'feedback',
    description: 'Alert, Progress, Skeleton, Spinner.',
  },
  {
    name: 'Data',
    count: 8,
    icon: BarChart3,
    slug: 'data',
    description:
      'AreaChart, LineChart, BarChart, ScatterChart, PieChart, RadarChart, RadialChart.',
  },
];

/**
 * Dogfood: category tiles composed with rx-display Card + Badge; the "View all"
 * CTA is an rx-forms Button. Neutral tiles, monochrome icons, a count Badge -
 * the catalog reads like a reference, not a marketing grid. Hover is a quiet
 * border shift.
 */
export function ComponentsShowcase({ lang }: { lang: string }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              83 primitives across 8 categories
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              From buttons to charts to a full conversation surface. Install
              from the registry, own the source, customize with your tokens.
            </p>
          </div>
          <Button variant="secondary" asChild>
            <Link href={`/${lang}/components`}>
              View all components
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${lang}/components`}
              className="group block focus-visible:outline-none"
            >
              {/* DS card pattern (as the features grid): featured icon and the
                  count, then the header as the Card ships it. Clickable, so
                  the ring answers hover and focus. */}
              <Card className="h-full transition-[color,box-shadow] duration-200 group-hover:ring-ring/50 group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-ring">
                <CardHeader>
                  <div className="mb-5 flex items-start justify-between">
                    <FeaturedIcon
                      color="gray"
                      icon={cat.icon}
                      size="lg"
                      theme="light"
                    />
                    <Badge variant="secondary">{cat.count}</Badge>
                  </div>
                  <CardTitle>{cat.name}</CardTitle>
                  <CardDescription>{cat.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
