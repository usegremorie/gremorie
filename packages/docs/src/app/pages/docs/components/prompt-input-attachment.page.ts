import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocsApiTable, ApiRow } from '../../../shared/api-table.component';
import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../../shared/doc-page.component';

@Component({
  selector: 'docs-prompt-input-attachment',
  imports: [DocsLayout, DocsPage, DocsSection, DocsProse, DocsCodeBlock, DocsApiTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Component · Attachments"
        title="PromptInputAttachment"
        lede="Individual attachment card. Auto-detects type (image, video, audio, pdf, text, generic) from MIME. Images render a blob URL preview with effect-based cleanup; other types render an inline SVG icon."
      >
        <docs-section title="Basic usage" anchor="usage">
          <docs-code-block lang="html" [code]="usage" />
        </docs-section>

        <docs-section title="API — Inputs" anchor="api-inputs">
          <docs-api-table [rows]="inputs" />
        </docs-section>

        <docs-section title="API — Outputs" anchor="api-outputs">
          <docs-api-table [rows]="outputs" [showDefault]="false" />
        </docs-section>

        <docs-section title="Type detection" anchor="types">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><code>image/*</code> → image preview (blob URL)</li>
              <li><code>video/*</code> → video icon</li>
              <li><code>audio/*</code> → audio icon</li>
              <li><code>application/pdf</code> → PDF icon</li>
              <li><code>text/*</code> → text icon</li>
              <li>everything else → generic file icon</li>
            </ul>
          </docs-prose>
        </docs-section>

        <docs-section title="Accessibility" anchor="a11y">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><code>role="listitem"</code> on the host</li>
              <li><code>data-type</code>, <code>data-loading</code>, <code>data-error</code> for CSS targeting</li>
              <li>Remove button has <code>aria-label</code> "Remove [filename]"</li>
              <li>Errored state shows visible "Error" badge in addition to the destructive border</li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class PromptInputAttachmentPage {
  protected readonly usage = `<prompt-input-attachment
  [file]="file"
  [loading]="false"
  [errored]="false"
  [removable]="true"
  (removed)="onRemoved($event)"
/>`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'file', type: 'File', default: '(required)', description: 'Native File object.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Show animated skeleton overlay.' },
    { name: 'errored', type: 'boolean', default: 'false', description: 'Show destructive border + Error badge.' },
    { name: 'removable', type: 'boolean', default: 'true', description: 'Show close button.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'removed', type: 'File', description: 'Fires when the close button is clicked. Also calls parent.removeAttachment(file) via DI.' },
  ];
}
