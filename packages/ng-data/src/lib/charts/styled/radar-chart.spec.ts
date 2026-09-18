import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RadarChart } from './radar-chart';
import type { ChartConfig, ChartDatum } from '../headless/types';

const DATA: ChartDatum[] = [
  { metric: 'Speed', sales: 120, profit: 90 },
  { metric: 'Quality', sales: 98, profit: 130 },
  { metric: 'Comfort', sales: 86, profit: 70 },
];
const CONFIG: ChartConfig = {
  sales: { label: 'Sales', color: 'var(--chart-1)' },
  profit: { label: 'Profit', color: 'var(--chart-2)' },
};

async function render() {
  const fixture = TestBed.createComponent(RadarChart);
  fixture.componentRef.setInput('data', DATA);
  fixture.componentRef.setInput('config', CONFIG);
  fixture.componentRef.setInput('xKey', 'metric');
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

const SIZE = 300;

/**
 * jsdom has no layout, so the chart frame would measure 0x0 and every pointer
 * would fall outside the radius. Stub the box for the whole element tree, and
 * before the component initialises — the frame measures once on init.
 */
function stubLayout(): () => void {
  const original = Element.prototype.getBoundingClientRect;
  Element.prototype.getBoundingClientRect = function (): DOMRect {
    return {
      x: 0,
      y: 0,
      left: 0,
      top: 0,
      right: SIZE,
      bottom: SIZE,
      width: SIZE,
      height: SIZE,
      toJSON: () => ({}),
    } as DOMRect;
  };
  return () => {
    Element.prototype.getBoundingClientRect = original;
  };
}

/** jsdom ships no PointerEvent; the handler only reads clientX/clientY. */
function pointerAt(clientX: number, clientY: number): MouseEvent {
  return new MouseEvent('pointermove', { clientX, clientY, bubbles: true });
}

describe('RadarChart', () => {
  it('exposes role=img with a label built from series + an a11y data table', async () => {
    const fixture = await render();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toContain('Sales');
    const rows = host.querySelectorAll('table tbody tr');
    expect(rows.length).toBe(DATA.length);
  });

  it('renders one radar group per configured series', async () => {
    const fixture = await render();
    const groups = fixture.nativeElement.querySelectorAll(
      'g[data-slot="radar"]',
    );
    expect(groups.length).toBe(2);
  });

  it('activates a spoke from anywhere in its wedge, not just at the vertex', async () => {
    const restore = stubLayout();
    try {
      const fixture = await render();
      const svg = fixture.nativeElement.querySelector('svg') as SVGSVGElement;

      // 20 degrees round from the first spoke, halfway out: well off the
      // vertex, but inside the wedge. The old per-spoke hit target, which the
      // series polygons painted over, would have missed this entirely.
      const angle = (20 * Math.PI) / 180;
      const r = 60;
      svg.dispatchEvent(
        pointerAt(
          SIZE / 2 + r * Math.sin(angle),
          SIZE / 2 - r * Math.cos(angle),
        ),
      );
      fixture.detectChanges();

      expect(fixture.componentInstance.active()).toBe(0);
      expect(fixture.componentInstance.activeLabel()).toBe('Speed');
    } finally {
      restore();
    }
  });

  it('drops the active spoke once the pointer leaves the outer radius', async () => {
    const restore = stubLayout();
    try {
      const fixture = await render();
      const svg = fixture.nativeElement.querySelector('svg') as SVGSVGElement;

      svg.dispatchEvent(pointerAt(SIZE / 2, SIZE / 2 - 60));
      fixture.detectChanges();
      expect(fixture.componentInstance.active()).toBe(0);

      // top edge: past the padded outer radius
      svg.dispatchEvent(pointerAt(SIZE / 2, 0));
      fixture.detectChanges();
      expect(fixture.componentInstance.active()).toBeNull();
    } finally {
      restore();
    }
  });

  it('marks the active point on every series with a dot', async () => {
    const restore = stubLayout();
    try {
      const fixture = await render();
      const host = fixture.nativeElement as HTMLElement;
      const svg = host.querySelector('svg') as SVGSVGElement;
      const dots = () =>
        host.querySelectorAll('[data-slot="radar-active-dot"]').length;

      expect(dots()).toBe(0);

      svg.dispatchEvent(pointerAt(SIZE / 2, SIZE / 2 - 60));
      fixture.detectChanges();
      expect(dots()).toBe(2); // one per configured series

      svg.dispatchEvent(new MouseEvent('pointerleave', { bubbles: false }));
      fixture.detectChanges();
      expect(dots()).toBe(0);
    } finally {
      restore();
    }
  });

  describe('fill', () => {
    // The grid rings live in the same <g> and also carry a stroke, so select the
    // series polygon by its own slot rather than by attribute presence.
    const seriesPath = (f: { nativeElement: HTMLElement }) =>
      f.nativeElement.querySelector(
        '[data-slot="radar-polygon"]',
      ) as SVGPathElement;

    const SINGLE: ChartConfig = { sales: { label: 'Sales' } };

    it('auto outlines two or more series', async () => {
      const f = await render();
      const path = seriesPath(f);
      expect(path.getAttribute('fill-opacity')).toBe('0');
      expect(path.getAttribute('stroke-width')).toBe('2');
    });

    it('auto fills a lone series and drops the stroke', async () => {
      const f = TestBed.createComponent(RadarChart);
      f.componentRef.setInput('data', DATA);
      f.componentRef.setInput('config', SINGLE);
      f.componentRef.setInput('xKey', 'metric');
      f.detectChanges();
      await f.whenStable();
      f.detectChanges();

      const path = seriesPath(f);
      expect(path.getAttribute('fill-opacity')).toBe('0.6');
      expect(path.getAttribute('stroke-width')).toBe('0');
    });

    it('on forces a fill past one series, lightened so the stack stays readable', async () => {
      const f = await render();
      f.componentRef.setInput('fill', 'on');
      f.detectChanges();

      const path = seriesPath(f);
      expect(path.getAttribute('fill-opacity')).toBe('0.2');
      expect(path.getAttribute('stroke-width')).toBe('2');
    });

    it('off strips the fill from a lone series', async () => {
      const f = TestBed.createComponent(RadarChart);
      f.componentRef.setInput('data', DATA);
      f.componentRef.setInput('config', SINGLE);
      f.componentRef.setInput('xKey', 'metric');
      f.componentRef.setInput('fill', 'off');
      f.detectChanges();
      await f.whenStable();
      f.detectChanges();

      const path = seriesPath(f);
      expect(path.getAttribute('fill-opacity')).toBe('0');
      expect(path.getAttribute('stroke-width')).toBe('2');
    });
  });

  describe('gaps in the data', () => {
    // recharts' computeRadarPoints maps a nullish value to radius 0 and keeps
    // the vertex, so the polygon stays closed and dips to the centre on that
    // spoke. Anything that is not a finite number has to land there too:
    // `Number(undefined)` is NaN, and a single NaN turns the whole `d` into an
    // invalid path that the browser refuses to draw.
    const GAPPY: ChartDatum[] = [
      { metric: 'a', v: 10 },
      { metric: 'b' }, // key missing entirely
      { metric: 'c', v: 30 },
      { metric: 'd', v: null as unknown as number },
      { metric: 'e', v: 'not a number' as unknown as number },
    ];

    async function renderGappy() {
      const f = TestBed.createComponent(RadarChart);
      f.componentRef.setInput('data', GAPPY);
      f.componentRef.setInput('config', { v: { label: 'V' } } as ChartConfig);
      f.componentRef.setInput('xKey', 'metric');
      f.detectChanges();
      await f.whenStable();
      f.detectChanges();
      return f;
    }

    it('never emits NaN into the path', async () => {
      const f = await renderGappy();
      const d = f.nativeElement
        .querySelector('[data-slot="radar-polygon"]')
        ?.getAttribute('d');
      expect(d).toBeTruthy();
      expect(d).not.toContain('NaN');
    });

    it('keeps one vertex per row so the polygon stays closed', async () => {
      const f = await renderGappy();
      const d: string = f.nativeElement
        .querySelector('[data-slot="radar-polygon"]')
        .getAttribute('d');
      // M<p>L<p>L<p>... Z — one point per row
      expect(d.endsWith('Z')).toBe(true);
      expect(d.replace(/[MZ]/g, '').split('L').length).toBe(GAPPY.length);
    });
  });

  describe('legend icon', () => {
    it('draws a swatch when the series has no icon', async () => {
      const f = await render();
      const host = f.nativeElement as HTMLElement;
      expect(
        host.querySelectorAll('[data-slot="chart-legend-swatch"]').length,
      ).toBe(2);
      expect(host.querySelector('[data-slot="chart-legend-icon"]')).toBeNull();
    });

    it('draws the series icon in place of the swatch, tinted with its colour', async () => {
      @Component({
        standalone: true,
        template: '<svg data-testid="mark"></svg>',
      })
      class Mark {}

      const f = TestBed.createComponent(RadarChart);
      f.componentRef.setInput('data', DATA);
      f.componentRef.setInput('config', {
        sales: { label: 'Sales', color: 'var(--chart-1)', icon: Mark },
        profit: { label: 'Profit', color: 'var(--chart-2)' },
      } as ChartConfig);
      f.componentRef.setInput('xKey', 'metric');
      f.detectChanges();
      await f.whenStable();
      f.detectChanges();

      const host = f.nativeElement as HTMLElement;
      const slot = host.querySelector(
        '[data-slot="chart-legend-icon"]',
      ) as HTMLElement;
      expect(slot).toBeTruthy();
      // rendered INSIDE the colour context, not beside it: ViewContainerRef
      // inserts a created component as a sibling of its anchor, so the anchor
      // has to live inside the span.
      expect(slot.querySelector('[data-testid="mark"]')).toBeTruthy();
      // The colour itself is not asserted here: jsdom's CSSOM rejects `var(...)`
      // values outright, so `style.color` reads empty for the icon and for the
      // pre-existing swatch alike. Testing it would test jsdom.
      // the series without an icon keeps its swatch
      expect(
        host.querySelectorAll('[data-slot="chart-legend-swatch"]').length,
      ).toBe(1);
    });
  });

  describe('dots', () => {
    const fixedDots = (f: { nativeElement: HTMLElement }) =>
      f.nativeElement.querySelectorAll('[data-slot="radar-dot"]');
    const activeDots = (f: { nativeElement: HTMLElement }) =>
      f.nativeElement.querySelectorAll('[data-slot="radar-active-dot"]');

    it('draws none by default', async () => {
      const f = await render();
      expect(fixedDots(f).length).toBe(0);
    });

    it('draws one per vertex per series when turned on', async () => {
      const f = await render();
      f.componentRef.setInput('dots', true);
      f.detectChanges();
      // 2 series x 6 rows
      expect(fixedDots(f).length).toBe(2 * DATA.length);
    });

    it('gives the hovered spoke a larger dot, so it reads as growing', async () => {
      const restore = stubLayout();
      try {
        const f = await render();
        f.componentRef.setInput('dots', true);
        f.detectChanges();

        const svg = f.nativeElement.querySelector('svg') as SVGSVGElement;
        svg.dispatchEvent(pointerAt(SIZE / 2, SIZE / 2 - 60));
        f.detectChanges();

        const fixed = fixedDots(f)[0];
        const active = activeDots(f)[0];
        expect(active).toBeTruthy();
        const fixedR = Number(fixed.getAttribute('r'));
        const activeR = Number(active.getAttribute('r'));
        expect(activeR).toBeGreaterThan(fixedR);
      } finally {
        restore();
      }
    });

    it('still marks the active spoke when fixed dots are off', async () => {
      const restore = stubLayout();
      try {
        const f = await render();
        const svg = f.nativeElement.querySelector('svg') as SVGSVGElement;
        svg.dispatchEvent(pointerAt(SIZE / 2, SIZE / 2 - 60));
        f.detectChanges();
        expect(fixedDots(f).length).toBe(0);
        expect(activeDots(f).length).toBe(2);
      } finally {
        restore();
      }
    });
  });

  describe('radius axis', () => {
    const rings = (f: { nativeElement: HTMLElement }) =>
      f.nativeElement.querySelectorAll(
        'g[data-slot="radar"] path[fill="none"]',
      );
    const tickLabels = (f: { nativeElement: HTMLElement }) =>
      [...f.nativeElement.querySelectorAll('[data-slot="radar-radius-tick"]')]
        .map((t) => t.textContent?.trim())
        .filter(Boolean);

    it('draws four rings by default', async () => {
      const restore = stubLayout();
      try {
        const f = await render();
        // rings are shared, rendered once for the first series
        expect(rings(f).length).toBe(4);
      } finally {
        restore();
      }
    });

    it('draws as many rings as `ticks` asks for', async () => {
      const restore = stubLayout();
      try {
        const f = await render();
        f.componentRef.setInput('ticks', 10);
        f.detectChanges();
        expect(rings(f).length).toBe(10);
      } finally {
        restore();
      }
    });

    it('labels 0-100 in tens — the competency-review case', async () => {
      const restore = stubLayout();
      try {
        const f = await render();
        f.componentRef.setInput('max', 100);
        f.componentRef.setInput('ticks', 10);
        f.componentRef.setInput('radiusAxis', true);
        f.detectChanges();

        expect(tickLabels(f)).toEqual(
          [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((n) =>
            n.toLocaleString(),
          ),
        );
      } finally {
        restore();
      }
    });

    it('stays silent unless asked', async () => {
      const restore = stubLayout();
      try {
        const f = await render();
        f.componentRef.setInput('max', 100);
        f.detectChanges();
        expect(tickLabels(f).length).toBe(0);
      } finally {
        restore();
      }
    });

    it('pins the geometry to the domain, so two charts stay comparable', async () => {
      const restore = stubLayout();
      try {
        // Same shape of data, different magnitudes. Pinned to [0, 100] the
        // smaller one must NOT reach as far as the larger one.
        const low: ChartDatum[] = DATA.map((r) => ({ ...r, sales: 50 }));
        const high: ChartDatum[] = DATA.map((r) => ({ ...r, sales: 100 }));
        const radiusOf = async (data: ChartDatum[]) => {
          const f = TestBed.createComponent(RadarChart);
          f.componentRef.setInput('data', data);
          f.componentRef.setInput('config', {
            sales: { label: 'Sales' },
          } as ChartConfig);
          f.componentRef.setInput('xKey', 'metric');
          f.componentRef.setInput('max', 100);
          f.detectChanges();
          await f.whenStable();
          f.detectChanges();
          const d = f.nativeElement
            .querySelector('[data-slot="radar-polygon"]')
            .getAttribute('d') as string;
          // distance of the first vertex from the centre
          const [x, y] = d.slice(1).split('L')[0].split(',').map(Number);
          return Math.hypot(x - SIZE / 2, y - SIZE / 2);
        };
        const rLow = await radiusOf(low);
        const rHigh = await radiusOf(high);
        expect(rLow).toBeLessThan(rHigh);
        expect(rLow / rHigh).toBeCloseTo(0.5, 1);
      } finally {
        restore();
      }
    });
  });

  describe('spoke labels', () => {
    const LONG_DATA: ChartDatum[] = [
      { metric: 'Cuidamos das pessoas', v: 80 },
      { metric: 'Focamos no sucesso do cliente', v: 70 },
      { metric: 'Organização e priorização de problemas: Designer', v: 60 },
      { metric: 'Domínio do produto', v: 75 },
    ];

    async function renderLong(labelWidth?: number) {
      const restore = stubLayout();
      const f = TestBed.createComponent(RadarChart);
      f.componentRef.setInput('data', LONG_DATA);
      f.componentRef.setInput('config', { v: { label: 'V' } } as ChartConfig);
      f.componentRef.setInput('xKey', 'metric');
      if (labelWidth) f.componentRef.setInput('labelWidth', labelWidth);
      f.detectChanges();
      await f.whenStable();
      f.detectChanges();
      return { f, restore };
    }

    // Wrapping splits a label across <tspan>s, so textContent picks up the
    // whitespace between them — normalise before matching.
    const flat = (el: Element) =>
      (el.textContent ?? '').replace(/\s+/g, ' ').trim();
    const labelTexts = (f: { nativeElement: HTMLElement }) =>
      [...f.nativeElement.querySelectorAll('text')].filter((t) =>
        LONG_DATA.some((d) => flat(t) === String(d['metric'])),
      );

    it('anchors a label by the side of the circle it sits on', async () => {
      const { f, restore } = await renderLong();
      try {
        const anchors = labelTexts(f).map((t) => t.getAttribute('text-anchor'));
        // 4 spokes: top, right, bottom, left -> middle, start, middle, end
        expect(anchors).toEqual(['middle', 'start', 'middle', 'end']);
      } finally {
        restore();
      }
    });

    it('keeps a label on one line when no width is given', async () => {
      const { f, restore } = await renderLong();
      try {
        const long = labelTexts(f).find((t) => flat(t).includes('priorização'));
        expect(long?.querySelectorAll('tspan').length).toBe(1);
      } finally {
        restore();
      }
    });

    it('wraps to several lines once a width is set', async () => {
      const { f, restore } = await renderLong(90);
      try {
        const long = labelTexts(f).find((t) => flat(t).includes('priorização'));
        const spans = long?.querySelectorAll('tspan');
        expect(spans!.length).toBeGreaterThan(1);
        // nothing lost in the split
        expect([...spans!].map((sp) => sp.textContent?.trim()).join(' ')).toBe(
          'Organização e priorização de problemas: Designer',
        );
      } finally {
        restore();
      }
    });

    it('lifts a wrapped block so it stays centred on its spoke', async () => {
      // Unwrapped, every label starts flush with its anchor.
      const plain = await renderLong();
      try {
        for (const t of labelTexts(plain.f)) {
          expect(Number(t.querySelector('tspan')!.getAttribute('dy'))).toBe(0);
        }
      } finally {
        plain.restore();
      }

      // Wrapped, the block is lifted by half its extra height, so its middle
      // still lands on the spoke instead of the block hanging below it.
      const wrapped = await renderLong(90);
      try {
        const LINE_HEIGHT = 11;
        for (const t of labelTexts(wrapped.f)) {
          const lines = t.querySelectorAll('tspan').length;
          const dy = Number(t.querySelector('tspan')!.getAttribute('dy'));
          expect(dy).toBe((-(lines - 1) * LINE_HEIGHT) / 2);
        }
        // and at this width at least one label really did wrap
        expect(
          labelTexts(wrapped.f).some(
            (t) => t.querySelectorAll('tspan').length > 1,
          ),
        ).toBe(true);
      } finally {
        wrapped.restore();
      }
    });
  });
});
