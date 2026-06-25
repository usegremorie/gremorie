import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import {
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorShortcut,
} from './model-selector';

/**
 * The command-backed parts (`model-selector-content` / `-input` / `-item`)
 * wrap `@spartan-ng/brain/command` directives, which require the live
 * `BrnCommand` host wiring and resolve through the element injector — they
 * render correctly in the real build/Storybook but are awkward to instantiate
 * in isolation under the zoneless TestBed (see the Reasoning/Assistant specs
 * for the same projection caveat). This smoke test covers the presentational
 * leaves that carry the React-parity behavior: the logo URL builder, the name
 * slot, and the shortcut slot.
 */
@Component({
  standalone: true,
  imports: [ModelSelectorLogo, ModelSelectorName, ModelSelectorShortcut],
  template: `
    <model-selector-logo provider="anthropic" />
    <model-selector-name>Claude 3.5 Sonnet</model-selector-name>
    <model-selector-shortcut>⌘1</model-selector-shortcut>
  `,
})
class Host {}

describe('ModelSelector', () => {
  it('builds the provider logo URL and renders the name + shortcut slots', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;

    const logo = host.querySelector(
      '[data-slot="model-selector-logo"] img',
    ) as HTMLImageElement;
    expect(logo).not.toBeNull();
    expect(logo.getAttribute('src')).toBe(
      'https://models.dev/logos/anthropic.svg',
    );
    expect(logo.getAttribute('alt')).toBe('anthropic logo');

    expect(
      host.querySelector('[data-slot="model-selector-name"]')?.textContent,
    ).toContain('Claude 3.5 Sonnet');
    expect(
      host.querySelector('[data-slot="model-selector-shortcut"]')?.textContent,
    ).toContain('⌘1');
  });
});
