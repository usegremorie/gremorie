import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './command';

// Command renders inline (backed by `@spartan-ng/brain/command`). The spec
// asserts every part's data-slot and that items expose their search value.
@Component({
  standalone: true,
  imports: [
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandSeparator,
    CommandShortcut,
  ],
  template: `
    <gn-command>
      <gn-command-input placeholder="Search..." />
      <gn-command-list>
        <gn-command-empty>No results found.</gn-command-empty>
        <gn-command-group>
          <gn-command-item value="calendar">Calendar</gn-command-item>
          <gn-command-item value="search">
            Search <gn-command-shortcut>⌘S</gn-command-shortcut>
          </gn-command-item>
        </gn-command-group>
        <gn-command-separator />
      </gn-command-list>
    </gn-command>
  `,
})
class Host {}

describe('Command', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the command parts with their data-slots', () => {
    const host = render();
    expect(host.querySelector('[data-slot="command"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="command-input"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="command-list"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="command-empty"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="command-group"]')).not.toBeNull();
    expect(
      host.querySelector('[data-slot="command-separator"]'),
    ).not.toBeNull();
    expect(host.querySelector('[data-slot="command-shortcut"]')).not.toBeNull();
    expect(host.querySelectorAll('[data-slot="command-item"]').length).toBe(2);
  });

  it('renders the input as a search field with the given placeholder', () => {
    const host = render();
    const input = host
      .querySelector('[data-slot="command-input"]')
      ?.querySelector('input');
    expect(input).not.toBeNull();
    expect(input?.getAttribute('placeholder')).toBe('Search...');
  });

  it('renders each item as a button (BrnCommandItem)', () => {
    const host = render();
    const items = host.querySelectorAll('[data-slot="command-item"]');
    items.forEach((item) => {
      expect(item.querySelector('button')).not.toBeNull();
    });
  });
});
