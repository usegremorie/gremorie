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
});
