import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './collapsible';

@Component({
  standalone: true,
  imports: [Collapsible, CollapsibleTrigger, CollapsibleContent],
  template: `
    <gn-collapsible [defaultOpen]="defaultOpen">
      <gn-collapsible-trigger>Toggle</gn-collapsible-trigger>
      <gn-collapsible-content>Hidden</gn-collapsible-content>
    </gn-collapsible>
  `,
})
class Host {
  defaultOpen = true;
}

describe('Collapsible', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders root, trigger and content with their data-slots', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="collapsible"]')).not.toBeNull();
    expect(
      host.querySelector('[data-slot="collapsible-trigger"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="collapsible-content"]'),
    ).not.toBeNull();
  });

  it('renders the trigger as a real button element', () => {
    const host = render().nativeElement as HTMLElement;
    const trigger = host.querySelector('[data-slot="collapsible-trigger"]');
    expect(trigger?.tagName.toLowerCase()).toBe('button');
  });
});
