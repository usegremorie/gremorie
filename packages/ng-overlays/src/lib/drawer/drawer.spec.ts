import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BrnSheetContent } from '@spartan-ng/brain/sheet';

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer';

// The panel lives inside a `<ng-template brnSheetContent>` (the Drawer is built
// on the brain Sheet) and renders into a CDK overlay only when opened. The spec
// asserts the eagerly rendered root + trigger and confirms the content stays in
// the template.
@Component({
  standalone: true,
  imports: [
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
    DrawerDescription,
    BrnSheetContent,
  ],
  template: `
    <gn-drawer side="bottom">
      <button gn-drawer-trigger>Open</button>
      <ng-template brnSheetContent>
        <gn-drawer-content direction="bottom">
          <gn-drawer-header>
            <h2 gn-drawer-title>Move goal</h2>
            <p gn-drawer-description>Set your daily activity goal.</p>
          </gn-drawer-header>
          <gn-drawer-footer />
        </gn-drawer-content>
      </ng-template>
    </gn-drawer>
  `,
})
class Host {}

describe('Drawer', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the root and trigger with their data-slots eagerly', () => {
    const host = render();
    expect(host.querySelector('[data-slot="drawer"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="drawer-trigger"]')).not.toBeNull();
  });

  it('renders the trigger as a button and keeps the content in the template', () => {
    const host = render();
    const trigger = host.querySelector('[data-slot="drawer-trigger"]');
    expect(trigger?.tagName.toLowerCase()).toBe('button');
    // Content lives in the ng-template — not rendered until the drawer opens.
    expect(host.querySelector('[data-slot="drawer-content"]')).toBeNull();
  });
});
