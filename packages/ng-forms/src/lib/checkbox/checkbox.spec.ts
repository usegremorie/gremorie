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
});
