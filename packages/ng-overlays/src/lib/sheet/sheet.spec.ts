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
    <gn-sheet side="right">
      <button gn-sheet-trigger>Open sheet</button>
      <ng-template brnSheetContent>
        <gn-sheet-content side="right">
          <gn-sheet-header>
            <h2 gn-sheet-title>Edit settings</h2>
            <p gn-sheet-description>Adjust your preferences.</p>
          </gn-sheet-header>
          <gn-sheet-footer />
        </gn-sheet-content>
      </ng-template>
    </gn-sheet>
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
