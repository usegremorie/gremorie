import { FeaturedIcon } from '@gremorie/rx-display';
import { Button } from '@gremorie/rx-forms';
import { WifiOffIcon } from 'lucide-react';
import Link from 'next/link';

import type { Metadata } from 'next';

import { OfflineRetry } from '@/components/pwa/offline-retry';
import { i18n } from '@/lib/i18n';

/**
 * The page the service worker answers with when a page is requested offline
 * and was never visited (visited pages come back from the cache). Precached
 * at install, so it is always there; see app/sw.ts. It is served at the URL
 * that was asked for, so "Try again" is a plain reload.
 */

const COPY = {
  en: {
    title: 'You are offline',
    body: 'This page has not been saved for offline reading yet. Pages you have opened before still work. Check your connection and try again.',
    retry: 'Try again',
    home: 'Go to home',
  },
  pt: {
    title: 'Você está offline',
    body: 'Esta página ainda não foi salva para leitura offline. As páginas que você já abriu continuam disponíveis. Verifique sua conexão e tente de novo.',
    retry: 'Tentar de novo',
    home: 'Ir para o início',
  },
} as const;

const copyFor = (lang: string) =>
  COPY[(lang in COPY ? lang : 'en') as keyof typeof COPY];

export const metadata: Metadata = {
  title: 'Offline',
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function OfflinePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const copy = copyFor(lang);

  return (
    <main
      className="flex flex-1 items-center justify-center bg-background px-6 py-24"
      id="main"
    >
      <div className="flex max-w-md flex-col items-center gap-6 text-center">
        <FeaturedIcon color="gray" icon={WifiOffIcon} size="lg" theme="light" />
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-foreground">
            {copy.title}
          </h1>
          <p className="text-muted-foreground">{copy.body}</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <OfflineRetry label={copy.retry} />
          <Button asChild variant="outline">
            <Link href={`/${lang}`}>{copy.home}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
