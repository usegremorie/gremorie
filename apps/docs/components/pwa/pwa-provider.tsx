'use client';

import { Toaster, toast } from '@gremorie/rx-overlays';
import { SerwistProvider, useSerwist } from '@serwist/turbopack/react';
import { useEffect, type ReactNode } from 'react';

import { ThemeColorSync } from './theme-color-sync';

import { PWA_TOASTER_ID, SW_SCOPE, SW_URL } from '@/lib/pwa';

/** UI copy of the update notice, per locale (the site's small-string pattern). */
const COPY = {
  en: { title: 'New version available', action: 'Update' },
  pt: { title: 'Nova versão disponível', action: 'Atualizar' },
} as const;

type Lang = keyof typeof COPY;

const copyFor = (lang: string) => COPY[(lang in COPY ? lang : 'en') as Lang];

/**
 * Registers the service worker (production builds only: in `next dev` the
 * worker would cache code that changes on every save) and tells the reader
 * when a newer version of the site is ready.
 */
export function PwaProvider({
  lang,
  children,
}: {
  lang: string;
  children: ReactNode;
}) {
  return (
    <SerwistProvider
      swUrl={SW_URL}
      disable={process.env.NODE_ENV !== 'production'}
      // The provider would otherwise reload the page whenever the connection
      // comes back. The reader may be mid-scroll or mid-search; offline pages
      // carry their own "Try again".
      reloadOnOnline={false}
      options={{ scope: SW_SCOPE }}
    >
      {children}
      <ThemeColorSync />
      <UpdateNotice lang={lang} />
    </SerwistProvider>
  );
}

/**
 * A new worker is installed and waiting (the old one still serves this tab).
 * Show a toast that stays until the reader acts; "Update" asks the waiting
 * worker to take over and reloads once, when it does. Nothing reloads
 * without the click.
 */
function UpdateNotice({ lang }: { lang: string }) {
  const { serwist } = useSerwist();

  useEffect(() => {
    if (!serwist) return;
    const { title, action } = copyFor(lang);
    let reloading = false;

    const promptUpdate = () => {
      toast(title, {
        id: 'pwa-update',
        toasterId: PWA_TOASTER_ID,
        duration: Number.POSITIVE_INFINITY,
        action: {
          label: action,
          onClick: () => {
            navigator.serviceWorker.addEventListener('controllerchange', () => {
              if (reloading) return;
              reloading = true;
              window.location.reload();
            });
            // Same message as serwist.messageSkipWaiting(), addressed to the
            // registration's waiting worker directly so it also reaches one
            // found by the getRegistration() check below.
            void navigator.serviceWorker
              .getRegistration(SW_SCOPE)
              .then((registration) =>
                registration?.waiting?.postMessage({ type: 'SKIP_WAITING' }),
              );
          },
        },
      });
    };

    serwist.addEventListener('waiting', promptUpdate);
    // A worker that was already waiting when this tab opened (installed by
    // another tab, or before a reload) is reported by `register()` too, but
    // only if the listener above was attached in time; check directly as well.
    void navigator.serviceWorker
      .getRegistration(SW_SCOPE)
      .then((registration) => {
        if (registration?.waiting && navigator.serviceWorker.controller) {
          promptUpdate();
        }
      });
    return () => serwist.removeEventListener('waiting', promptUpdate);
  }, [serwist, lang]);

  return (
    <Toaster
      id={PWA_TOASTER_ID}
      position="bottom-right"
      // On phones the floating tab bar owns the bottom edge (the body keeps
      // pb-24 for it), so the notice sits just above it.
      mobileOffset={{
        bottom: 'calc(var(--spacing) * 24 + env(safe-area-inset-bottom))',
      }}
    />
  );
}
