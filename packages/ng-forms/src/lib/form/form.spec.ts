import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';

import { Input } from '../input/input';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';

@Component({
  standalone: true,
  imports: [
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    Input,
  ],
  template: `
    <gr-form-item [invalid]="invalid()">
      <gr-form-label>Email</gr-form-label>
      <gr-input grFormControl type="email" />
      <gr-form-description>Helper</gr-form-description>
      <gr-form-message>{{ message() }}</gr-form-message>
    </gr-form-item>
  `,
})
class Host {
  invalid = signal(false);
  message = signal('');
}

describe('Form', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the form item with data-slot="form-item"', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="form-item"]')).not.toBeNull();
  });

  it('points the label `for` at the control id', () => {
    const host = render().nativeElement as HTMLElement;
    const label = host.querySelector('label');
    const control = host.querySelector('[data-slot="form-control"]');
    expect(label?.getAttribute('for')).toBe(control?.getAttribute('id'));
    expect(label?.getAttribute('for')).toContain('-form-item');
  });

  it('wires aria-describedby to the description id when valid', () => {
    const host = render().nativeElement as HTMLElement;
    const control = host.querySelector('[data-slot="form-control"]');
    const desc = host.querySelector('[data-slot="form-description"]');
    expect(control?.getAttribute('aria-describedby')).toBe(
      desc?.getAttribute('id'),
    );
  });

  it('sets aria-invalid and extends aria-describedby when invalid', () => {
    const fixture = render();
    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const control = host.querySelector('[data-slot="form-control"]');
    expect(control?.getAttribute('aria-invalid')).toBe('true');
    expect(control?.getAttribute('aria-describedby')).toContain(
      '-form-item-message',
    );
  });
});
