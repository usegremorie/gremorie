import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Button } from './button';

@Component({
  standalone: true,
  imports: [Button],
  template: `<ai-button class="w-full">Save</ai-button>`,
})
class Host {}

describe('Button', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders a native button carrying data-slot="button", like React', () => {
    const el = render().querySelector('[data-slot="button"]');
    expect(el?.tagName.toLowerCase()).toBe('button');
  });

  it('merges a caller class onto the native button, like React className', () => {
    const el = render().querySelector('button');
    expect(el?.className).toContain('w-full');
  });

  it('keeps the host out of layout so the button sizes against the parent', () => {
    const host = render().querySelector('ai-button');
    expect(host?.className).toContain('contents');
  });
});
