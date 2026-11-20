import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  FeaturedIcon,
} from '@gremorie/rx-display';
import { Brain, Copy, GitBranch, Sparkles } from 'lucide-react';

/**
 * Four pillars, presented the way a serious component library presents them:
 * neutral cards, a single monochrome DS
 * FeaturedIcon, and typography + spacing carrying the hierarchy. No per-card
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
    <section className="relative border-t border-border/60 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            A design system you own, end to end
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            The fundamentals of a serious component library, and a registry that
            machines can read.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            // DS card pattern: featured icon (48 = title 24 + 4 + description
            // 20), then the header as the Card ships it. Not clickable, so no
            // hover state.
            <Card key={feature.title}>
              <CardHeader>
                <FeaturedIcon
                  className="mb-5"
                  color="gray"
                  icon={feature.icon}
                  size="lg"
                  theme="light"
                />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
