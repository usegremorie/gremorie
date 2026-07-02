import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  Queue,
  QueueItem,
  QueueItemContent,
  QueueItemIndicator,
  QueueList,
  QueueSection,
  QueueSectionContent,
  QueueSectionLabel,
  QueueSectionTrigger,
} from './queue';

@Component({
  standalone: true,
  imports: [
    Queue,
    QueueList,
    QueueItem,
    QueueItemIndicator,
    QueueItemContent,
    QueueSection,
    QueueSectionTrigger,
    QueueSectionLabel,
    QueueSectionContent,
  ],
  template: `
    <queue>
      <queue-list>
        <queue-item>
          <queue-item-indicator [completed]="true" />
          <queue-item-content [completed]="true">Done item</queue-item-content>
        </queue-item>
      </queue-list>
      <queue-section [defaultOpen]="open">
        <queue-section-trigger>
          <queue-section-label [count]="1" label="pending" />
        </queue-section-trigger>
        <queue-section-content>
          <span class="body">Section body</span>
        </queue-section-content>
      </queue-section>
    </queue>
  `,
})
class Host {
  open = true;
}

describe('Queue', () => {
  it('renders the queue container, a scrollable list and items', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    expect(host.querySelector('queue')?.getAttribute('data-slot')).toBe('queue');
    expect(host.querySelector('queue-list ul')).not.toBeNull();
    const content = host.querySelector('[data-slot="queue-item-content"]');
    expect(content?.className).toContain('line-through');
  });

  it('toggles section content visibility', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.open = false;
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.body')).toBeNull();
    expect(host.querySelector('queue-section')?.getAttribute('data-state')).toBe(
      'closed',
    );
  });
});
