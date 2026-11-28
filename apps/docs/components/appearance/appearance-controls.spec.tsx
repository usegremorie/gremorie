// @vitest-environment jsdom
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { TooltipProvider } from '@gremorie/rx-overlays';

import { APPEARANCE_KEY } from '@/lib/appearance';
import { AppearanceControls } from './appearance-controls';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let mobile = false;

function mockMedia() {
  window.matchMedia = ((query: string) => ({
    matches: query.startsWith('(max-width') ? mobile : false,
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
}

const button = (label: string) =>
  document.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);

describe('AppearanceControls', () => {
  let host: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    mobile = false;
    mockMedia();
    localStorage.clear();
    for (const a of ['data-accent', 'data-translucency', 'data-tonal']) {
      document.documentElement.removeAttribute(a);
    }
    host = document.createElement('div');
    document.body.append(host);
    root = createRoot(host);
  });

  afterEach(() => {
    act(() => root.unmount());
    document.body.innerHTML = '';
  });

  const render = (lang = 'en') =>
    act(() =>
      root.render(
        <TooltipProvider>
          <AppearanceControls lang={lang} />
        </TooltipProvider>,
      ),
    );

  it('renders four icon buttons named for screen readers, no visible label', () => {
    render();
    for (const label of ['Accent color', 'Translucency', 'Tonal', 'Dark theme']) {
      const b = button(label);
      expect(b, label).not.toBeNull();
      expect(b!.textContent?.trim()).toBe('');
    }
  });

  it('speaks Portuguese on the pt site', () => {
    render('pt');
    for (const label of ['Cor de destaque', 'Translucidez', 'Tonal', 'Tema escuro']) {
      expect(button(label), label).not.toBeNull();
    }
  });

  it('picks an accent from a radio group and saves it', () => {
    render();
    act(() => button('Accent color')!.click());
    const radios = document.querySelectorAll('[role="radiogroup"] [role="radio"]');
    expect(radios).toHaveLength(8);
    const violet = document.querySelector<HTMLButtonElement>('[role="radio"][aria-label="Violet"]')!;
    act(() => violet.click());
    expect(document.documentElement.getAttribute('data-accent')).toBe('violet');
    expect(violet.getAttribute('aria-checked')).toBe('true');
    const saved = JSON.parse(localStorage.getItem(APPEARANCE_KEY)!) as { accent: string };
    expect(saved.accent).toBe('violet');
  });

  it('shows an illustration for each translucency option', () => {
    render();
    act(() => button('Translucency')!.click());
    const options = document.querySelectorAll('[role="radiogroup"] [role="radio"]');
    expect(options).toHaveLength(3);
    for (const o of options) expect(o.querySelector('svg')).not.toBeNull();
    act(() => (options[2] as HTMLButtonElement).click());
    expect(document.documentElement.getAttribute('data-translucency')).toBe('immersive');
  });

  it('toggles tonal as a pressed button', () => {
    render();
    const tonal = button('Tonal')!;
    expect(tonal.getAttribute('aria-pressed')).toBe('false');
    act(() => tonal.click());
    expect(button('Tonal on')!.getAttribute('aria-pressed')).toBe('true');
  });

  it('opens a popover on desktop', () => {
    render();
    act(() => button('Translucency')!.click());
    expect(document.querySelector('[data-slot="popover-content"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="drawer-content"]')).toBeNull();
  });

  it('opens a bottom drawer on a phone', () => {
    mobile = true;
    mockMedia();
    render();
    act(() => button('Translucency')!.click());
    expect(document.querySelector('[data-slot="drawer-content"]')).not.toBeNull();
    expect(document.querySelector('[data-slot="popover-content"]')).toBeNull();
  });
});
