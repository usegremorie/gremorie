import { TestBed } from '@angular/core/testing';
import { Component, input } from '@angular/core';
import { BrnDrawerContent } from '@spartan-ng/brain/drawer';
import { afterEach, describe, expect, it } from 'vitest';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  type DrawerDirection,
} from './drawer';

// The panel lives inside a `<ng-template brnDrawerContent>` and renders into a
// CDK overlay only when opened. The drawer is built on the brain Drawer, whose
// handle directive (on the whole panel, as with vaul) drives drag to dismiss.
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
    DrawerClose,
    BrnDrawerContent,
  ],
  template: `
    <gr-drawer [direction]="direction()">
      <button gr-drawer-trigger>Open</button>
      <ng-template brnDrawerContent>
        <gr-drawer-content>
          <gr-drawer-header>
            <h2 gr-drawer-title>Move goal</h2>
            <p gr-drawer-description>Set your daily activity goal.</p>
          </gr-drawer-header>
          <gr-drawer-footer>
            <button gr-drawer-close>Cancel</button>
          </gr-drawer-footer>
        </gr-drawer-content>
      </ng-template>
    </gr-drawer>
  `,
})
class Host {
  readonly direction = input<DrawerDirection>('bottom');
}

describe('Drawer', () => {
  function render(direction: DrawerDirection = 'bottom') {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.componentRef.setInput('direction', direction);
    fixture.detectChanges();
    return fixture;
  }

  const open = (fixture: ReturnType<typeof render>) => {
    (
      fixture.nativeElement.querySelector(
        '[data-slot="drawer-trigger"]',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();
    return document.querySelector('[data-slot="drawer-content"]');
  };

  afterEach(() => {
    document
      .querySelectorAll('.cdk-overlay-container')
      .forEach((el) => (el.innerHTML = ''));
  });

  it('renders the root and trigger with their data-slots eagerly', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="drawer"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="drawer-trigger"]')).not.toBeNull();
  });

  it('renders the trigger as a button and keeps the content in the template', () => {
    const host = render().nativeElement as HTMLElement;
    const trigger = host.querySelector('[data-slot="drawer-trigger"]');
    expect(trigger?.tagName.toLowerCase()).toBe('button');
    expect(host.querySelector('[data-slot="drawer-content"]')).toBeNull();
  });

  it('opens the panel with the drag handle on the whole panel', () => {
    const content = open(render());
    expect(content).not.toBeNull();
    // brnDrawerHandle marks its host presentational and listens for pointerdown.
    expect(content?.getAttribute('role')).toBe('presentation');
    expect(content?.getAttribute('data-vaul-drawer-direction')).toBe('bottom');
  });

  it('takes its direction from gr-drawer, as React takes it from Drawer', () => {
    const content = open(render('right'));
    expect(content?.getAttribute('data-vaul-drawer-direction')).toBe('right');
  });
});
