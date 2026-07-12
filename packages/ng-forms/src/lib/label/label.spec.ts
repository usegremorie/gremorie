import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Label } from './label';

@Component({
  standalone: true,
  imports: [Label],
  template: `<gr-label for="email">Email</gr-label>`,
})
class Host {}

describe('Label', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders a label carrying data-slot="label"', () => {
    const host = render().nativeElement as HTMLElement;
    const el = host.querySelector('[data-slot="label"]');
    expect(el).not.toBeNull();
    expect(el?.tagName.toLowerCase()).toBe('label');
  });

  it('binds the for input to the native for attribute', () => {
    const host = render().nativeElement as HTMLElement;
    const el = host.querySelector('label') as HTMLLabelElement;
    expect(el.getAttribute('for')).toBe('email');
  });

  it('projects its content', () => {
    const host = render().nativeElement as HTMLElement;
    const el = host.querySelector('label') as HTMLLabelElement;
    expect(el.textContent?.trim()).toBe('Email');
  });
});
