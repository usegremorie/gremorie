import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { RadioGroup, RadioGroupItem } from './radio-group';

@Component({
  standalone: true,
  imports: [RadioGroup, RadioGroupItem],
  template: `
    <gr-radio-group [value]="value">
      <gr-radio-group-item value="a" id="a" />
      <gr-radio-group-item value="b" id="b" />
    </gr-radio-group>
  `,
})
class Host {
  value = 'a';
}

describe('RadioGroup', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the group with data-slot="radio-group"', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="radio-group"]')).not.toBeNull();
  });

  it('renders items with data-slot="radio-group-item"', () => {
    const host = render().nativeElement as HTMLElement;
    const items = host.querySelectorAll('[data-slot="radio-group-item"]');
    expect(items.length).toBe(2);
  });

  it('renders the underlying brain radio elements', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelectorAll('brn-radio').length).toBe(2);
  });

  it('projects an indicator into each item', () => {
    const host = render().nativeElement as HTMLElement;
    expect(
      host.querySelectorAll('[data-slot="radio-group-indicator"]').length,
    ).toBe(2);
  });

  it('marks the selected item as checked', () => {
    const host = render().nativeElement as HTMLElement;
    const selected = host.querySelector('brn-radio[data-value="a"]');
    expect(selected?.classList.contains('brn-radio-checked')).toBe(true);
  });
});
