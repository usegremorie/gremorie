import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ToggleGroup, ToggleGroupItem } from './toggle-group';

@Component({
  standalone: true,
  imports: [ToggleGroup, ToggleGroupItem],
  template: `
    <gn-toggle-group type="single" variant="outline" size="sm">
      <gn-toggle-group-item value="left" ariaLabel="Left"
        >L</gn-toggle-group-item
      >
      <gn-toggle-group-item value="center" ariaLabel="Center"
        >C</gn-toggle-group-item
      >
      <gn-toggle-group-item value="right" ariaLabel="Right"
        >R</gn-toggle-group-item
      >
    </gn-toggle-group>
  `,
})
class Host {}

describe('ToggleGroup', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the group with data-slot="toggle-group"', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="toggle-group"]')).not.toBeNull();
  });

  it('renders every item with data-slot="toggle-group-item"', () => {
    const host = render().nativeElement as HTMLElement;
    const items = host.querySelectorAll('[data-slot="toggle-group-item"]');
    expect(items.length).toBe(3);
    items.forEach((item) => expect(item.tagName.toLowerCase()).toBe('button'));
  });

  it('propagates variant and size from the group onto each item', () => {
    const host = render().nativeElement as HTMLElement;
    const items = host.querySelectorAll('[data-slot="toggle-group-item"]');
    items.forEach((item) => {
      expect(item.getAttribute('data-variant')).toBe('outline');
      expect(item.getAttribute('data-size')).toBe('sm');
    });
  });
});
