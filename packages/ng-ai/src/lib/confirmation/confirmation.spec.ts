import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  Confirmation,
  ConfirmationAccepted,
  ConfirmationAction,
  ConfirmationActions,
  ConfirmationRequest,
  ConfirmationTitle,
  type ToolUIPartApproval,
} from './confirmation';
import type { ToolState } from '../tool/tool.types';

@Component({
  standalone: true,
  imports: [
    Confirmation,
    ConfirmationTitle,
    ConfirmationRequest,
    ConfirmationAccepted,
    ConfirmationActions,
    ConfirmationAction,
  ],
  template: `
    <confirmation [approval]="approval" [state]="state">
      <confirmation-request>
        <confirmation-title>Allow?</confirmation-title>
      </confirmation-request>
      <confirmation-accepted>
        <span class="ok">Approved</span>
      </confirmation-accepted>
      <confirmation-actions>
        <confirmation-action>Allow</confirmation-action>
      </confirmation-actions>
    </confirmation>
  `,
})
class Host {
  approval: ToolUIPartApproval = { id: 't1' };
  state: ToolState = 'approval-requested';
}

describe('Confirmation', () => {
  it('renders nothing while no approval is present', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.approval = undefined;
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('[role="alert"]')).toBeNull();
  });

  it('shows the request prompt + actions when approval is requested', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('[role="alert"]')).not.toBeNull();
    expect(
      host.querySelector('[data-slot="confirmation-actions"] button'),
    ).not.toBeNull();
    expect(host.querySelector('.ok')).toBeNull();
  });

  it('shows the accepted message once approved + responded', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.approval = { id: 't1', approved: true };
    fixture.componentInstance.state = 'approval-responded';
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.ok')).not.toBeNull();
  });
});
