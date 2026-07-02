import { TestBed } from '@angular/core/testing';
import { ScatterChart } from './scatter-chart';
import type { ChartConfig, ChartDatum } from '../headless/types';

const DATA: ChartDatum[] = [
  { x: 12, weight: 40 },
  { x: 25, weight: 95 },
  { x: 38, weight: 60 },
];
const CONFIG: ChartConfig = {
  weight: { label: 'Weight', color: 'var(--chart-1)' },
};

async function render() {
  const fixture = TestBed.createComponent(ScatterChart);
  fixture.componentRef.setInput('data', DATA);
  fixture.componentRef.setInput('config', CONFIG);
  fixture.componentRef.setInput('xKey', 'x');
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

describe('ScatterChart', () => {
  it('exposes role=img with an "against" label + an a11y data table', async () => {
    const fixture = await render();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toContain('against');
    const rows = host.querySelectorAll('table tbody tr');
    expect(rows.length).toBe(DATA.length);
  });

  it('renders point markers as circles inside the scatter group', async () => {
    const fixture = await render();
    const circles = fixture.nativeElement.querySelectorAll(
      'g[data-slot="scatter"] circle',
    );
    expect(circles.length).toBeGreaterThan(0);
  });
});
