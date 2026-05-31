import { ArtifactsSpotlight } from "@/components/landing/artifacts-spotlight";
import { BlocksGallery } from "@/components/landing/blocks-gallery";
import { ComponentsShowcase } from "@/components/landing/components-showcase";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { StatsBand } from "@/components/landing/stats-band";
import { ThemePlayground } from "@/components/landing/theme-playground";

import type { Metadata } from "next";

import { i18n } from "@/lib/i18n";

/**
 * Public landing at `/`. Lives in the `(home)` route group, wrapped by
 * Fumadocs HomeLayout (see ./layout.tsx). The HomeLayout owns the navbar
 * (logo, primary links, search dialog, theme toggle); this page only
 * renders the landing content sections.
 *
 * The rich 3-column Footer stays inline because HomeLayout does not
 * provide a footer slot by default.
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
 *   9. Footer (3 columns: brand / resources / community + legal)
 */
export const metadata: Metadata = {
  title: "Gremorie - the AI-native design system",
  description:
    "Registry + MCP for AI-driven generation. Angular and React, copy-paste components."
};

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default function LandingPage() {
  return (
    <>
      <main id="main">
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
    </>
  );
}
