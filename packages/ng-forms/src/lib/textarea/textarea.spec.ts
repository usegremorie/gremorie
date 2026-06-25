import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Textarea } from './textarea';

@Component({
  standalone: true,
  imports: [Textarea],
  template: `
    <gn-textarea
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
  placeholder = signal('Type your message…');
  value = signal('');
  disabled = signal(false);
  ariaInvalid = signal(false);
}

describe('Textarea', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders a textarea carrying data-slot="textarea"', () => {
    const host = render().nativeElement as HTMLElement;
    const el = host.querySelector('[data-slot="textarea"]');
    expect(el).not.toBeNull();
    expect(el?.tagName.toLowerCase()).toBe('textarea');
  });

  it('binds placeholder, id and name to the inner textarea', () => {
    const host = render().nativeElement as HTMLElement;
    const el = host.querySelector('textarea') as HTMLTextAreaElement;
    expect(el.placeholder).toBe('Type your message…');
    expect(el.id).toBe('field');
    expect(el.name).toBe('field');
  });

  it('reflects the value input into the DOM (CVA writeValue path)', () => {
    const fixture = render();
    fixture.componentInstance.value.set('hello world');
    fixture.detectChanges();
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    expect(el.value).toBe('hello world');
  });

  it('sets aria-invalid when ariaInvalid is true', () => {
    const fixture = render();
    fixture.componentInstance.ariaInvalid.set(true);
    fixture.detectChanges();
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    expect(el.getAttribute('aria-invalid')).toBe('true');
  });

  it('disables the inner textarea when disabled is true', () => {
    const fixture = render();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const el = (fixture.nativeElement as HTMLElement).querySelector(
      'textarea',
    ) as HTMLTextAreaElement;
    expect(el.disabled).toBe(true);
  });
});
