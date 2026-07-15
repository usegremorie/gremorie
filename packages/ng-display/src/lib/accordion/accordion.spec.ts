import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './accordion';

@Component({
  standalone: true,
  imports: [Accordion, AccordionItem, AccordionTrigger, AccordionContent],
  template: `
    <gr-accordion type="single" defaultValue="a">
      <gr-accordion-item value="a">
        <gr-accordion-trigger>First</gr-accordion-trigger>
        <gr-accordion-content>First body</gr-accordion-content>
      </gr-accordion-item>
      <gr-accordion-item value="b">
        <gr-accordion-trigger>Second</gr-accordion-trigger>
        <gr-accordion-content>Second body</gr-accordion-content>
      </gr-accordion-item>
    </gr-accordion>
  `,
})
class Host {}

describe('Accordion', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders root, items, triggers and content with their data-slots', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="accordion"]')).not.toBeNull();
    expect(host.querySelectorAll('[data-slot="accordion-item"]').length).toBe(
      2,
    );
    expect(
      host.querySelectorAll('[data-slot="accordion-trigger"]').length,
    ).toBe(2);
    expect(
      host.querySelectorAll('[data-slot="accordion-content"]').length,
    ).toBe(2);
  });

  it('renders triggers as buttons with the chevron and item border classes', () => {
    const host = render().nativeElement as HTMLElement;
    const trigger = host.querySelector('[data-slot="accordion-trigger"]');
    expect(trigger?.tagName.toLowerCase()).toBe('button');
    expect(trigger?.querySelector('svg')).not.toBeNull();
    const item = host.querySelector(
      '[data-slot="accordion-item"]',
    ) as HTMLElement;
    expect(item.className).toContain('border-b');
    expect(item.getAttribute('data-value')).toBe('a');
  });
});
