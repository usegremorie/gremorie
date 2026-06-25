import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './resizable';

@Component({
  standalone: true,
  imports: [ResizablePanelGroup, ResizablePanel, ResizableHandle],
  template: `
    <gn-resizable-panel-group [direction]="direction">
      <gn-resizable-panel [defaultSize]="40" [minSize]="20"
        >A</gn-resizable-panel
      >
      <gn-resizable-handle [withHandle]="withHandle" />
      <gn-resizable-panel [defaultSize]="60">B</gn-resizable-panel>
    </gn-resizable-panel-group>
  `,
})
class Host {
  direction: 'horizontal' | 'vertical' = 'horizontal';
  withHandle = true;
}

describe('Resizable', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    return { fixture, root };
  }

  it('mounts the group, panels and handle with their data-slots', () => {
    const { root } = render();
    expect(
      root.querySelector('[data-slot="resizable-panel-group"]'),
    ).toBeTruthy();
    expect(root.querySelectorAll('[data-slot="resizable-panel"]').length).toBe(
      2,
    );
    expect(root.querySelector('[data-slot="resizable-handle"]')).toBeTruthy();
  });

  it('forwards direction onto the brain group (data attribute)', () => {
    const { fixture, root } = render();
    const group = root.querySelector(
      '[data-slot="resizable-panel-group"]',
    ) as HTMLElement;
    expect(group.getAttribute('data-panel-group-direction')).toBe('horizontal');

    fixture.componentInstance.direction = 'vertical';
    fixture.detectChanges();
    expect(group.getAttribute('data-panel-group-direction')).toBe('vertical');
  });

  it('renders the grip only when withHandle is set', () => {
    const { fixture, root } = render();
    const handle = root.querySelector(
      '[data-slot="resizable-handle"]',
    ) as HTMLElement;
    expect(handle.querySelector('svg')).toBeTruthy();

    fixture.componentInstance.withHandle = false;
    fixture.detectChanges();
    expect(handle.querySelector('svg')).toBeNull();
  });
});
