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

  it('collapses a closed panel (hidden while data-state=closed, like Radix)', async () => {
    const fixture = render();
    await fixture.whenStable();
    fixture.detectChanges();
    const panels = (fixture.nativeElement as HTMLElement).querySelectorAll(
      '[data-slot="accordion-content"]',
    );
    const closed = panels[1] as HTMLElement;
    expect(closed.getAttribute('data-state')).toBe('closed');
    expect(closed.className).toContain('data-[state=closed]:hidden');
  });

  it('merges a consumer class onto item, trigger and content', () => {
    TestBed.configureTestingModule({ imports: [ClassHost] });
    const fixture = TestBed.createComponent(ClassHost);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const item = host.querySelector('[data-slot="accordion-item"]')!;
    expect(item.classList).toContain('block');
    expect(item.className).toContain('border-b-2');
    expect(item.className).not.toMatch(/(^| )border-b( |$)/);
    const trigger = host.querySelector('[data-slot="accordion-trigger"]')!;
    expect(trigger.className).toContain('py-2');
    expect(trigger.className).not.toContain('py-4');
    const inner = host.querySelector('[data-slot="accordion-content"] > div')!;
    expect(inner.className).toContain('pb-2');
    expect(inner.className).not.toContain('pb-4');
  });
});

@Component({
  standalone: true,
  imports: [Accordion, AccordionItem, AccordionTrigger, AccordionContent],
  template: `
    <gr-accordion type="single">
      <gr-accordion-item value="a" class="border-b-2">
        <gr-accordion-trigger class="py-2">First</gr-accordion-trigger>
        <gr-accordion-content class="pb-2">Body</gr-accordion-content>
      </gr-accordion-item>
    </gr-accordion>
  `,
})
class ClassHost {}
