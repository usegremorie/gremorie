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
 * Order leads with the design-system fundamentals (own the code, ship to both
 * frameworks, tokens) and closes with the AI-native pillar - one strong
 * property among several, not the whole identity. The brand-violet accent
 * stays reserved for the AI-native card. The other three rotate through
 * chart-2..4 to keep the rhythm varied but coherent.
 */
const features = [
  {
    icon: Copy,
    title: 'You own the code',
    description:
      'Install from the registry and the source is yours. No black-box dependency, no version lock. Refactor every line on your own terms.',
    accent: 'var(--chart-3)',
    accentSubtle: 'color-mix(in oklch, var(--chart-3) 12%, transparent)',
  },
  {
    icon: GitBranch,
    title: 'React and Angular at parity',
    description:
      'Both editions ship from the same registry with the same primitives, semantics, and tokens. One design system, two frameworks, no drift.',
    accent: 'var(--chart-2)',
    accentSubtle: 'color-mix(in oklch, var(--chart-2) 12%, transparent)',
  },
  {
    icon: Sparkles,
    title: 'Token-driven theming',
    description:
      'Every primitive is wired to a shared token layer. Restyle the whole system from one place, and themes carry across both frameworks.',
    // chart-5 chosen over chart-4 so the icon does NOT land on violet in
    // dark mode (chart-4 dark is violet, which would clash with the AI
    // brand accent on the AI-native card).
    accent: 'var(--chart-5)',
    accentSubtle: 'color-mix(in oklch, var(--chart-5) 12%, transparent)',
  },
  {
    icon: Brain,
    title: 'AI-native registry and MCP',
    description:
      'A registry and MCP server expose the system to your tools, so Claude, Cursor, and Codex generate idiomatic UI that matches what you ship.',
    accent: 'var(--primary)',
    accentSubtle: 'color-mix(in oklch, var(--primary) 12%, transparent)',
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
            A design system you own, end to end
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            The fundamentals of a serious component library, plus a registry and
            MCP server that make the whole system legible to your tools.
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
