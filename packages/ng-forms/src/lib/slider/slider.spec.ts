import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Slider } from './slider';

@Component({
  standalone: true,
  imports: [Slider],
  template: `
    <gn-slider
      [value]="value()"
      [min]="min()"
      [max]="max()"
      [disabled]="disabled()"
      [orientation]="orientation()"
      [thumbAriaLabel]="thumbAriaLabel()"
    />
  `,
})
class Host {
  value = signal<number[]>([50]);
  min = signal(0);
  max = signal(100);
  disabled = signal(false);
  orientation = signal<'horizontal' | 'vertical'>('horizontal');
  thumbAriaLabel = signal<string | string[] | undefined>('Volume');
}

describe('Slider', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders root, track, range and thumb with their data-slots', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="slider"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="slider-track"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="slider-range"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="slider-thumb"]')).not.toBeNull();
  });

  it('renders one thumb per value (range slider has two)', () => {
    const fixture = render();
    fixture.componentInstance.value.set([25, 75]);
    fixture.detectChanges();
    const thumbs = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-slot="slider-thumb"]',
    );
    expect(thumbs.length).toBe(2);
  });

  it('uses the array thumbAriaLabel per thumb', () => {
    const fixture = render();
    fixture.componentInstance.value.set([25, 75]);
    fixture.componentInstance.thumbAriaLabel.set(['Minimum', 'Maximum']);
    fixture.detectChanges();
    const thumbs = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-slot="slider-thumb"]',
    );
    expect(thumbs[0].getAttribute('aria-label')).toBe('Minimum');
    expect(thumbs[1].getAttribute('aria-label')).toBe('Maximum');
  });

  it('reflects orientation onto the root element', () => {
    const fixture = render();
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    const root = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="slider"]',
    );
    expect(root?.getAttribute('data-orientation')).toBe('vertical');
  });
});
