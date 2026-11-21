import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { Checkbox } from './checkbox';

@Component({
  standalone: true,
  imports: [Checkbox],
  template: `<gr-checkbox [checked]="checked()" [disabled]="disabled()" />`,
})
class Host {
  checked = signal<boolean | 'indeterminate'>(false);
  disabled = signal(false);
}

describe('Checkbox', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the host with data-slot="checkbox"', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="checkbox"]')).not.toBeNull();
  });

  it('renders the underlying brain checkbox element', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('brn-checkbox')).not.toBeNull();
  });

  it('renders a button with role="checkbox" (brain inner control)', () => {
    const host = render().nativeElement as HTMLElement;
    const button = host.querySelector('button[role="checkbox"]');
    expect(button).not.toBeNull();
  });

  it('shows the check indicator only when checked', () => {
    const fixture = render();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="checkbox-indicator"]')).toBeNull();

    fixture.componentInstance.checked.set(true);
    fixture.detectChanges();
    expect(
      host.querySelector('[data-slot="checkbox-indicator"]'),
    ).not.toBeNull();
  });

  it('shows the indicator when indeterminate', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.checked.set('indeterminate');
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(
      host.querySelector('[data-slot="checkbox-indicator"]'),
    ).not.toBeNull();
  });

  it('draws a dash (not a check) when indeterminate', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.checked.set('indeterminate');
    fixture.detectChanges();
    const indicator = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="checkbox-indicator"]',
    );
    const paths = Array.from(indicator?.querySelectorAll('path') ?? []).map(
      (p) => p.getAttribute('d'),
    );
    expect(paths).toEqual(['M5 12h14']);
  });

  it('draws the check when checked', () => {
    const fixture = render();
    fixture.componentInstance.checked.set(true);
    fixture.detectChanges();
    const indicator = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="checkbox-indicator"]',
    );
    const paths = Array.from(indicator?.querySelectorAll('path') ?? []).map(
      (p) => p.getAttribute('d'),
    );
    expect(paths).toEqual(['M20 6 9 17l-5-5']);
  });

  it('keeps the host out of layout so the row is as tall as the box', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('gr-checkbox')?.classList).toContain('contents');
  });
});
