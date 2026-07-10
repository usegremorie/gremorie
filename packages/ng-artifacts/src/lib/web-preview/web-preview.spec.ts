import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  WebPreview,
  WebPreviewBody,
  WebPreviewConsole,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  type WebPreviewLog,
} from './web-preview';

const LOGS: WebPreviewLog[] = [
  { level: 'log', message: 'App mounted', timestamp: new Date() },
  { level: 'error', message: 'boom', timestamp: new Date() },
];

@Component({
  standalone: true,
  imports: [
    WebPreview,
    WebPreviewNavigation,
    WebPreviewNavigationButton,
    WebPreviewUrl,
    WebPreviewBody,
    WebPreviewConsole,
  ],
  template: `
    <web-preview [defaultUrl]="url()">
      <web-preview-navigation>
        <web-preview-navigation-button tooltip="Reload"
          >R</web-preview-navigation-button
        >
        <web-preview-url />
      </web-preview-navigation>
      <web-preview-body />
      <web-preview-console [logs]="logs()" />
    </web-preview>
  `,
})
class Host {
  url = signal('https://example.com');
  logs = signal<WebPreviewLog[]>(LOGS);
}

function render() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  return fixture;
}

describe('WebPreview', () => {
  it('renders the card root with its data-slot', () => {
    const host = render().nativeElement as HTMLElement;
    const root = host.querySelector('[data-slot="web-preview"]');
    expect(root).not.toBeNull();
    expect((root as HTMLElement).className).toContain('rounded-lg');
  });

  it('seeds the URL input and the iframe src from defaultUrl', () => {
    const host = render().nativeElement as HTMLElement;
    const input = host.querySelector(
      'web-preview-url input',
    ) as HTMLInputElement;
    const iframe = host.querySelector(
      'web-preview-body iframe',
    ) as HTMLIFrameElement;
    expect(input.value).toBe('https://example.com');
    expect(iframe.getAttribute('src')).toBe('https://example.com');
    expect(iframe.getAttribute('sandbox')).toContain('allow-scripts');
  });

  it('keeps the tooltip text as the button aria-label', () => {
    const host = render().nativeElement as HTMLElement;
    const button = host.querySelector(
      'web-preview-navigation-button button',
    ) as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Reload');
    expect(button.getAttribute('title')).toBeNull();
  });

  it('shows the STYLED tooltip surface on hover (gn-tooltip, not native title)', async () => {
    const fixture = render();
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;

    // Regression: the tooltip once rendered as a native `title` attribute
    // instead of the styled gn-tooltip compound.
    expect(host.querySelector('[data-slot="tooltip-trigger"]')).not.toBeNull();

    // The anchor span carries a real box (inline-flex) so the CDK overlay
    // positions next to the trigger, never `contents` (empty rect).
    const trigger = host.querySelector(
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
    expect(surface?.textContent).toContain('Reload');
  });

  it('starts with the console collapsed and expands on toggle', () => {
    const fixture = render();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent).not.toContain('boom');
    const toggle = host.querySelector(
      'web-preview-console button',
    ) as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();
    expect(host.textContent).toContain('boom');
  });

  it('shows the empty placeholder when there are no logs', () => {
    const fixture = render();
    (fixture.componentInstance as Host).logs.set([]);
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector(
      'web-preview-console button',
    ) as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('No console output');
  });
});
