import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from './menubar';

@Component({
  standalone: true,
  imports: [
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarSeparator,
    MenubarShortcut,
  ],
  template: `
    <gn-menubar>
      <gn-menubar-menu>
        <gn-menubar-trigger>File</gn-menubar-trigger>
        <gn-menubar-content>
          <gn-menubar-item
            >New Tab
            <gn-menubar-shortcut>⌘T</gn-menubar-shortcut></gn-menubar-item
          >
          <gn-menubar-separator></gn-menubar-separator>
          <gn-menubar-item>Print</gn-menubar-item>
        </gn-menubar-content>
      </gn-menubar-menu>
    </gn-menubar>
  `,
})
class Host {}

describe('Menubar', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders root, menu and trigger data-slots', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="menubar"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="menubar-menu"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="menubar-trigger"]')).not.toBeNull();
  });

  it('opens the content panel on trigger click and reflects data-state', () => {
    const fixture = render();
    const host = fixture.nativeElement as HTMLElement;
    const trigger = host.querySelector(
      '[data-slot="menubar-trigger"]',
    ) as HTMLButtonElement;

    expect(trigger.getAttribute('data-state')).toBe('closed');
    expect(host.querySelector('[data-slot="menubar-content"]')).toBeNull();

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('data-state')).toBe('open');
    expect(host.querySelector('[data-slot="menubar-content"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="menubar-item"]')).not.toBeNull();
  });
});
