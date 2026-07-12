import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { Sonner, toast } from './sonner';

@Component({
  standalone: true,
  imports: [Sonner],
  template: `<gr-sonner [theme]="theme" />`,
})
class Host {
  theme: 'light' | 'dark' | 'system' = 'light';
}

describe('Sonner', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the brn-sonner-toaster host with the toaster data-slot', () => {
    const host = render().nativeElement as HTMLElement;
    // The gr-sonner host carries the data-slot; the brain toaster mounts inside.
    expect(host.querySelector('[data-slot="sonner"]')).not.toBeNull();
    expect(host.querySelector('brn-sonner-toaster')).not.toBeNull();
  });

  it('applies the KDS CSS-var bridge to the toaster list once a toast shows', () => {
    const fixture = render();
    const host = fixture.nativeElement as HTMLElement;

    // The brain renders the styled <ol data-sonner-toaster> (which carries the
    // merged style bridge) only while at least one toast is visible.
    toast('Hello');
    fixture.detectChanges();

    const list = host.querySelector(
      '[data-sonner-toaster]',
    ) as HTMLElement | null;
    expect(list).not.toBeNull();
    expect(list?.style.getPropertyValue('--normal-bg')).toBe('var(--popover)');
    expect(list?.style.getPropertyValue('--border-radius')).toBe(
      'var(--radius)',
    );

    toast.dismiss();
  });
});
