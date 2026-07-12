import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PromptInputButton } from './prompt-input-button';

@Component({
  standalone: true,
  imports: [PromptInputButton],
  template: `
    <prompt-input-button tooltip="Attach a file" ariaLabel="Attach a file">
      <svg viewBox="0 0 24 24" class="size-4" aria-hidden="true"></svg>
    </prompt-input-button>
  `,
})
class Host {}

@Component({
  standalone: true,
  imports: [PromptInputButton],
  template: `<prompt-input-button ariaLabel="Send"></prompt-input-button>`,
})
class HostWithoutTooltip {}

describe('PromptInputButton', () => {
  it('renders the icon button with the accessible name', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();
    const button = fixture.nativeElement.querySelector('button');
    expect(button).not.toBeNull();
    expect(button.getAttribute('aria-label')).toBe('Attach a file');
  });

  it('shows the STYLED tooltip surface on hover (gr-tooltip, not bare brain)', async () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    await fixture.whenStable();

    // The styled compound must be present (regression: prompt-input-button
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
    expect(surface?.className).toContain('text-popover-foreground');
    expect(surface?.textContent).toContain('Attach a file');
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
