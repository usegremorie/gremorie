import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BrnHoverCardContent } from '@spartan-ng/brain/hover-card';

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

@Component({
  standalone: true,
  imports: [HoverCard, HoverCardTrigger, HoverCardContent, BrnHoverCardContent],
  template: `
    <gr-hover-card>
      <gr-hover-card-trigger [brnHoverCardTriggerFor]="content"
        >Hover me</gr-hover-card-trigger
      >
      <ng-template #content="brnHoverCardContent" brnHoverCardContent>
        <gr-hover-card-content>Preview</gr-hover-card-content>
      </ng-template>
    </gr-hover-card>
  `,
})
class Host {}

describe('HoverCard', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the root and trigger with their data-slots eagerly', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="hover-card"]')).not.toBeNull();
    expect(
      host.querySelector('[data-slot="hover-card-trigger"]'),
    ).not.toBeNull();
  });

  it('keeps the content in the template until hovered', () => {
    const host = render().nativeElement as HTMLElement;
    // Content lives in the ng-template — not rendered until the card opens.
    expect(host.querySelector('[data-slot="hover-card-content"]')).toBeNull();
  });
});
