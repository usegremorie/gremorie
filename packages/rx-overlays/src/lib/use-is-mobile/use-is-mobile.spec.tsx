// @vitest-environment jsdom
import * as React from 'react';
import { act } from 'react';
import { renderToString } from 'react-dom/server';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useIsMobile } from './use-is-mobile';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let matches = false;
let listeners: (() => void)[] = [];
let queries: string[] = [];

function Probe({ breakpoint }: { breakpoint?: number }) {
  return <span>{String(useIsMobile(breakpoint))}</span>;
}

describe('useIsMobile', () => {
  let host: HTMLDivElement;
  let root: Root;

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
    host = document.createElement('div');
    root = createRoot(host);
  });

  afterEach(() => act(() => root.unmount()));

  it('follows the media query below 768px', () => {
    act(() => root.render(<Probe />));
    expect(host.textContent).toBe('false');
    expect(queries).toContain('(max-width: 767px)');
    matches = true;
    act(() => listeners.forEach((l) => l()));
    expect(host.textContent).toBe('true');
  });

  it('takes a custom breakpoint', () => {
    act(() => root.render(<Probe breakpoint={640} />));
    expect(queries).toContain('(max-width: 639px)');
  });

  it('is false on the server', () => {
    expect(renderToString(<Probe />)).toContain('false');
  });

  it('stops listening on unmount', () => {
    act(() => root.render(<Probe />));
    act(() => root.unmount());
    expect(listeners).toEqual([]);
    root = createRoot(host);
  });
});
