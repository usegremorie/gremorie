import { TestBed } from '@angular/core/testing';
import { AreaChart } from './area-chart';
import type { ChartConfig, Datum } from '../headless/types';

const DATA: Datum[] = [
  { month: 'Jan', sales: 10, profit: 4 },
  { month: 'Feb', sales: 50, profit: 20 },
  { month: 'Mar', sales: 30, profit: 12 },
];
const CONFIG: ChartConfig = {
  sales: { label: 'Sales', color: 'var(--chart-1)' },
  profit: { label: 'Profit', color: 'var(--chart-2)' },
};

async function render() {
  const fixture = TestBed.createComponent(AreaChart);
  fixture.componentRef.setInput('data', DATA);
  fixture.componentRef.setInput('config', CONFIG);
  fixture.componentRef.setInput('xKey', 'month');
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

describe('AreaChart', () => {
  it('renders one area path per configured series', async () => {
    const fixture = await render();
    const paths = fixture.nativeElement.querySelectorAll(
      'path[data-slot="area"]',
    );
    expect(paths.length).toBe(2);
  });

  it('exposes role=img with a label built from series + an a11y data table', async () => {
    const fixture = await render();
    const figure = fixture.nativeElement.querySelector('[role="img"]');
    expect(figure).toBeTruthy();
    expect(figure.getAttribute('aria-label')).toContain('Sales');

    const rows = fixture.nativeElement.querySelectorAll('table tbody tr');
    expect(rows.length).toBe(DATA.length);
  });
});
