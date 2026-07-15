import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BrnSheetContent } from '@spartan-ng/brain/sheet';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';

// The panel lives inside a `<ng-template brnSheetContent>` and renders into a
// CDK overlay only when opened. The spec asserts the eagerly rendered root +
// trigger and confirms the content stays in the template.
@Component({
  standalone: true,
  imports: [
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
    BrnSheetContent,
  ],
  template: `
    <gr-sheet side="right">
      <button gr-sheet-trigger>Open sheet</button>
      <ng-template brnSheetContent>
        <gr-sheet-content side="right">
          <gr-sheet-header>
            <h2 gr-sheet-title>Edit settings</h2>
            <p gr-sheet-description>Adjust your preferences.</p>
          </gr-sheet-header>
          <gr-sheet-footer />
        </gr-sheet-content>
      </ng-template>
    </gr-sheet>
  `,
})
class Host {}

describe('Sheet', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the root and trigger with their data-slots eagerly', () => {
    const host = render();
    expect(host.querySelector('[data-slot="sheet"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="sheet-trigger"]')).not.toBeNull();
  });

  it('renders the trigger as a button and keeps the content in the template', () => {
    const host = render();
    const trigger = host.querySelector('[data-slot="sheet-trigger"]');
    expect(trigger?.tagName.toLowerCase()).toBe('button');
    // Content lives in the ng-template — not rendered until the sheet opens.
    expect(host.querySelector('[data-slot="sheet-content"]')).toBeNull();
  });
});
