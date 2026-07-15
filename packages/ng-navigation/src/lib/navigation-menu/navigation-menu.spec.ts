import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './navigation-menu';

@Component({
  standalone: true,
  imports: [
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
  ],
  template: `
    <gr-navigation-menu>
      <gr-navigation-menu-list>
        <gr-navigation-menu-item>
          <gr-navigation-menu-trigger>Products</gr-navigation-menu-trigger>
          <gr-navigation-menu-content>
            <a gr-navigation-menu-link href="#">Analytics</a>
          </gr-navigation-menu-content>
        </gr-navigation-menu-item>
      </gr-navigation-menu-list>
    </gr-navigation-menu>
  `,
})
class Host {}

describe('NavigationMenu', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders root, list, item, trigger and viewport data-slots', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="navigation-menu"]')).not.toBeNull();
    expect(
      host.querySelector('[data-slot="navigation-menu-list"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="navigation-menu-trigger"]'),
    ).not.toBeNull();
    expect(
      host.querySelector('[data-slot="navigation-menu-viewport"]'),
    ).not.toBeNull();
  });

  it('toggles the content panel and data-state when the trigger is clicked', () => {
    const fixture = render();
    const host = fixture.nativeElement as HTMLElement;
    const trigger = host.querySelector(
      '[data-slot="navigation-menu-trigger"]',
    ) as HTMLButtonElement;

    expect(trigger.getAttribute('data-state')).toBe('closed');
    expect(host.textContent).not.toContain('Analytics');

    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('data-state')).toBe('open');
    expect(host.textContent).toContain('Analytics');
  });
});
