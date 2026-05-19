import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../../shared/doc-page.component';

@Component({
  selector: 'docs-prompt-input-tools',
  imports: [DocsLayout, DocsPage, DocsSection, DocsProse, DocsCodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Component · Layout"
        title="PromptInputTools"
        lede="Left-side flex group inside the toolbar. flex-1 pushes the submit to the right. role='group' with aria-label='Prompt actions'."
      >
        <docs-section title="Basic usage" anchor="usage">
          <docs-code-block lang="html" [code]="usage" />
        </docs-section>

        <docs-section title="Accessibility" anchor="a11y">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><code>role="group"</code> with <code>aria-label="Prompt actions"</code></li>
              <li>Layout: <code>flex flex-1 flex-wrap items-center gap-1</code></li>
              <li>No props — pure presentational wrapper</li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class PromptInputToolsPage {
  protected readonly usage = `<prompt-input-toolbar>
  <prompt-input-tools>
    <prompt-input-button ariaLabel="Attach">…</prompt-input-button>
    <prompt-input-button ariaLabel="Voice">…</prompt-input-button>
    <prompt-input-model-select [options]="models" [(value)]="model" />
  </prompt-input-tools>
  <prompt-input-submit />
</prompt-input-toolbar>`;
}
