import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';

import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './popover';

@Component({
  standalone: true,
  imports: [
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverDescription,
    BrnPopoverContent,
  ],
  template: `
    <gn-popover>
      <gn-popover-trigger [content]="content">Open</gn-popover-trigger>
      <ng-template #content brnPopoverContent>
        <gn-popover-content>
          <gn-popover-header>
            <gn-popover-title>Title</gn-popover-title>
            <gn-popover-description>Body</gn-popover-description>
          </gn-popover-header>
        </gn-popover-content>
      </ng-template>
    </gn-popover>
  `,
})
class Host {}

describe('Popover', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the root and trigger with their data-slots eagerly', () => {
    const host = render().nativeElement as HTMLElement;
    expect(host.querySelector('[data-slot="popover"]')).not.toBeNull();
    expect(host.querySelector('[data-slot="popover-trigger"]')).not.toBeNull();
  });

  it('renders the trigger as a button (content stays in the template until open)', () => {
    const host = render().nativeElement as HTMLElement;
    const trigger = host.querySelector('[data-slot="popover-trigger"]');
    expect(trigger?.querySelector('button')).not.toBeNull();
    // Content lives in the ng-template — not rendered until the popover opens.
    expect(host.querySelector('[data-slot="popover-content"]')).toBeNull();
  });
});
