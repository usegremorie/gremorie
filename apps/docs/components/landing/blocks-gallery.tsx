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

const blocks = [
  {
    name: "Sign-in",
    category: "Auth",
    description: "Email and password card with OAuth slot.",
    accent: "from-sky-500/15",
  },
  {
    name: "Dashboard",
    category: "Shell",
    description: "Sidebar + KPI grid + chart + recent activity.",
    accent: "from-violet-500/15",
  },
  {
    name: "Chat surface",
    category: "AI",
    description: "Conversation + Message + PromptInput, fully wired.",
    accent: "from-emerald-500/15",
  },
  {
    name: "Settings form",
    category: "Forms",
    description: "Multi-section form with save bar and validation.",
    accent: "from-amber-500/15",
  },
  {
    name: "Marketing hero",
    category: "Marketing",
    description: "Hero with CTA, feature grid, social proof.",
    accent: "from-rose-500/15",
  },
  {
    name: "Empty state",
    category: "Patterns",
    description: "No data, no results, error, permission denied.",
    accent: "from-fuchsia-500/15",
  },
];

/**
 * Dogfood: blocks gallery uses rx-display Card + Badge,
 * "See all blocks" uses rx-forms Button (ghost).
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
              Compositions of N primitives. Install one block, get a
              wired-up screen. Variations included.
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/blocks/overview">
              See all blocks
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => (
            <Link
              key={block.name}
              href="/blocks/overview"
              className="group block"
            >
              <Card className="relative h-44 justify-between gap-0 overflow-hidden py-5 transition-all group-hover:border-primary/40 group-hover:shadow-sm">
                <div
                  className={`absolute inset-0 -z-10 bg-gradient-to-br ${block.accent} to-transparent opacity-60`}
                  aria-hidden="true"
                />
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {block.category}
                  </span>
                  <Badge variant="outline" className="bg-background/80 text-[10px] backdrop-blur">
                    Coming soon
                  </Badge>
                </CardHeader>
                <CardHeader className="gap-1">
                  <CardTitle className="text-lg">{block.name}</CardTitle>
                  <CardDescription>{block.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
