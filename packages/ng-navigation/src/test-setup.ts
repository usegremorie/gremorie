import '@angular/compiler';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

// jsdom does not implement `window.matchMedia`, but `SidebarService`
// (lib/sidebar/sidebar.ts) calls it in its constructor to track the mobile
// breakpoint — without this polyfill every sidebar spec throws at TestBed
// component creation.
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

setupTestBed({ zoneless: true });
