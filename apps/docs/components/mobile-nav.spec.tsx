// @vitest-environment jsdom
import { TooltipProvider } from '@gremorie/rx-overlays';
import { HomeIcon } from 'lucide-react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a
      href={href}
      {...rest}
      onClick={(e) => {
        // next/link runs the given onClick first, then prevents the default.
        (rest as { onClick?: (e: unknown) => void }).onClick?.(e);
        e.preventDefault();
      }}
    >
      {children}
    </a>
  ),
}));

import { MobileNav } from './mobile-nav';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('MobileNav', () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    window.matchMedia = ((q: string) => ({
      matches: false,
      media: q,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
    })) as unknown as typeof window.matchMedia;
    host = document.createElement('div');
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    document.body.innerHTML = '';
  });

  it('closes the drawer when a link is chosen', async () => {
    act(() =>
      root.render(
        <TooltipProvider>
          <MobileNav
            isActive={() => false}
            label="Menu"
            links={[
              { text: 'Components', url: '/en/components', icon: HomeIcon },
            ]}
          />
        </TooltipProvider>,
      ),
    );
    act(() =>
      document
        .querySelector<HTMLButtonElement>('button[aria-label="Menu"]')!
        .click(),
    );
    const link = document.querySelector<HTMLAnchorElement>(
      'a[href="/en/components"]',
    );
    expect(link).not.toBeNull();
    act(() => link!.click());
    await act(() => new Promise((r) => setTimeout(r, 600)));
    expect(
      document.querySelector('[data-slot="drawer-content"][data-state="open"]'),
    ).toBeNull();
  });
});
