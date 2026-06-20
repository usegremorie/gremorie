import { TestBed } from '@angular/core/testing';
import { ChartArtifact, type ChartArtifactDatum } from './chart-artifact';

const DATA: ChartArtifactDatum[] = [
  { month: 'Jan', revenue: 1860 },
  { month: 'Feb', revenue: 3050 },
  { month: 'Mar', revenue: 2370 },
];

async function render(inputs: Record<string, unknown>) {
  const fixture = TestBed.createComponent(ChartArtifact);
  fixture.componentRef.setInput('title', 'Monthly revenue');
  fixture.componentRef.setInput('data', DATA);
  fixture.componentRef.setInput('categoryKey', 'month');
  fixture.componentRef.setInput('valueKey', 'revenue');
  for (const [k, v] of Object.entries(inputs)) {
    fixture.componentRef.setInput(k, v);
  }
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  return fixture;
}

describe('ChartArtifact', () => {
  it('renders the bar-chart host for type="bar"', async () => {
    const fixture = await render({ type: 'bar' });
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('bar-chart')).not.toBeNull();
  });

  it('renders the title text', async () => {
    const fixture = await render({ type: 'bar' });
    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).toContain('Monthly revenue');
  });

  it('renders a table with one tbody row per datum when defaultView="table"', async () => {
    const fixture = await render({ type: 'bar', defaultView: 'table' });
    const host = fixture.nativeElement as HTMLElement;
    const table = host.querySelector('table');
    expect(table).not.toBeNull();
    const rows = host.querySelectorAll('table tbody tr');
    expect(rows.length).toBe(DATA.length);
  });
});
