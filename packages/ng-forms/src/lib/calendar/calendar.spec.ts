import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { Calendar } from './calendar';

@Component({
  standalone: true,
  imports: [Calendar],
  template: `<gr-calendar />`,
})
class Host {}

describe('Calendar', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the host with data-slot="calendar"', () => {
    expect(render().querySelector('[data-slot="calendar"]')).not.toBeNull();
  });

  it('renders the grid', () => {
    expect(render().querySelector('[brnCalendarGrid]')).not.toBeNull();
  });

  it('renders previous and next month nav buttons', () => {
    const host = render();
    expect(host.querySelector('[brnCalendarPreviousButton]')).not.toBeNull();
    expect(host.querySelector('[brnCalendarNextButton]')).not.toBeNull();
  });

  it('renders seven weekday headers', () => {
    expect(render().querySelectorAll('th[scope="col"]').length).toBe(7);
  });

  it('renders day cell buttons', () => {
    expect(
      render().querySelectorAll('button[brnCalendarCellButton]').length,
    ).toBeGreaterThan(27);
  });

  it('styles the selected day (brain emits data-selected-single)', () => {
    TestBed.configureTestingModule({ imports: [SelectedHost] });
    const fixture = TestBed.createComponent(SelectedHost);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const selected = host.querySelector('button[data-selected-single]');
    expect(selected?.textContent?.trim()).toBe('15');
    expect(selected?.className).toContain('data-[selected-single]:bg-primary');
    expect(selected?.className).toContain('data-[range-start]:bg-primary');
    expect(selected?.className).toContain('data-[range-end]:bg-primary');
    expect(selected?.className).toContain('data-[range-middle]:bg-accent');
    expect(selected?.className).not.toContain('data-[selected]:');
  });
});

@Component({
  standalone: true,
  imports: [Calendar],
  template: `<gr-calendar [date]="date" />`,
})
class SelectedHost {
  date = new Date(2026, 5, 15);
}
