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
    <gn-select>
      <gn-select-trigger>
        <gn-select-value placeholder="Pick one" />
      </gn-select-trigger>
      <gn-select-content>
        <gn-select-item value="apple">Apple</gn-select-item>
        <gn-select-item value="banana">Banana</gn-select-item>
      </gn-select-content>
    </gn-select>
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
});
