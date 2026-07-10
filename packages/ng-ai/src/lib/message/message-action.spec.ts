import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MessageAction } from './message-action';

@Component({
  standalone: true,
  imports: [MessageAction],
  template: `
    <message-action tooltip="Good response" label="Good response">
      <svg viewBox="0 0 24 24" class="size-4" aria-hidden="true"></svg>
    </message-action>
  `,
})
class Host {}

@Component({
  standalone: true,
  imports: [MessageAction],
  template: `<message-action label="Copy"></message-action>`,
})
class HostWithoutTooltip {}

describe('MessageAction', () => {
  it('renders the icon button with the accessible name', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('button');
    expect(button).not.toBeNull();
    expect(button.getAttribute('aria-label')).toBe('Good response');
  });

  it('shows the STYLED tooltip surface on hover (gn-tooltip, not bare brain)', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();

    // The styled compound must be present (regression: message-action once
    // passed the string to raw brnTooltip, rendering an unstyled overlay).
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
    expect(surface?.className).toContain('text-popover-foreground');
    expect(surface?.textContent).toContain('Good response');
  });

  it('renders a plain button when no tooltip is given', async () => {
    const fixture = TestBed.createComponent(HostWithoutTooltip);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('button')).not.toBeNull();
    expect(
      fixture.nativeElement.querySelector('[data-slot="tooltip-trigger"]'),
    ).toBeNull();
  });
});
