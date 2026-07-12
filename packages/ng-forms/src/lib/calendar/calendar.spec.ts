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
});
