import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ToggleGroup, ToggleGroupItem } from './toggle-group';

@Component({
  standalone: true,
  imports: [ToggleGroup, ToggleGroupItem],
  template: `
    <gr-toggle-group type="single" variant="outline" size="sm">
      <gr-toggle-group-item value="left" ariaLabel="Left"
        >L</gr-toggle-group-item
      >
      <gr-toggle-group-item value="center" ariaLabel="Center"
        >C</gr-toggle-group-item
      >
      <gr-toggle-group-item value="right" ariaLabel="Right"
        >R</gr-toggle-group-item
      >
    </gr-toggle-group>
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

  it('merges a consumer class onto the item button (cn wins) and keeps the host out of layout', () => {
    TestBed.configureTestingModule({ imports: [ClassHost] });
    const fixture = TestBed.createComponent(ClassHost);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const item = host.querySelector('gr-toggle-group-item')!;
    expect(item.classList).toContain('contents');
    const button = item.querySelector('button')!;
    expect(button.className).toContain('px-1');
    expect(button.className).not.toContain('px-3');
  });
});

@Component({
  standalone: true,
  imports: [ToggleGroup, ToggleGroupItem],
  template: `
    <gr-toggle-group type="single">
      <gr-toggle-group-item value="a" class="px-1">A</gr-toggle-group-item>
    </gr-toggle-group>
  `,
})
class ClassHost {}
