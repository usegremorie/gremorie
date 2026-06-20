import { TestBed } from '@angular/core/testing';
import { RadialChart } from './radial-chart';
import type { ChartDatum } from '../headless/types';

const DATA: ChartDatum[] = [
  { browser: 'Chrome', visitors: 275 },
  { browser: 'Safari', visitors: 200 },
  { browser: 'Firefox', visitors: 187 },
];

async function render() {
  const fixture = TestBed.createComponent(RadialChart);
  fixture.componentRef.setInput('data', DATA);
  fixture.componentRef.setInput('nameKey', 'browser');
  fixture.componentRef.setInput('dataKey', 'visitors');
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

describe('RadialChart', () => {
  it('exposes role=img with a "Radial" label + an a11y data table', async () => {
    const fixture = await render();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toContain('Radial');
    const rows = host.querySelectorAll('table tbody tr');
    expect(rows.length).toBe(DATA.length);
  });

  it('renders a track + value arc path per datum', async () => {
    const fixture = await render();
    const paths = fixture.nativeElement.querySelectorAll(
      'g[data-slot="radial-bar"] path',
    );
    expect(paths.length).toBe(DATA.length * 2);
  });
});
