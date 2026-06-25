import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from './dropdown-menu';

// The trigger opens a BrnPopover overlay, so the content is not rendered
// eagerly when wired through `brnPopoverTriggerFor`. Here we render the
// content parts inline (their styled hosts always render) to assert their
// data-slots and class strings.
@Component({
  standalone: true,
  imports: [
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
  ],
  template: `
    <gn-dropdown-menu>
      <gn-dropdown-menu-content>
        <gn-dropdown-menu-label>Account</gn-dropdown-menu-label>
        <gn-dropdown-menu-separator />
        <gn-dropdown-menu-group>
          <gn-dropdown-menu-item>
            Edit <gn-dropdown-menu-shortcut>⌘E</gn-dropdown-menu-shortcut>
          </gn-dropdown-menu-item>
          <gn-dropdown-menu-item variant="destructive" [inset]="true"
            >Delete</gn-dropdown-menu-item
          >
        </gn-dropdown-menu-group>
        <gn-dropdown-menu-checkbox-item [checked]="true"
          >Toggle</gn-dropdown-menu-checkbox-item
        >
        <gn-dropdown-menu-radio-group>
          <gn-dropdown-menu-radio-item [checked]="true"
            >One</gn-dropdown-menu-radio-item
          >
        </gn-dropdown-menu-radio-group>
      </gn-dropdown-menu-content>
    </gn-dropdown-menu>
  `,
})
class Host {}

describe('DropdownMenu', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the menu parts with their data-slots', () => {
    const host = render();
    expect(host.querySelector('[data-slot="dropdown-menu"]')).not.toBeNull();
    expect(
      host.querySelector('[data-slot="dropdown-menu-content"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="dropdown-menu-label"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="dropdown-menu-separator"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="dropdown-menu-group"]'),
    ).not.toBeNull();
    expect(
      host.querySelectorAll('[data-slot="dropdown-menu-item"]').length,
    ).toBe(2);
    expect(
      host.querySelector('[data-slot="dropdown-menu-shortcut"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="dropdown-menu-checkbox-item"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="dropdown-menu-radio-group"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="dropdown-menu-radio-item"]'),
    ).not.toBeNull();
  });

  it('reflects variant/inset data-attributes on the item', () => {
    const host = render();
    const items = host.querySelectorAll('[data-slot="dropdown-menu-item"]');
    const destructive = items[1] as HTMLElement;
    expect(destructive.getAttribute('data-variant')).toBe('destructive');
    expect(destructive.getAttribute('data-inset')).toBe('');
    expect(destructive.className).toContain(
      'data-[variant=destructive]:text-destructive',
    );
  });

  it('renders the check/circle indicators for checkbox/radio items', () => {
    const host = render();
    const checkbox = host.querySelector(
      '[data-slot="dropdown-menu-checkbox-item"]',
    );
    const radio = host.querySelector('[data-slot="dropdown-menu-radio-item"]');
    expect(checkbox?.querySelector('svg')).not.toBeNull();
    expect(radio?.querySelector('svg')).not.toBeNull();
  });
});
