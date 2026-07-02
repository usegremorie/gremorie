import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BrnAlertDialogContent } from '@spartan-ng/brain/alert-dialog';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './alert-dialog';

// The panel lives inside a `<ng-template brnAlertDialogContent>` and renders
// into a CDK overlay only when opened. The spec asserts the eagerly rendered
// root + trigger and confirms the content stays in the template.
@Component({
  standalone: true,
  imports: [
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
    BrnAlertDialogContent,
  ],
  template: `
    <gn-alert-dialog>
      <button gn-alert-dialog-trigger>Delete</button>
      <ng-template brnAlertDialogContent>
        <gn-alert-dialog-content>
          <gn-alert-dialog-header>
            <h2 gn-alert-dialog-title>Are you sure?</h2>
            <p gn-alert-dialog-description>This cannot be undone.</p>
          </gn-alert-dialog-header>
          <gn-alert-dialog-footer>
            <button gn-alert-dialog-cancel>Cancel</button>
            <button gn-alert-dialog-action variant="destructive">Delete</button>
          </gn-alert-dialog-footer>
        </gn-alert-dialog-content>
      </ng-template>
    </gn-alert-dialog>
  `,
})
class Host {}

describe('AlertDialog', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders the root and trigger with their data-slots eagerly', () => {
    const host = render();
    expect(host.querySelector('[data-slot="alert-dialog"]')).not.toBeNull();
    expect(
      host.querySelector('[data-slot="alert-dialog-trigger"]'),
    ).not.toBeNull();
  });

  it('renders the trigger as a button and keeps the content in the template', () => {
    const host = render();
    const trigger = host.querySelector('[data-slot="alert-dialog-trigger"]');
    expect(trigger?.tagName.toLowerCase()).toBe('button');
    // Content lives in the ng-template — not rendered until the dialog opens.
    expect(host.querySelector('[data-slot="alert-dialog-content"]')).toBeNull();
  });
});
