import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from './sidebar';

@Component({
  standalone: true,
  imports: [
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
  ],
  template: `
    <gn-sidebar-provider>
      <gn-sidebar collapsible="none">
        <gn-sidebar-content>
          <gn-sidebar-group>
            <gn-sidebar-group-content>
              <ul gn-sidebar-menu>
                <li gn-sidebar-menu-item>
                  <button gn-sidebar-menu-button [isActive]="true">
                    Dashboard
                  </button>
                </li>
              </ul>
            </gn-sidebar-group-content>
          </gn-sidebar-group>
        </gn-sidebar-content>
      </gn-sidebar>
      <gn-sidebar-trigger></gn-sidebar-trigger>
    </gn-sidebar-provider>
  `,
})
class Host {}

describe('Sidebar', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the provider wrapper and sidebar data-slots', () => {
    const host = render();
    expect(host.querySelector('[data-slot="sidebar-wrapper"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="sidebar"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="sidebar-content"]')).not.toBeNull();
  });

  it('marks the active menu button with data-active', () => {
    const host = render();
    const button = host.querySelector('[data-slot="sidebar-menu-button"]');
    expect(button?.getAttribute('data-active')).toBe('true');
  });

  it('renders the trigger button', () => {
    const host = render();
    const trigger = host.querySelector('[data-slot="sidebar-trigger"]');
    expect(trigger?.tagName.toLowerCase()).toBe('button');
  });
});
