import { TestBed } from '@angular/core/testing';
import { PieChart } from './pie-chart';
import type { ChartDatum } from '../headless/types';

const DATA: ChartDatum[] = [
  { browser: 'Chrome', visitors: 275 },
  { browser: 'Safari', visitors: 200 },
  { browser: 'Firefox', visitors: 187 },
];

async function render(donut = false) {
  const fixture = TestBed.createComponent(PieChart);
  fixture.componentRef.setInput('data', DATA);
  fixture.componentRef.setInput('nameKey', 'browser');
  fixture.componentRef.setInput('dataKey', 'visitors');
  fixture.componentRef.setInput('donut', donut);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

describe('PieChart', () => {
  it('exposes role=img with a "Pie" label + an a11y data table', async () => {
    const fixture = await render();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toContain('Pie');
    const rows = host.querySelectorAll('table tbody tr');
    expect(rows.length).toBe(DATA.length);
  });

  it('renders one slice path per datum', async () => {
    const fixture = await render();
    const slices = fixture.nativeElement.querySelectorAll(
      'g[data-slot="pie"] path',
    );
    expect(slices.length).toBe(DATA.length);
  });

  it('switches the label to "Donut" when donut is true', async () => {
    const fixture = await render(true);
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('aria-label')).toContain('Donut');
  });

  it('writes the total in the donut hole', async () => {
    const fixture = TestBed.createComponent(PieChart);
    fixture.componentRef.setInput('data', DATA);
    fixture.componentRef.setInput('nameKey', 'browser');
    fixture.componentRef.setInput('dataKey', 'visitors');
    fixture.componentRef.setInput('donut', true);
    fixture.componentRef.setInput('centerValue', '$2,480');
    fixture.componentRef.setInput('centerLabel', 'spent in May');
    fixture.detectChanges();
    const center = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="pie-chart-center"]',
    );
    expect(center?.textContent).toContain('$2,480');
    expect(center?.textContent).toContain('spent in May');
  });

  it('drops its frame and legend on request', async () => {
    const fixture = TestBed.createComponent(PieChart);
    fixture.componentRef.setInput('data', DATA);
    fixture.componentRef.setInput('nameKey', 'browser');
    fixture.componentRef.setInput('dataKey', 'visitors');
    fixture.componentRef.setInput('framed', false);
    fixture.componentRef.setInput('legend', false);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.className).not.toContain('border');
    expect(host.querySelector('chart-legend')).toBeNull();
  });
});
