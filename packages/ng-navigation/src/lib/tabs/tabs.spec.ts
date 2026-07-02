import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

@Component({
  standalone: true,
  imports: [Tabs, TabsList, TabsTrigger, TabsContent],
  template: `
    <gn-tabs defaultValue="a">
      <gn-tabs-list>
        <gn-tabs-trigger value="a">First</gn-tabs-trigger>
        <gn-tabs-trigger value="b">Second</gn-tabs-trigger>
      </gn-tabs-list>
      <gn-tabs-content value="a">First body</gn-tabs-content>
      <gn-tabs-content value="b">Second body</gn-tabs-content>
    </gn-tabs>
  `,
})
class Host {}

describe('Tabs', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders root, list, triggers and content data-slots', () => {
    const host = render();
    expect(host.querySelector('[data-slot="tabs"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="tabs-list"]')).not.toBeNull();
    expect(host.querySelectorAll('[data-slot="tabs-trigger"]').length).toBe(2);
    expect(host.querySelectorAll('[data-slot="tabs-content"]').length).toBe(2);
  });

  it('renders triggers as buttons', () => {
    const host = render();
    const trigger = host.querySelector('[data-slot="tabs-trigger"]');
    expect(trigger?.tagName.toLowerCase()).toBe('button');
  });

  it('reflects orientation on the root', () => {
    const host = render();
    const root = host.querySelector('[data-slot="tabs"]');
    expect(root?.getAttribute('data-orientation')).toBe('horizontal');
  });
});
