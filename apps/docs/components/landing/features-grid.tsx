import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import { Brain, Copy, GitBranch, Sparkles } from 'lucide-react';

/**
 * Four pillars, presented the way a serious component library presents them
 * (shadcn / Radix / Fumadocs): neutral cards, a single monochrome icon in a
 * muted tile, and typography + spacing carrying the hierarchy. No per-card
 * accent colors - restraint reads as professional; the rainbow of tinted tiles
 * read as generic.
 *
 * Order leads with the design-system fundamentals (own the code, parity,
 * tokens) and closes with the AI-native pillar - one property among several,
 * not the headline.
 */
const features = [
  {
    icon: Copy,
    title: 'You own the code',
    description:
      'Install from the registry and the source is yours. No black-box dependency, no version lock. Refactor every line on your own terms.',
  },
  {
    icon: GitBranch,
    title: 'React and Angular at parity',
    description:
      'Both editions ship from the same registry with the same primitives, semantics, and tokens. One design system, two frameworks, no drift.',
  },
  {
    icon: Sparkles,
    title: 'Token-driven theming',
    description:
      'Every primitive is wired to a shared token layer. Restyle the whole system from one place, and themes carry across both frameworks.',
  },
  {
    icon: Brain,
    title: 'AI-native registry and MCP',
    description:
      'A registry and MCP server expose the system to your tools, so Claude, Cursor, and Codex generate idiomatic UI that matches what you ship.',
  },
];

/** Dogfood: each pillar is an rx-display Card. Hover is a quiet border shift. */
export function FeaturesGrid() {
  return (
    <section className="relative border-t border-border/60 bg-muted/20 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            A design system you own, end to end
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            The fundamentals of a serious component library, plus a registry and
            MCP server that make the whole system legible to your tools.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="transition-colors duration-200 hover:border-foreground/20"
            >
              <CardHeader className="gap-3">
                <div className="flex size-9 items-center justify-center rounded-md border bg-muted/50 text-muted-foreground">
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
