import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BrnDialogContent } from '@spartan-ng/brain/dialog';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';

// The panel lives inside a `<ng-template brnDialogContent>` and is rendered
// into a CDK overlay only when the dialog opens. The spec asserts the eagerly
// rendered root + trigger and confirms the content stays in the template.
@Component({
  standalone: true,
  imports: [
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    BrnDialogContent,
  ],
  template: `
    <gr-dialog>
      <button gr-dialog-trigger>Open</button>
      <ng-template brnDialogContent>
        <gr-dialog-content>
          <gr-dialog-header>
            <h2 gr-dialog-title>Title</h2>
            <p gr-dialog-description>Description</p>
          </gr-dialog-header>
          <gr-dialog-footer />
        </gr-dialog-content>
      </ng-template>
    </gr-dialog>
  `,
})
class Host {}

describe('Dialog', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the root and trigger with their data-slots eagerly', () => {
    const host = render();
    expect(host.querySelector('[data-slot="dialog"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="dialog-trigger"]')).not.toBeNull();
  });

  it('renders the trigger as a button and keeps the content in the template', () => {
    const host = render();
    const trigger = host.querySelector('[data-slot="dialog-trigger"]');
    expect(trigger?.tagName.toLowerCase()).toBe('button');
    // Content lives in the ng-template — not rendered until the dialog opens.
    expect(host.querySelector('[data-slot="dialog-content"]')).toBeNull();
  });
});
