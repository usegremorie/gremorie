import type { Metadata } from 'next';

import { ArtifactsSpotlight } from '@/components/landing/artifacts-spotlight';
import { AssistantShowcase } from '@/components/landing/assistant-showcase';
// Hidden, not deleted: see the render list below.
// import { BlocksGallery } from '@/components/landing/blocks-gallery';
import { ComponentsShowcase } from '@/components/landing/components-showcase';
import { FeaturesGrid } from '@/components/landing/features-grid';
import { FinalCta } from '@/components/landing/final-cta';
import { Footer } from '@/components/landing/footer';
import { Hero } from '@/components/landing/hero';
import { ParityProof } from '@/components/landing/parity-proof';
import { ProofStrip } from '@/components/landing/proof-strip';
// Hidden, not deleted: see the render list below.
// import { ThemePlayground } from '@/components/landing/theme-playground';
import { i18n } from '@/lib/i18n';
import { SITE_DESCRIPTION, SITE_TITLE } from '@/lib/site';

/**
 * Public landing at `/`. Lives in the `(home)` route group, wrapped by
 * Fumadocs HomeLayout (see ./layout.tsx). The HomeLayout owns the navbar
 * (logo, primary links, search dialog, theme toggle); this page only
 * renders the landing content sections.
 *
 * The rich 3-column Footer stays inline because HomeLayout does not
 * provide a footer slot by default.
 *
 * Sections, top to bottom (home redesign order: promise, proof of the
 * main claim, product live, argument, inventory, differentiators, close):
 *   1. Hero (pill + tagline + install command + CTAs)
 *   2. Assistant showcase, the hero product shot (props / code / preview)
 *   3. Proof strip (single line of numbers)
 *   4. Parity proof (React | Angular tabs over the same Button)
 *   5. Features grid (own the code, parity, tokens, AI-native)
 *   6. Components showcase (8 categories with counts)
 *   7. Blocks gallery (5 production blocks) - currently hidden
 *   8. Artifacts spotlight (real ChartArtifact + its code)
 *   9. Theme playground (token sliders) - currently hidden
 *  10. Final CTA
 *  11. Footer (3 columns: brand / resources / community + legal)
 */
export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
};

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  // Every locale carries its prefix now (lib/i18n.ts), so the landing's own
  // links have to be built with it - a bare /components would 307 through the
  // proxy on every click.
  const { lang } = await params;

  return (
    <>
      <main id="main">
        <Hero lang={lang} />
        {/* The hero's product shot: the live Assistant workbench card sits
            centered right under the hero copy, Linear/Vercel style. */}
        <AssistantShowcase />
        <ProofStrip />
        <ParityProof lang={lang} />
        <FeaturesGrid />
        <ComponentsShowcase lang={lang} />
        {/* Blocks gallery: hidden on Kal's call, 2026-09-22. The section and
            its component are untouched - uncomment this line and the import
            above to bring it back. */}
        {/* <BlocksGallery lang={lang} /> */}
        <ArtifactsSpotlight lang={lang} />
        {/* Theme playground: hidden on Kal's call, 2026-09-22, alongside the
            blocks gallery. Both come back when we work on them again. */}
        {/* <ThemePlayground lang={lang} /> */}
        <FinalCta lang={lang} />
      </main>
      <Footer />
    </>
  );
}
