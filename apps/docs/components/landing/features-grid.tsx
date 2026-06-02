import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import { Brain, Copy, GitBranch, Sparkles } from 'lucide-react';

/**
 * Each feature gets its own accent token (chart-N) for the icon tile and
 * for the left border accent. This breaks the "wall of gray cards" criticism
 * from Odo's audit while staying 100% token-driven (no raw hex anywhere).
 *
 * The brand-violet accent is reserved for the AI-native feature (which is
 * the marquee value prop). The other three rotate through chart-2..4 to
 * keep the rhythm varied but coherent.
 */
const features = [
  {
    icon: Sparkles,
    title: 'AI-native',
    description:
      'Knowledge layer plus MCP serves the corpus to LLMs. Your design system is legible to language models, not just designers.',
    accent: 'var(--primary)',
    accentSubtle: 'color-mix(in oklch, var(--primary) 12%, transparent)',
  },
  {
    icon: GitBranch,
    title: 'Two editions',
    description:
      'Angular and React from the same registry. Same primitives, same semantics, same tokens. Shared corpus across stacks.',
    accent: 'var(--chart-2)',
    accentSubtle: 'color-mix(in oklch, var(--chart-2) 12%, transparent)',
  },
  {
    icon: Copy,
    title: 'Copy-paste',
    description:
      'Run gremorie add and the code is yours. No black-box dependency. Own every line, refactor without asking.',
    accent: 'var(--chart-3)',
    accentSubtle: 'color-mix(in oklch, var(--chart-3) 12%, transparent)',
  },
  {
    icon: Brain,
    title: 'MCP-ready',
    description:
      'Claude, Cursor, and Codex generate idiomatic UI by reading the MCP server. They build with your DS, not against it.',
    // chart-5 chosen over chart-4 so the icon does NOT land on violet in
    // dark mode (chart-4 dark is violet, which would clash with the AI
    // brand accent on the first card).
    accent: 'var(--chart-5)',
    accentSubtle: 'color-mix(in oklch, var(--chart-5) 12%, transparent)',
  },
];

/**
 * Dogfood: each feature is composed with rx-display Card primitives.
 * Visual tweaks:
 * - Left accent border (2px) per feature, color via inline CSS var
 * - Icon tile tinted with the feature's accentSubtle background
 * - Hover lift (-translate-y-0.5) plus elevated shadow
 * - Smooth transition timing tuned for tactile feel
 */
export function FeaturesGrid() {
  return (
    <section className="relative border-t border-border/60 bg-muted/20 py-20">
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
              className="group relative overflow-hidden border-l-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              style={{ borderLeftColor: feature.accent }}
            >
              <CardHeader className="gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-md transition-transform duration-200 group-hover:scale-105"
                  style={{
                    background: feature.accentSubtle,
                    color: feature.accent,
                  }}
                >
                  <feature.icon className="size-5" aria-hidden="true" />
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
