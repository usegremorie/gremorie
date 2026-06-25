import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BrnHoverCardContent } from '@spartan-ng/brain/hover-card';

import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';

@Component({
  standalone: true,
  imports: [HoverCard, HoverCardTrigger, HoverCardContent, BrnHoverCardContent],
  template: `
    <gn-hover-card>
      <gn-hover-card-trigger [brnHoverCardTriggerFor]="content"
        >Hover me</gn-hover-card-trigger
      >
      <ng-template #content="brnHoverCardContent" brnHoverCardContent>
        <gn-hover-card-content>Preview</gn-hover-card-content>
      </ng-template>
    </gn-hover-card>
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
