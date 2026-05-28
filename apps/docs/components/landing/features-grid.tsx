import { Brain, Copy, GitBranch, Sparkles } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "AI-native",
    description:
      "Knowledge layer + MCP serves the corpus to LLMs. Your design system is legible to language models, not just designers."
  },
  {
    icon: GitBranch,
    title: "Two editions",
    description:
      "Angular and React from the same registry. Same primitives, same semantics, same tokens. Shared corpus across stacks."
  },
  {
    icon: Copy,
    title: "Copy-paste",
    description:
      "Run gremorie add <item> and the code is yours. No black-box dependency. Own every line, refactor without asking."
  },
  {
    icon: Brain,
    title: "MCP-ready",
    description:
      "Claude, Cursor, and Codex generate idiomatic UI by reading the MCP server. They build with your DS, not against it."
  }
];

export function FeaturesGrid() {
  return (
    <section className="border-t border-border/60 bg-muted/20 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Built for humans and language models
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Four properties that make Gremorie different from a classical
            component library.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col gap-3 rounded-lg border border-border bg-background p-6 transition-colors hover:border-foreground/20"
            >
              <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                <feature.icon className="size-4.5" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
