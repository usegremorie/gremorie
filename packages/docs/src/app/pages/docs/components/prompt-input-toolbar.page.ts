import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../../shared/doc-page.component';

@Component({
  selector: 'docs-prompt-input-toolbar',
  imports: [DocsLayout, DocsPage, DocsSection, DocsProse, DocsCodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Component · Layout"
        title="PromptInputToolbar"
        lede="Flex container for the bottom row of a PromptInput. Hosts tools on the left (PromptInputTools) and submit on the right. role='toolbar', wraps gracefully on narrow screens."
      >
        <docs-section title="Basic usage" anchor="usage">
          <docs-code-block lang="html" [code]="usage" />
        </docs-section>

        <docs-section title="Accessibility" anchor="a11y">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><code>role="toolbar"</code> on the host</li>
              <li>Layout: <code>flex flex-wrap items-center gap-2</code></li>
              <li>No props — pure presentational wrapper</li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class PromptInputToolbarPage {
  protected readonly usage = `<prompt-input>
  <prompt-input-textarea />
  <prompt-input-toolbar>
    <prompt-input-tools>
      <!-- Buttons, ActionMenu, ModelSelect -->
    </prompt-input-tools>
    <prompt-input-submit />
  </prompt-input-toolbar>
</prompt-input>`;
}
