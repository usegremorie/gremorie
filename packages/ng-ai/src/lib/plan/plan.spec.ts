import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from './plan';

@Component({
  standalone: true,
  imports: [Plan, PlanHeader, PlanTitle, PlanDescription, PlanAction, PlanContent, PlanTrigger],
  template: `
    <plan [open]="open">
      <plan-header>
        <div>
          <plan-title children="Refactor auth" />
          <plan-description children="Split the handler." />
        </div>
        <plan-action><plan-trigger /></plan-action>
      </plan-header>
      <plan-content>
        <p class="step">Step one</p>
      </plan-content>
    </plan>
  `,
})
class Host {
  open = false;
}

describe('Plan', () => {
  it('renders the card surface with the correct data-slots', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const plan = host.querySelector('plan');
    expect(plan?.getAttribute('data-slot')).toBe('plan');
    expect(plan?.getAttribute('data-state')).toBe('closed');
    expect(host.querySelector('[data-slot="plan-title"]')?.textContent).toContain(
      'Refactor auth',
    );
    // Collapsed: content body should not render.
    expect(host.querySelector('.step')).toBeNull();
  });

  it('reveals content when open', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = true;
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('plan')?.getAttribute('data-state')).toBe('open');
    expect(host.querySelector('.step')).not.toBeNull();
  });
});
