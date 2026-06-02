import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocsApiTable, ApiRow } from '../../../shared/api-table.component';
import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import {
  DocsPage,
  DocsSection,
  DocsProse,
} from '../../../shared/doc-page.component';

@Component({
  selector: 'docs-prompt-input-action-menu',
  imports: [
    DocsLayout,
    DocsPage,
    DocsSection,
    DocsProse,
    DocsCodeBlock,
    DocsApiTable,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Component · Menu"
        title="PromptInputActionMenu"
        lede="Dropdown menu for tools that don't fit as direct buttons (take photo, record voice, connect…). Trigger is a '+' icon; content is projected via ng-content."
      >
        <docs-section title="Basic usage" anchor="usage">
          <docs-code-block lang="html" [code]="usage" />
        </docs-section>

        <docs-section title="API — Inputs" anchor="api">
          <docs-api-table [rows]="inputs" />
        </docs-section>

        <docs-section title="Behavior" anchor="behavior">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li>Closes on outside click</li>
              <li>Closes on <code>Escape</code></li>
              <li>Disabled inherits from parent PromptInput via DI</li>
              <li>
                Opens with a motion-safe pop-in animation (skipped under
                prefers-reduced-motion)
              </li>
            </ul>
          </docs-prose>
        </docs-section>

        <docs-section title="Accessibility" anchor="a11y">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li>
                Trigger has <code>aria-haspopup="menu"</code> and
                <code>aria-expanded</code>
              </li>
              <li>
                Open panel has <code>role="menu"</code> with the same aria-label
                as the trigger
              </li>
              <li>
                <strong>v0.1 note</strong>: keyboard navigation inside the menu
                is limited (no arrow-key roving tabindex yet). Migration to
                <code>&#64;spartan-ng/brain/menu</code> planned for v0.2.
              </li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class PromptInputActionMenuPage {
  protected readonly usage = `<prompt-input-action-menu ariaLabel="More actions">
  <button type="button" class="…" (click)="takePhoto()">Take a photo</button>
  <button type="button" class="…" (click)="recordVoice()">Record voice</button>
  <button type="button" class="…" (click)="connectTool()">Connect tool…</button>
</prompt-input-action-menu>`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'ariaLabel',
      type: 'string',
      default: "'More actions'",
      description: 'Accessible label for the trigger and menu.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disable independently of parent.',
    },
  ];
}
