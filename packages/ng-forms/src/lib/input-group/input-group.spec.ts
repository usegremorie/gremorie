import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from './input-group';

@Component({
  standalone: true,
  imports: [
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
  ],
  template: `
    <gn-input-group>
      <gn-input-group-addon>
        <gn-input-group-text>https://</gn-input-group-text>
      </gn-input-group-addon>
      <gn-input-group-input placeholder="example.com" />
      <gn-input-group-addon align="inline-end">
        <gn-input-group-button>Go</gn-input-group-button>
      </gn-input-group-addon>
    </gn-input-group>
  `,
})
class Host {}

describe('InputGroup', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the group with role="group" and data-slot="input-group"', () => {
    const group = render().querySelector('[data-slot="input-group"]');
    expect(group).not.toBeNull();
    expect(group?.getAttribute('role')).toBe('group');
  });

  it('renders the control as a direct input child carrying data-slot="input-group-control"', () => {
    const control = render().querySelector(
      'input[data-slot="input-group-control"]',
    );
    expect(control).not.toBeNull();
  });

  it('renders two addons with their alignment attributes', () => {
    const host = render();
    const addons = host.querySelectorAll('[data-slot="input-group-addon"]');
    expect(addons.length).toBe(2);
    expect(addons[0].getAttribute('data-align')).toBe('inline-start');
    expect(addons[1].getAttribute('data-align')).toBe('inline-end');
  });

  it('renders the addon button', () => {
    expect(
      render().querySelector('[data-slot="input-group-button"]'),
    ).not.toBeNull();
  });
});
