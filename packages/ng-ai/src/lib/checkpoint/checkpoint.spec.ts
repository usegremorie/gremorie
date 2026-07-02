import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Checkpoint, CheckpointIcon, CheckpointTrigger } from './checkpoint';

@Component({
  standalone: true,
  imports: [Checkpoint, CheckpointIcon, CheckpointTrigger],
  template: `
    <checkpoint>
      <checkpoint-trigger tooltip="Restore">
        <checkpoint-icon />
        Checkpoint
      </checkpoint-trigger>
    </checkpoint>
  `,
})
class Host {}

describe('Checkpoint', () => {
  it('renders the row, a trailing separator, icon and trigger', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const checkpoint = host.querySelector('checkpoint');
    expect(checkpoint?.getAttribute('data-slot')).toBe('checkpoint');
    expect(checkpoint?.className).toContain('text-muted-foreground');

    expect(host.querySelector('gn-separator')).not.toBeNull();
    expect(host.querySelector('[data-slot="checkpoint-icon"] svg')).not.toBeNull();

    const trigger = host.querySelector('checkpoint-trigger button');
    expect(trigger).not.toBeNull();
    expect(trigger?.textContent).toContain('Checkpoint');
  });
});
