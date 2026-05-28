import { Brain, Copy, GitBranch, Sparkles } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@gremorie/rx-display";

const features = [
  {
    icon: Sparkles,
    title: "AI-native",
    description:
      "Knowledge layer + MCP serves the corpus to LLMs. Your design system is legible to language models, not just designers.",
  },
  {
    icon: GitBranch,
    title: "Two editions",
    description:
      "Angular and React from the same registry. Same primitives, same semantics, same tokens. Shared corpus across stacks.",
  },
  {
    icon: Copy,
    title: "Copy-paste",
    description:
      "Run gremorie add <item> and the code is yours. No black-box dependency. Own every line, refactor without asking.",
  },
  {
    icon: Brain,
    title: "MCP-ready",
    description:
      "Claude, Cursor, and Codex generate idiomatic UI by reading the MCP server. They build with your DS, not against it.",
  },
];

/**
 * Dogfood: each feature is composed with rx-display Card primitives.
 */
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
            <Card
              key={feature.title}
              className="transition-colors hover:border-foreground/20"
            >
              <CardHeader className="gap-3">
                <div className="flex size-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <feature.icon className="size-4.5" aria-hidden="true" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
