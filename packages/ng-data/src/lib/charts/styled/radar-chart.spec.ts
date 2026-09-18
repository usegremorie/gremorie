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
});
