import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../../shared/doc-page.component';

@Component({
  selector: 'docs-prompt-input-attachments',
  imports: [DocsLayout, DocsPage, DocsSection, DocsProse, DocsCodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Component · Attachments"
        title="PromptInputAttachments"
        lede="Container for attachment previews. role='list', flex wrap. Composition-driven — you map over parent's attachments() signal and render one PromptInputAttachment per file."
      >
        <docs-section title="Basic usage" anchor="usage">
          <docs-code-block lang="html" [code]="usage" />
        </docs-section>

        <docs-section title="Accessibility" anchor="a11y">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><code>role="list"</code> with <code>aria-label="Attached files"</code></li>
              <li>Children automatically get <code>role="listitem"</code> from PromptInputAttachment</li>
              <li>Layout: <code>flex flex-wrap gap-2</code> — cards wrap on narrow screens</li>
            </ul>
          </docs-prose>
        </docs-section>

        <docs-section title="How drag-and-drop and paste work" anchor="dnd">
          <docs-prose>
            <p>
              Drag-and-drop and paste are handled by the <strong>PromptInput container</strong>, not by
              this component. Drop a file anywhere inside <code>&lt;prompt-input&gt;</code> — validation
              runs, the file lands in <code>attachments()</code>, and you render the list with this
              component.
            </p>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class PromptInputAttachmentsPage {
  protected readonly usage = `<prompt-input
  [(attachments)]="files"
  [acceptAttachments]="['image/*', 'application/pdf']"
  [maxAttachments]="5"
>
  @if (files().length > 0) {
    <prompt-input-attachments>
      @for (file of files(); track file.name + file.size) {
        <prompt-input-attachment [file]="file" />
      }
    </prompt-input-attachments>
  }
  <prompt-input-textarea />
</prompt-input>`;
}
