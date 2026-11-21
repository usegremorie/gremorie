import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
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
    <gr-input-group>
      <gr-input-group-addon>
        <gr-input-group-text>https://</gr-input-group-text>
      </gr-input-group-addon>
      <gr-input-group-input placeholder="example.com" />
      <gr-input-group-addon align="inline-end">
        <gr-input-group-button>Go</gr-input-group-button>
      </gr-input-group-addon>
    </gr-input-group>
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

  it('pulls an addon holding gr-input-group-button toward the edge (has-[>button] parity)', () => {
    const addons = render().querySelectorAll('[data-slot="input-group-addon"]');
    const end = Array.from(addons).find(
      (a) => a.getAttribute('data-align') === 'inline-end',
    );
    expect(end?.className).toContain('has-[>gr-input-group-button]:-mr-1.5');
  });
});

@Component({
  standalone: true,
  imports: [InputGroup, InputGroupAddon, InputGroupInput],
  template: `
    <gr-input-group>
      <gr-input-group-addon>$</gr-input-group-addon>
      <gr-input-group-input
        inputmode="decimal"
        [value]="value"
        (valueChange)="changes.push($event)"
      />
    </gr-input-group>
  `,
})
class ValueHost {
  value = '12';
  changes: string[] = [];
}

describe('InputGroupInput parity', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [ValueHost] });
    const fixture = TestBed.createComponent(ValueHost);
    fixture.detectChanges();
    return fixture;
  }

  it('keeps its host out of layout so the input stretches like React (flex-1)', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('gr-input-group-input')?.classList).toContain(
      'contents',
    );
    const input = host.querySelector('input')!;
    expect(input.className).toContain('flex-1');
  });

  it('lets the group reach the input through the host ([&>input] parity)', () => {
    const host = render().nativeElement as HTMLElement;
    const group = host.querySelector('[data-slot="input-group"]')!;
    expect(group.className).toContain(
      'has-[>[data-align=inline-start]]:[&>gr-input-group-input>input]:pl-2',
    );
  });

  it('emits valueChange with the typed string and seeds from value', () => {
    const fixture = render();
    const input = (fixture.nativeElement as HTMLElement).querySelector(
      'input',
    )!;
    expect(input.value).toBe('12');
    input.value = '123';
    input.dispatchEvent(new Event('input'));
    expect(fixture.componentInstance.changes).toEqual(['123']);
  });

  it('forwards inputmode to the native input', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('input')?.getAttribute('inputmode')).toBe(
      'decimal',
    );
  });

  it('lets a textarea group grow (has-[>textarea] parity through the host)', () => {
    TestBed.configureTestingModule({ imports: [TextareaHost] });
    const fixture = TestBed.createComponent(TextareaHost);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('gr-input-group-textarea')?.classList).toContain(
      'contents',
    );
    expect(
      host.querySelector('[data-slot="input-group"]')?.className,
    ).toContain('has-[>gr-input-group-textarea]:h-auto');
  });
});

@Component({
  standalone: true,
  imports: [InputGroup, InputGroupTextarea],
  template: `<gr-input-group><gr-input-group-textarea /></gr-input-group>`,
})
class TextareaHost {}
