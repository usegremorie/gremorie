import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
} from './open-in-chat';

@Component({
  standalone: true,
  imports: [OpenIn, OpenInContent, OpenInChatGPT, OpenInClaude],
  template: `
    <open-in [query]="query">
      <open-in-content>
        <open-in-chatgpt />
        <open-in-claude />
      </open-in-content>
    </open-in>
  `,
})
class Host {
  query = 'Explain closures';
}

describe('OpenIn', () => {
  it('builds provider deep-links from the query', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const chatgpt = host.querySelector(
      '[data-slot="open-in-chatgpt"] a',
    ) as HTMLAnchorElement;
    expect(chatgpt).not.toBeNull();
    expect(chatgpt.getAttribute('href')).toContain('chatgpt.com');
    expect(chatgpt.getAttribute('href')).toContain('Explain');
    expect(chatgpt.textContent).toContain('Open in ChatGPT');

    const claude = host.querySelector(
      '[data-slot="open-in-claude"] a',
    ) as HTMLAnchorElement;
    expect(claude.getAttribute('href')).toContain('claude.ai/new');
  });
});
