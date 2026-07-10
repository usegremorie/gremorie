import { fakeAsync, TestBed, tick } from '@angular/core/testing';
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

  it('shows an arrowless surface on hover (no legacy square, brain arrow hidden)', fakeAsync(() => {
    const fixture = render();
    const anchor = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="tooltip-trigger"] > span',
    ) as HTMLElement;
    anchor.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    tick(300);
    fixture.detectChanges();

    const surface = document.querySelector('[data-slot="tooltip-content"]');
    expect(surface).not.toBeNull();
    // The old arrow was a rotated 2.5 square appended to the surface.
    expect(surface?.querySelector('.rotate-45')).toBeFalsy();
    // The brain content component ships its own arrow span + svg polygon;
    // the trigger's provider must render it hidden.
    const brainArrowSvg = surface?.parentElement?.querySelector('span > svg');
    if (brainArrowSvg) {
      expect(brainArrowSvg.parentElement?.classList.contains('hidden')).toBe(
        true,
      );
    }

    anchor.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    tick(500);
    fixture.detectChanges();
  }));

  it('gives the brnTooltip anchor span a real box (never display: contents)', () => {
    // Regression: with `class="contents"` the anchor reported an empty
    // getBoundingClientRect(), so the CDK overlay pinned the panel to the
    // viewport corner instead of the trigger.
    const host = render().nativeElement as HTMLElement;
    const anchor = host.querySelector<HTMLElement>(
      '[data-slot="tooltip-trigger"] > span',
    );
    expect(anchor).not.toBeNull();
    expect(anchor!.classList.contains('contents')).toBe(false);
    expect(anchor!.classList.contains('inline-flex')).toBe(true);
  });
});
