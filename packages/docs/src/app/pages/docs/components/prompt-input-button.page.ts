import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocsApiTable, ApiRow } from '../../../shared/api-table.component';
import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../../shared/doc-page.component';

@Component({
  selector: 'docs-prompt-input-button',
  imports: [DocsLayout, DocsPage, DocsSection, DocsProse, DocsCodeBlock, DocsApiTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Component · Action"
        title="PromptInputButton"
        lede="Styled button for toolbar actions (attach, voice, custom). ghost or subtle variants, sm or md size. Inherits disabled from parent PromptInput via DI."
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

        <docs-section title="Accessibility" anchor="a11y">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><code>aria-label</code> is required (no visible text in icon-only buttons)</li>
              <li><code>aria-pressed</code> supports toggle semantics when pressed input is true/false</li>
              <li>Disabled state inherits from parent PromptInput</li>
              <li>Focus ring uses <code>--ring</code> token</li>
              <li>Touch targets: md = 36px, sm = 28px — AA compliant for WCAG 2.2 SC 2.5.8</li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class PromptInputButtonPage {
  protected readonly usage = `<prompt-input-button
  ariaLabel="Attach file"
  title="Attach file"
  variant="ghost"
  size="md"
  (pressedChange)="onAttach()"
>
  <svg><!-- icon --></svg>
</prompt-input-button>`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'ariaLabel', type: 'string', default: '(required)', description: 'Accessible name for screen readers.' },
    { name: 'title', type: 'string', default: "''", description: 'Tooltip text (falls back to ariaLabel).' },
    { name: 'variant', type: "'ghost' | 'subtle'", default: "'ghost'", description: 'Visual treatment.' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Touch target size.' },
    { name: 'pressed', type: 'boolean | null', default: 'null', description: 'Sets aria-pressed (null = not a toggle).' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable independently of parent.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'pressedChange', type: 'MouseEvent', description: 'Fires on click.' },
  ];
}
