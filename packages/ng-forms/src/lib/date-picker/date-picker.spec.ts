import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { DatePicker } from './date-picker';

@Component({
  standalone: true,
  imports: [DatePicker],
  template: `<gn-date-picker placeholder="Pick a date" />`,
})
class Host {}

describe('DatePicker', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the host with data-slot="date-picker"', () => {
    expect(render().querySelector('[data-slot="date-picker"]')).not.toBeNull();
  });

  it('renders the trigger button with the placeholder', () => {
    const trigger = render().querySelector('[data-slot="date-picker-trigger"]');
    expect(trigger).not.toBeNull();
    expect(trigger?.textContent).toContain('Pick a date');
  });

  it('renders the brain popover element', () => {
    expect(render().querySelector('brn-popover')).not.toBeNull();
  });
});
