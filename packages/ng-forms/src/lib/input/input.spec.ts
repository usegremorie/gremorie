import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Input } from './input';

@Component({
  standalone: true,
  imports: [Input],
  template: `
    <gn-input
      [type]="type()"
      [placeholder]="placeholder()"
      [value]="value()"
      [disabled]="disabled()"
      [ariaInvalid]="ariaInvalid()"
      id="field"
      name="field"
    />
  `,
})
class Host {
  type = signal('text');
  placeholder = signal('Type here…');
  value = signal('');
  disabled = signal(false);
  ariaInvalid = signal(false);
}

describe('Input', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders an input carrying data-slot="input"', () => {
    const host = render().nativeElement as HTMLElement;
    const el = host.querySelector('[data-slot="input"]');
    expect(el).not.toBeNull();
    expect(el?.tagName.toLowerCase()).toBe('input');
  });

  it('binds type, placeholder, id and name to the inner input', () => {
    const host = render().nativeElement as HTMLElement;
    const el = host.querySelector('input') as HTMLInputElement;
    expect(el.type).toBe('text');
    expect(el.placeholder).toBe('Type here…');
    expect(el.id).toBe('field');
    expect(el.name).toBe('field');
  });

  it('reflects the value input into the DOM (CVA writeValue path)', () => {
    const fixture = render();
    (fixture.componentInstance.value as ReturnType<typeof signal<string>>).set(
      'hello',
    );
    fixture.detectChanges();
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      'input',
    ) as HTMLInputElement;
    expect(el.value).toBe('hello');
  });

  it('sets aria-invalid when ariaInvalid is true', () => {
    const fixture = render();
    fixture.componentInstance.ariaInvalid.set(true);
    fixture.detectChanges();
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      'input',
    ) as HTMLInputElement;
    expect(el.getAttribute('aria-invalid')).toBe('true');
  });

  it('disables the inner input when disabled is true', () => {
    const fixture = render();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      'input',
    ) as HTMLInputElement;
    expect(el.disabled).toBe(true);
  });
});
