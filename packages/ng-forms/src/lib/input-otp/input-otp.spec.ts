import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import {
  InputOtp,
  InputOtpGroup,
  InputOtpSeparator,
  InputOtpSlot,
} from './input-otp';

@Component({
  standalone: true,
  imports: [InputOtp, InputOtpGroup, InputOtpSlot, InputOtpSeparator],
  template: `
    <gn-input-otp [maxLength]="6">
      <gn-input-otp-group>
        <gn-input-otp-slot [index]="0" />
        <gn-input-otp-slot [index]="1" />
        <gn-input-otp-slot [index]="2" />
      </gn-input-otp-group>
      <gn-input-otp-separator />
      <gn-input-otp-group>
        <gn-input-otp-slot [index]="3" />
        <gn-input-otp-slot [index]="4" />
        <gn-input-otp-slot [index]="5" />
      </gn-input-otp-group>
    </gn-input-otp>
  `,
})
class Host {}

describe('InputOtp', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the host with data-slot="input-otp"', () => {
    expect(render().querySelector('[data-slot="input-otp"]')).not.toBeNull();
  });

  it('renders the brain input-otp element', () => {
    expect(render().querySelector('brn-input-otp')).not.toBeNull();
  });

  it('renders a hidden one-time-code input', () => {
    expect(
      render().querySelector('input[data-slot="input-otp"]'),
    ).not.toBeNull();
  });

  it('renders all six slots', () => {
    expect(render().querySelectorAll('brn-input-otp-slot').length).toBe(6);
  });

  it('renders the two groups and a separator', () => {
    const host = render();
    expect(host.querySelectorAll('[data-slot="input-otp-group"]').length).toBe(
      2,
    );
    expect(
      host.querySelector('[data-slot="input-otp-separator"]'),
    ).not.toBeNull();
  });
});
