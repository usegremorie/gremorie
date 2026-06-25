import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from './context-menu';

// The trigger opens a BrnPopover overlay (content not rendered eagerly when
// wired through `brnPopoverTriggerFor`). Here we render the content parts
// inline to assert their data-slots and class strings.
@Component({
  standalone: true,
  imports: [
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuCheckboxItem,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuShortcut,
  ],
  template: `
    <gn-context-menu>
      <gn-context-menu-content>
        <gn-context-menu-label>Actions</gn-context-menu-label>
        <gn-context-menu-separator />
        <gn-context-menu-group>
          <gn-context-menu-item>
            Back <gn-context-menu-shortcut>⌘[</gn-context-menu-shortcut>
          </gn-context-menu-item>
          <gn-context-menu-item variant="destructive" [inset]="true"
            >Delete</gn-context-menu-item
          >
        </gn-context-menu-group>
        <gn-context-menu-checkbox-item [checked]="true"
          >Toggle</gn-context-menu-checkbox-item
        >
        <gn-context-menu-radio-group>
          <gn-context-menu-radio-item [checked]="true"
            >One</gn-context-menu-radio-item
          >
        </gn-context-menu-radio-group>
      </gn-context-menu-content>
    </gn-context-menu>
  `,
})
class Host {}

describe('ContextMenu', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the menu parts with their data-slots', () => {
    const host = render();
    expect(host.querySelector('[data-slot="context-menu"]')).not.toBeNull();
    expect(
      host.querySelector('[data-slot="context-menu-content"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="context-menu-label"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="context-menu-separator"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="context-menu-group"]'),
    ).not.toBeNull();
    expect(
      host.querySelectorAll('[data-slot="context-menu-item"]').length,
    ).toBe(2);
    expect(
      host.querySelector('[data-slot="context-menu-shortcut"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="context-menu-checkbox-item"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="context-menu-radio-group"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="context-menu-radio-item"]'),
    ).not.toBeNull();
  });

  it('reflects variant/inset data-attributes on the item', () => {
    const host = render();
    const items = host.querySelectorAll('[data-slot="context-menu-item"]');
    const destructive = items[1] as HTMLElement;
    expect(destructive.getAttribute('data-variant')).toBe('destructive');
    expect(destructive.getAttribute('data-inset')).toBe('');
  });

  it('renders the check/circle indicators for checkbox/radio items', () => {
    const host = render();
    expect(
      host
        .querySelector('[data-slot="context-menu-checkbox-item"]')
        ?.querySelector('svg'),
    ).not.toBeNull();
    expect(
      host
        .querySelector('[data-slot="context-menu-radio-item"]')
        ?.querySelector('svg'),
    ).not.toBeNull();
  });
});
