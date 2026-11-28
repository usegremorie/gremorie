import { Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { injectIsMobile } from './is-mobile';

let matches = false;
let listeners: (() => void)[] = [];
let queries: string[] = [];

describe('injectIsMobile', () => {
  beforeEach(() => {
    matches = false;
    listeners = [];
    queries = [];
    window.matchMedia = ((query: string) => {
      queries.push(query);
      return {
        get matches() {
          return matches;
        },
        media: query,
        addEventListener: (_: string, cb: () => void) => listeners.push(cb),
        removeEventListener: (_: string, cb: () => void) => {
          listeners = listeners.filter((l) => l !== cb);
        },
      };
    }) as unknown as typeof window.matchMedia;
  });

  it('follows the media query below 768px', () => {
    const isMobile = TestBed.runInInjectionContext(() => injectIsMobile());
    expect(isMobile()).toBe(false);
    expect(queries).toContain('(max-width: 767px)');
    matches = true;
    listeners.forEach((l) => l());
    expect(isMobile()).toBe(true);
  });

  it('takes a custom breakpoint', () => {
    TestBed.runInInjectionContext(() => injectIsMobile(640));
    expect(queries).toContain('(max-width: 639px)');
  });

  it('stops listening when its injector is destroyed', () => {
    const injector = Injector.create({
      providers: [],
      parent: TestBed.inject(Injector),
    }) as Injector & { destroy(): void };
    runInInjectionContext(injector, () => injectIsMobile());
    expect(listeners.length).toBe(1);
    injector.destroy();
    expect(listeners).toEqual([]);
  });
});
