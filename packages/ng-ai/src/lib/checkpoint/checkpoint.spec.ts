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

    expect(host.querySelector('gr-separator')).not.toBeNull();
    expect(
      host.querySelector('[data-slot="checkpoint-icon"] svg'),
    ).not.toBeNull();

    const trigger = host.querySelector('checkpoint-trigger button');
    expect(trigger).not.toBeNull();
    expect(trigger?.textContent).toContain('Checkpoint');
  });

  it('shows the STYLED tooltip surface on hover (gr-tooltip, not bare brain)', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();

    // The styled compound must be present (regression: checkpoint-trigger
    // once passed the string to raw brnTooltip, rendering an unstyled
    // overlay).
    expect(
      fixture.nativeElement.querySelector('[data-slot="tooltip-trigger"]'),
    ).not.toBeNull();

    // The anchor span carries a real box (inline-flex) so the CDK overlay
    // positions next to the trigger — never `contents` (empty rect).
    const trigger = fixture.nativeElement.querySelector(
      '[data-slot="tooltip-trigger"] > span',
    ) as HTMLElement;
    expect(trigger.classList.contains('contents')).toBe(false);
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
    await fixture.whenStable();
    await new Promise((r) => setTimeout(r, 0));
    fixture.detectChanges();

    const surface = document.querySelector('[data-slot="tooltip-content"]');
    expect(surface).not.toBeNull();
    expect(surface?.className).toContain('bg-popover');
    expect(surface?.textContent).toContain('Restore');
  });
});
