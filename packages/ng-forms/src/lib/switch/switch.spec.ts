import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { Switch, type SwitchSize } from './switch';

@Component({
  standalone: true,
  imports: [Switch],
  template: `
    <gn-switch [checked]="checked()" [size]="size()" [disabled]="disabled()" />
  `,
})
class Host {
  checked = signal(false);
  size = signal<SwitchSize>('default');
  disabled = signal(false);
}

describe('Switch', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the host with data-slot="switch"', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="switch"]')).not.toBeNull();
  });

  it('renders the underlying brain switch + thumb elements', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('brn-switch')).not.toBeNull();
    expect(host.querySelector('brn-switch-thumb')).not.toBeNull();
  });

  it('renders a button with role="switch" (brain inner control)', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('button[role="switch"]')).not.toBeNull();
  });

  it('renders the thumb with data-slot="switch-thumb"', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="switch-thumb"]')).not.toBeNull();
  });

  it('reflects size on the host via data-size', () => {
    const fixture = render();
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      'gn-switch',
    );
    expect(el?.getAttribute('data-size')).toBe('default');

    fixture.componentInstance.size.set('sm');
    fixture.detectChanges();
    expect(el?.getAttribute('data-size')).toBe('sm');
  });
});
