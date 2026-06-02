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
  selector: 'docs-prompt-input-model-select',
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
        eyebrow="Component · Selector"
        title="PromptInputModelSelect"
        lede="Selector for the active AI model. Options are typed (PromptInputModelOption[]) with id, label, description, badge, and disabled. Two-way bindable value."
      >
        <docs-section title="Basic usage" anchor="usage">
          <docs-code-block lang="typescript" [code]="usage" />
        </docs-section>

        <docs-section title="API — Inputs" anchor="api">
          <docs-api-table [rows]="inputs" />
        </docs-section>

        <docs-section title="PromptInputModelOption" anchor="option">
          <docs-api-table [rows]="optionShape" [showDefault]="false" />
        </docs-section>

        <docs-section title="Accessibility" anchor="a11y">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li>
                Trigger has <code>aria-haspopup="listbox"</code> and
                <code>aria-expanded</code>
              </li>
              <li>
                Open panel has <code>role="listbox"</code>; each option has
                <code>role="option"</code> and <code>aria-selected</code>
              </li>
              <li>Disabled options are skipped on click</li>
              <li>
                <strong>v0.1 note</strong>: typeahead and full combobox keyboard
                pattern pending. Migration to
                <code>&#64;spartan-ng/brain/select</code> planned for v0.2.
              </li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class PromptInputModelSelectPage {
  protected readonly usage = `const MODELS = [
  { id: 'claude-opus-4-7',   label: 'Claude Opus 4.7',  description: 'Highest quality', badge: 'flagship' },
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6', description: 'Balanced' },
  { id: 'claude-haiku-4-5',  label: 'Claude Haiku 4.5',  description: 'Fastest, cheapest' },
] satisfies PromptInputModelOption[];

@Component({
  template: \`
    <prompt-input-model-select
      [options]="models"
      [(value)]="selectedModel"
      placeholder="Choose model"
    />
  \`,
})
export class Chat {
  models = MODELS;
  selectedModel = signal<string | null>('claude-sonnet-4-6');
}`;

  protected readonly inputs: readonly ApiRow[] = [
    {
      name: 'options',
      type: 'readonly PromptInputModelOption[]',
      default: '(required)',
      description: 'Available options.',
    },
    {
      name: 'value',
      type: 'string | null',
      default: 'null',
      description: 'Selected option id. Two-way bindable.',
    },
    {
      name: 'placeholder',
      type: 'string',
      default: "'Choose model'",
      description: 'Shown when value is null.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      default: 'false',
      description: 'Disable independently of parent.',
    },
    {
      name: 'ariaLabel',
      type: 'string',
      default: "'Select model'",
      description: 'Accessible label.',
    },
  ];

  protected readonly optionShape: readonly ApiRow[] = [
    {
      name: 'id',
      type: 'string',
      description: 'Unique identifier matched against value.',
    },
    { name: 'label', type: 'string', description: 'Visible label.' },
    {
      name: 'description',
      type: 'string?',
      description: 'Secondary text under the label.',
    },
    {
      name: 'badge',
      type: 'string?',
      description: 'Small uppercase tag (e.g. "flagship").',
    },
    {
      name: 'disabled',
      type: 'boolean?',
      description: 'When true, option is shown but not selectable.',
    },
  ];
}
