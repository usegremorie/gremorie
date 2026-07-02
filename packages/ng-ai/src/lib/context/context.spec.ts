import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  Context,
  ContextContentHeader,
  ContextInputUsage,
  ContextTrigger,
} from './context';

@Component({
  standalone: true,
  imports: [Context, ContextTrigger, ContextContentHeader, ContextInputUsage],
  template: `
    <context [usedTokens]="50000" [maxTokens]="200000" [usage]="usage">
      <context-trigger />
      <context-content-header />
      <context-input-usage />
    </context>
  `,
})
class Host {
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
});
