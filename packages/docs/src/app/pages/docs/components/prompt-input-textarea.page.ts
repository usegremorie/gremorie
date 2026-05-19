import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocsApiTable, ApiRow } from '../../../shared/api-table.component';
import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../../shared/doc-page.component';

@Component({
  selector: 'docs-prompt-input-textarea',
  imports: [DocsLayout, DocsPage, DocsSection, DocsProse, DocsCodeBlock, DocsApiTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Component · Input"
        title="PromptInputTextarea"
        lede="Auto-expanding textarea. Inherits state and disabled from its PromptInput parent via DI. Uses field-sizing: content with a JS fallback for older browsers."
      >
        <docs-section title="Basic usage" anchor="usage">
          <docs-code-block lang="html" [code]="usage" />
        </docs-section>

        <docs-section title="API — Inputs" anchor="api">
          <docs-api-table [rows]="inputs" />
        </docs-section>

        <docs-section title="API — Methods" anchor="methods">
          <docs-api-table [rows]="methods" [showDefault]="false" />
        </docs-section>

        <docs-section title="Accessibility" anchor="a11y">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li>Renders a native <code>&lt;textarea&gt;</code> with <code>aria-multiline="true"</code></li>
              <li><code>aria-disabled</code> mirrors parent's <code>disabled</code></li>
              <li><code>data-state</code> attribute exposes parent state</li>
              <li>Automatically disables while parent is in <code>submitted</code> state</li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class PromptInputTextareaPage {
  protected readonly usage = `<prompt-input>
  <prompt-input-textarea
    placeholder="Ask anything…"
    [maxHeightPx]="240"
    [maxLength]="4000"
  />
</prompt-input>`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'placeholder', type: 'string', default: "'Ask anything…'", description: 'Native placeholder text.' },
    { name: 'rows', type: 'number', default: '1', description: 'Initial row count.' },
    { name: 'maxLength', type: 'number | null', default: 'null', description: 'Hard cap on character count.' },
    { name: 'maxHeightPx', type: 'number', default: '192', description: 'Maximum height before scroll. 12rem default.' },
    { name: 'ariaLabel', type: 'string', default: "'Prompt'", description: 'aria-label for the textarea.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'focus()', type: '() => void', description: 'Focus the textarea programmatically.' },
    { name: 'blur()', type: '() => void', description: 'Blur the textarea.' },
  ];
}
