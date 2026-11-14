import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { Separator } from './separator';

@Component({
  standalone: true,
  imports: [Separator],
  template: `<gr-separator
    [orientation]="orientation()"
    [decorative]="decorative()"
  />`,
})
class Host {
  // Signals, not plain fields: the suite runs zoneless, where mutating a plain
  // field after the first render marks nothing dirty and the view never updates.
  readonly orientation = signal<'horizontal' | 'vertical'>('horizontal');
  readonly decorative = signal(true);
}

describe('Separator', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the separator surface with token-driven border class', () => {
    const fixture = render();
    const el = fixture.nativeElement.querySelector(
      '[data-slot="separator"]',
    ) as HTMLElement;
    expect(el).not.toBeNull();
    expect(el.className).toContain('bg-border');
    expect(el.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('is presentational (role="none") when decorative', () => {
    const fixture = render();
    const el = fixture.nativeElement.querySelector(
      '[data-slot="separator"]',
    ) as HTMLElement;
    expect(el.getAttribute('role')).toBe('none');
  });

  it('exposes role="separator" with aria-orientation when not decorative and vertical', () => {
    const fixture = render();
    fixture.componentInstance.decorative.set(false);
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '[data-slot="separator"]',
    ) as HTMLElement;
    expect(el.getAttribute('role')).toBe('separator');
    expect(el.getAttribute('aria-orientation')).toBe('vertical');
  });
});
