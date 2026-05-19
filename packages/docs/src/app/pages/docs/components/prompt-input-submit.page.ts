import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocsApiTable, ApiRow } from '../../../shared/api-table.component';
import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../../shared/doc-page.component';

@Component({
  selector: 'docs-prompt-input-submit',
  imports: [DocsLayout, DocsPage, DocsSection, DocsProse, DocsCodeBlock, DocsApiTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Component · Action"
        title="PromptInputSubmit"
        lede="The submit button. Renders 4 distinct icons and color treatments based on the parent's state. Clicking calls parent.submit() which delegates to submitted / canceled / retried per state."
      >
        <docs-section title="Basic usage" anchor="usage">
          <docs-code-block lang="html" [code]="usage" />
        </docs-section>

        <docs-section title="Visual states" anchor="states">
          <docs-api-table [rows]="states" [showDefault]="false" />
        </docs-section>

        <docs-section title="API — Inputs" anchor="api">
          <docs-api-table [rows]="inputs" />
        </docs-section>

        <docs-section title="Accessibility" anchor="a11y">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><code>aria-label</code> updates per state: "Send message" / "Submitting" / "Stop generating" / "Retry"</li>
              <li><code>aria-busy="true"</code> during <code>submitted</code> and <code>streaming</code></li>
              <li><code>data-state</code> attribute exposes current state for CSS targeting</li>
              <li>Disabled when parent is disabled OR when value is empty in <code>ready</code> state</li>
              <li>Focus ring respects <code>--ring</code> token</li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class PromptInputSubmitPage {
  protected readonly usage = `<prompt-input>
  <prompt-input-textarea />
  <prompt-input-toolbar>
    <prompt-input-submit />
  </prompt-input-toolbar>
</prompt-input>`;

  protected readonly states: readonly ApiRow[] = [
    { name: 'ready', type: 'state', description: 'Primary background, arrow icon. Click submits.' },
    { name: 'submitted', type: 'state', description: 'Muted background, spinning ring. Click is no-op (button disabled).' },
    { name: 'streaming', type: 'state', description: 'Destructive/10 background, stop square icon. Click cancels.' },
    { name: 'error', type: 'state', description: 'Destructive background, alert icon. Click retries.' },
  ];

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable independently of parent.' },
  ];
}
