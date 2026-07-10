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
  ],
  template: `
    <gn-sidebar-provider [open]="open">
      <gn-sidebar collapsible="icon">
        <gn-sidebar-content>
          <gn-sidebar-group>
            <gn-sidebar-group-content>
              <ul gn-sidebar-menu>
                <li gn-sidebar-menu-item>
                  <button gn-sidebar-menu-button tooltip="Dashboard">
                    <span>Dashboard</span>
                  </button>
                </li>
              </ul>
            </gn-sidebar-group-content>
          </gn-sidebar-group>
        </gn-sidebar-content>
      </gn-sidebar>
    </gn-sidebar-provider>
  `,
})
class TooltipHost {
  open = false;
}

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

  it('shows the STYLED tooltip surface on hover when collapsed (gn-tooltip, not native title)', async () => {
    TestBed.configureTestingModule({ imports: [TooltipHost] });
    const fixture = TestBed.createComponent(TooltipHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    // Regression: the collapsed tooltip once rendered as a native `title`
    // attribute instead of the styled gn-tooltip compound.
    const button = host.querySelector('[data-slot="sidebar-menu-button"]');
    expect(button?.getAttribute('title')).toBeNull();
    expect(host.querySelector('[data-slot="tooltip-trigger"]')).not.toBeNull();

    // The hover target is the trigger's inner anchor span (the element
    // carrying `brnTooltip`); the host itself is `display: contents`.
    const trigger = host.querySelector(
      '[data-slot="tooltip-trigger"] span',
    ) as HTMLElement;
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((r) => setTimeout(r, 0));
    fixture.detectChanges();

    const surface = document.querySelector('[data-slot="tooltip-content"]');
    expect(surface).not.toBeNull();
    expect(surface?.className).toContain('bg-popover');
    expect(surface?.textContent).toContain('Dashboard');
  });

  it('does not mount the tooltip compound while expanded, mirroring the React hidden condition', async () => {
    TestBed.configureTestingModule({ imports: [TooltipHost] });
    const fixture = TestBed.createComponent(TooltipHost);
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(
      host.querySelector('[data-slot="sidebar-menu-button"]'),
    ).not.toBeNull();
    expect(host.querySelector('[data-slot="tooltip-trigger"]')).toBeNull();
  });
});
