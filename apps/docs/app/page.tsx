import type { Metadata } from "next";

import { ArtifactsSpotlight } from "@/components/landing/artifacts-spotlight";
import { BlocksGallery } from "@/components/landing/blocks-gallery";
import { ComponentsShowcase } from "@/components/landing/components-showcase";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { StatsBand } from "@/components/landing/stats-band";
import { ThemePlayground } from "@/components/landing/theme-playground";

/**
 * Standalone landing at `/`. Lives outside the (docs) route group, so
 * it does NOT render the DocsLayout sidebar. Has its own light header
 * and minimal footer.
 *
 * Sections, top to bottom:
 *   1. Hero (tagline + CTAs + live chat demo)
 *   2. Features grid (AI-native, Two editions, Copy-paste, MCP-ready)
 *   3. Components showcase (8 categories with counts)
 *   4. Blocks gallery (6 destacked blocks, placeholder)
 *   5. Artifacts spotlight (Chart + Code artifacts)
 *   6. Theme playground (Tweakcn-style sliders)
 *   7. Stats band (primitives, categories, corpus, MCP, MIT)
 *   8. Final CTA (Get Started + docs + GitHub)
 *   9. Footer
 */
export const metadata: Metadata = {
  title: "Gremorie — the AI-native design system",
  description:
    "Registry + MCP for AI-driven generation. Angular and React, copy-paste components."
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturesGrid />
        <ComponentsShowcase />
        <BlocksGallery />
        <ArtifactsSpotlight />
        <ThemePlayground />
        <StatsBand />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
