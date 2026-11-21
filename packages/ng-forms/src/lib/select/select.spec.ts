import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

@Component({
  standalone: true,
  imports: [Select, SelectTrigger, SelectValue, SelectContent, SelectItem],
  template: `
    <gr-select>
      <gr-select-trigger>
        <gr-select-value placeholder="Pick one" />
      </gr-select-trigger>
      <gr-select-content>
        <gr-select-item value="apple">Apple</gr-select-item>
        <gr-select-item value="banana">Banana</gr-select-item>
      </gr-select-content>
    </gr-select>
  `,
})
class Host {}

describe('Select', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the root with data-slot="select"', () => {
    expect(render().querySelector('[data-slot="select"]')).not.toBeNull();
  });

  it('renders the trigger button', () => {
    const trigger = render().querySelector('[data-slot="select-trigger"]');
    expect(trigger).not.toBeNull();
    expect(trigger?.tagName.toLowerCase()).toBe('button');
  });

  it('renders the value placeholder slot', () => {
    expect(render().querySelector('[data-slot="select-value"]')).not.toBeNull();
  });

  it('defaults the trigger to data-size="default"', () => {
    const trigger = render().querySelector('[data-slot="select-trigger"]');
    expect(trigger?.getAttribute('data-size')).toBe('default');
  });

  it('forwards id to the trigger button (label association) and keeps it off the host', () => {
    TestBed.configureTestingModule({ imports: [IdHost] });
    const fixture = TestBed.createComponent(IdHost);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('gr-select-trigger')?.hasAttribute('id')).toBe(
      false,
    );
    const button = host.querySelector('button[data-slot="select-trigger"]');
    expect(button?.id).toBe('order-type');
    expect(host.querySelectorAll('#order-type').length).toBe(1);
  });

  it('keeps a generated id on the trigger when none is given', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button[data-slot="select-trigger"]',
    );
    expect(button?.id).toMatch(/\S/);
  });
});

@Component({
  standalone: true,
  imports: [Select, SelectTrigger, SelectValue, SelectContent, SelectItem],
  template: `
    <label for="order-type">Order type</label>
    <gr-select>
      <gr-select-trigger id="order-type">
        <gr-select-value placeholder="Pick one" />
      </gr-select-trigger>
      <gr-select-content>
        <gr-select-item value="market">Market</gr-select-item>
      </gr-select-content>
    </gr-select>
  `,
})
class IdHost {}
