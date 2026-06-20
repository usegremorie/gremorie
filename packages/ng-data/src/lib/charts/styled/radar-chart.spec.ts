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
});
