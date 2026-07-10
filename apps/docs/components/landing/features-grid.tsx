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
      'Install from the registry and the source lands in your repo. No black box, no version lock. Refactor every line.',
  },
  {
    icon: GitBranch,
    title: 'Parity, enforced',
    description:
      'React and Angular editions share anatomy, props, and tokens. A contract lint keeps them from drifting apart.',
  },
  {
    icon: Sparkles,
    title: 'Token-driven theming',
    description:
      'Every primitive reads from a three-layer token system. Change one layer, retheme both frameworks.',
  },
  {
    icon: Brain,
    title: 'AI-native by design',
    description:
      'The registry and MCP server make the system legible to Claude, Cursor, and Codex, so generated UI matches shipped UI.',
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
            The fundamentals of a serious component library, and a registry that
            machines can read.
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
