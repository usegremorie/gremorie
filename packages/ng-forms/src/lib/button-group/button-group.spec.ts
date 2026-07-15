import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from './button-group';

@Component({
  standalone: true,
  imports: [ButtonGroup, ButtonGroupText, ButtonGroupSeparator],
  template: `
    <gr-button-group [orientation]="orientation()">
      <gr-button-group-text>https://</gr-button-group-text>
      <button>Go</button>
      <gr-button-group-separator />
      <button>Copy</button>
    </gr-button-group>
  `,
})
class Host {
  orientation = signal<'horizontal' | 'vertical'>('horizontal');
}

describe('ButtonGroup', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the group as role="group" with data-slot="button-group"', () => {
    const host = render().nativeElement as HTMLElement;
    const group = host.querySelector('[data-slot="button-group"]');
    expect(group).not.toBeNull();
    expect(group?.getAttribute('role')).toBe('group');
  });

  it('reflects orientation onto the group', () => {
    const fixture = render();
    fixture.componentInstance.orientation.set('vertical');
    fixture.detectChanges();
    const group = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="button-group"]',
    );
    expect(group?.getAttribute('data-orientation')).toBe('vertical');
  });

  it('renders the text and separator parts with their slots', () => {
    const host = render().nativeElement as HTMLElement;
    const sep = host.querySelector('[data-slot="button-group-separator"]');
    expect(sep).not.toBeNull();
    expect(sep?.getAttribute('role')).toBe('separator');
    expect(sep?.getAttribute('aria-hidden')).toBe('true');
    expect(sep?.getAttribute('data-orientation')).toBe('vertical');
  });
});
