import Link from "next/link";
import { ArrowRight } from "lucide-react";

const blocks = [
  {
    name: "Sign-in",
    category: "Auth",
    description: "Email and password card with OAuth slot.",
    accent: "from-sky-500/15"
  },
  {
    name: "Dashboard",
    category: "Shell",
    description: "Sidebar + KPI grid + chart + recent activity.",
    accent: "from-violet-500/15"
  },
  {
    name: "Chat surface",
    category: "AI",
    description: "Conversation + Message + PromptInput, fully wired.",
    accent: "from-emerald-500/15"
  },
  {
    name: "Settings form",
    category: "Forms",
    description: "Multi-section form with save bar and validation.",
    accent: "from-amber-500/15"
  },
  {
    name: "Marketing hero",
    category: "Marketing",
    description: "Hero with CTA, feature grid, social proof.",
    accent: "from-rose-500/15"
  },
  {
    name: "Empty state",
    category: "Patterns",
    description: "No data, no results, error, permission denied.",
    accent: "from-fuchsia-500/15"
  }
];

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
          <Link
            href="/blocks/overview"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
          >
            See all blocks
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => (
            <Link
              key={block.name}
              href="/blocks/overview"
              className="group relative flex h-44 flex-col justify-between overflow-hidden rounded-lg border border-border bg-background p-5 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${block.accent} to-transparent opacity-60`}
                aria-hidden="true"
              />
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {block.category}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur">
                  Coming soon
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {block.name}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {block.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
