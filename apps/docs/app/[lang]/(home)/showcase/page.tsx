import type { Metadata } from 'next';

import { Footer } from '@/components/landing/footer';
import { ShowcaseGrid } from '@/components/showcase-grid';
import { i18n } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Showcase',
  description:
    'Product screens built only with Gremorie components, the same in React and Angular.',
};

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

/** Public showcase at `/showcase`: the workbench showcase cards, live. */
export default function ShowcasePage() {
  return (
    <>
      <main
        className="mx-auto w-full max-w-[1600px] px-4 pt-12 pb-16 sm:px-6 lg:px-10"
        id="main"
      >
        <header className="mb-10 max-w-2xl">
          <h1 className="font-semibold text-3xl tracking-tight">Showcase</h1>
          <p className="mt-3 text-muted-foreground">
            Product screens built only with Gremorie components. Every control
            here is live.
          </p>
        </header>
        <ShowcaseGrid />
      </main>
      <Footer />
    </>
  );
}
