import { TestBed } from '@angular/core/testing';
import { BarChart } from './bar-chart';
import type { ChartConfig, ChartDatum } from '../headless/types';

const DATA: ChartDatum[] = [
  { month: 'Jan', sales: 186, profit: 80 },
  { month: 'Feb', sales: 305, profit: 200 },
  { month: 'Mar', sales: 237, profit: 120 },
];
const CONFIG: ChartConfig = {
  sales: { label: 'Sales', color: 'var(--chart-1)' },
  profit: { label: 'Profit', color: 'var(--chart-2)' },
};

async function render(stacked = false) {
  const fixture = TestBed.createComponent(BarChart);
  fixture.componentRef.setInput('data', DATA);
  fixture.componentRef.setInput('config', CONFIG);
  fixture.componentRef.setInput('xKey', 'month');
  fixture.componentRef.setInput('stacked', stacked);
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

describe('BarChart', () => {
  it('exposes role=img with a label built from series + an a11y data table', async () => {
    const fixture = await render();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toContain('Sales');
    const rows = host.querySelectorAll('table tbody tr');
    expect(rows.length).toBe(DATA.length);
  });

  it('renders one bar group per configured series', async () => {
    const fixture = await render();
    const groups = fixture.nativeElement.querySelectorAll('g[data-slot="bar"]');
    expect(groups.length).toBe(2);
  });

  it('renders bar geometry as paths inside the bar group', async () => {
    const fixture = await render();
    const paths = fixture.nativeElement.querySelectorAll(
      'g[data-slot="bar"] path',
    );
    expect(paths.length).toBeGreaterThan(0);
  });

  it('still renders when stacked', async () => {
    const fixture = await render(true);
    const groups = fixture.nativeElement.querySelectorAll('g[data-slot="bar"]');
    expect(groups.length).toBe(2);
  });
});
