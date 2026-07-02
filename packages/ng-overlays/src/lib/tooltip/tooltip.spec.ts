import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

@Component({
  standalone: true,
  imports: [Tooltip, TooltipProvider, TooltipTrigger, TooltipContent],
  template: `
    <gn-tooltip-provider>
      <gn-tooltip>
        <gn-tooltip-trigger>
          <button type="button">Hover</button>
        </gn-tooltip-trigger>
        <gn-tooltip-content>Label</gn-tooltip-content>
      </gn-tooltip>
    </gn-tooltip-provider>
  `,
})
class Host {}

describe('Tooltip', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the provider, root and trigger with their data-slots eagerly', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="tooltip-provider"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="tooltip"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="tooltip-trigger"]')).not.toBeNull();
  });

  it('renders the trigger projection and keeps content in its template until shown', () => {
    const host = render().nativeElement as HTMLElement;
    const trigger = host.querySelector('[data-slot="tooltip-trigger"]');
    expect(trigger?.querySelector('button')).not.toBeNull();
    // Content surface lives in the ng-template — not rendered until shown.
    expect(host.querySelector('[data-slot="tooltip-content"]')).toBeNull();
  });
});
