import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Toggle } from './toggle';

@Component({
  standalone: true,
  imports: [Toggle],
  template: `
    <gr-toggle
      [variant]="variant()"
      [size]="size()"
      [disabled]="disabled()"
      [pressed]="pressed()"
      ariaLabel="Toggle"
    >
      Aa
    </gr-toggle>
  `,
})
class Host {
  variant = signal<'default' | 'outline'>('default');
  size = signal<'default' | 'sm' | 'lg'>('default');
  disabled = signal(false);
  pressed = signal(false);
}

describe('Toggle', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders a button carrying data-slot="toggle"', () => {
    const host = render().nativeElement as HTMLElement;
    const el = host.querySelector('[data-slot="toggle"]');
    expect(el).not.toBeNull();
    expect(el?.tagName.toLowerCase()).toBe('button');
  });

  it('maps pressed=false to data-state="off"', () => {
    const host = render().nativeElement as HTMLElement;
    const el = host.querySelector('[data-slot="toggle"]');
    expect(el?.getAttribute('data-state')).toBe('off');
    expect(el?.getAttribute('aria-pressed')).toBe('false');
  });

  it('maps pressed=true to data-state="on"', () => {
    const fixture = render();
    fixture.componentInstance.pressed.set(true);
    fixture.detectChanges();
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="toggle"]',
    );
    expect(el?.getAttribute('data-state')).toBe('on');
    expect(el?.getAttribute('aria-pressed')).toBe('true');
  });

  it('disables the button when disabled is true', () => {
    const fixture = render();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    ) as HTMLButtonElement;
    expect(el.disabled).toBe(true);
  });
});
