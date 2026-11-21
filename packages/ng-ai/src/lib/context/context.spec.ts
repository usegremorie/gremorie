import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  Context,
  ContextContentHeader,
  ContextInputUsage,
  ContextTrigger,
  type ContextTriggerDisplay,
} from './context';

@Component({
  standalone: true,
  imports: [Context, ContextTrigger, ContextContentHeader, ContextInputUsage],
  template: `
    <gr-context [usedTokens]="used" [maxTokens]="200000" [usage]="usage">
      <gr-context-trigger [display]="display" />
      <gr-context-content-header />
      <gr-context-input-usage />
    </gr-context>
  `,
})
class Host {
  used = 50000;
  display: ContextTriggerDisplay = 'full';
  usage = { inputTokens: 8000, outputTokens: 1000 };
}

describe('Context', () => {
  it('renders the trigger percentage and a usage header', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const trigger = host.querySelector('[data-slot="context-trigger"]');
    expect(trigger).not.toBeNull();
    // 50000 / 200000 = 25%
    expect(trigger?.textContent).toContain('25%');

    const header = host.querySelector('[data-slot="context-content-header"]');
    expect(header?.textContent).toContain('50K');
    expect(header?.textContent).toContain('200K');

    const input = host.querySelector('[data-slot="context-input-usage"]');
    expect(input?.textContent).toContain('Input');
    expect(input?.textContent).toContain('8K');
  });

  it('keeps the percentage in the trigger name and clamps the ring', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.used = 260000;
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="context-trigger"] button',
    );
    expect(button?.getAttribute('aria-label')).toBe(
      'Context window: 130% used (260K of 200K tokens)',
    );
    const ring = button?.querySelectorAll('circle')[1];
    expect(Number(ring?.getAttribute('stroke-dashoffset'))).toBe(0);
  });

  it('shows only the ring in compact display', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.display = 'compact';
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="context-trigger"] button',
    );
    expect(button?.getAttribute('data-display')).toBe('compact');
    expect(button?.querySelector('span')).toBeNull();
    expect(button?.className).toContain('size-8');
    expect(button?.getAttribute('aria-label')).toContain('25%');
  });

  it('hides the percentage below the container breakpoint in auto display', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.display = 'auto';
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-slot="context-trigger"] button',
    );
    expect(button?.querySelector('span')?.className).toContain(
      '@max-sm:hidden',
    );
    expect(button?.className).toContain('@max-sm:w-8');
  });
});
