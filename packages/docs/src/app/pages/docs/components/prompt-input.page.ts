import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@kalvner/shadng-prompt-input';

import { DocsApiTable, ApiRow } from '../../../shared/api-table.component';
import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../../shared/doc-page.component';

@Component({
  selector: 'docs-prompt-input',
  imports: [
    DocsLayout,
    DocsPage,
    DocsSection,
    DocsProse,
    DocsCodeBlock,
    DocsApiTable,
    PromptInput,
    PromptInputTextarea,
    PromptInputToolbar,
    PromptInputSubmit,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Component · Container"
        title="PromptInput"
        lede="Container for AI prompt entry. Owns the state machine (ready → submitted → streaming → error), keyboard shortcuts, attachment validation, and coordinates all subcomponents."
      >
        <docs-section title="Preview" anchor="preview">
          <div class="rounded-lg border border-border bg-card p-5">
            <prompt-input [(value)]="previewValue" class="max-w-xl">
              <prompt-input-textarea placeholder="Type a prompt — Mod+K focuses globally" />
              <prompt-input-toolbar>
                <prompt-input-submit />
              </prompt-input-toolbar>
            </prompt-input>
          </div>
        </docs-section>

        <docs-section title="Anatomy" anchor="anatomy">
          <docs-code-block lang="text" [code]="anatomy" />
          <docs-prose>
            <p>Each subcomponent has its own reference page:</p>
            <ul class="ml-5 list-disc space-y-1">
              <li><a routerLink="/docs/components/prompt-input-textarea">PromptInputTextarea</a> — auto-expanding text input</li>
              <li><a routerLink="/docs/components/prompt-input-submit">PromptInputSubmit</a> — 4-state submit button</li>
              <li><a routerLink="/docs/components/prompt-input-toolbar">PromptInputToolbar</a> — flex wrapper for the bottom row</li>
              <li><a routerLink="/docs/components/prompt-input-tools">PromptInputTools</a> — left-side group of actions</li>
              <li><a routerLink="/docs/components/prompt-input-button">PromptInputButton</a> — toolbar action button</li>
              <li><a routerLink="/docs/components/prompt-input-attachments">PromptInputAttachments</a> — attachment list container</li>
              <li><a routerLink="/docs/components/prompt-input-attachment">PromptInputAttachment</a> — individual attachment card</li>
              <li><a routerLink="/docs/components/prompt-input-action-menu">PromptInputActionMenu</a> — dropdown for less-frequent actions</li>
              <li><a routerLink="/docs/components/prompt-input-model-select">PromptInputModelSelect</a> — model picker</li>
            </ul>
          </docs-prose>
        </docs-section>

        <docs-section title="Installation" anchor="install">
          <docs-code-block lang="bash" code="npm install @kalvner/shadng-prompt-input" />
        </docs-section>

        <docs-section title="Basic usage" anchor="usage">
          <docs-code-block lang="typescript" [code]="usageExample" />
        </docs-section>

        <docs-section title="API — Inputs" anchor="api-inputs">
          <docs-api-table [rows]="inputs" />
        </docs-section>

        <docs-section title="API — Outputs" anchor="api-outputs">
          <docs-api-table [rows]="outputs" [showDefault]="false" />
        </docs-section>

        <docs-section title="API — Imperative methods" anchor="api-imperative">
          <docs-prose>
            <p>Access via <code>&#64;ViewChild(PromptInput)</code>:</p>
          </docs-prose>
          <docs-api-table [rows]="methods" [showDefault]="false" />
        </docs-section>

        <docs-section title="States" anchor="states">
          <docs-prose>
            <p>
              The container holds a state machine driven by the <code>state</code> input.
              Visual treatment and submit behavior change per state. All children of
              <code>&lt;prompt-input&gt;</code> read state via dependency injection.
            </p>
          </docs-prose>
          <docs-api-table [rows]="states" [showDefault]="false" />
        </docs-section>

        <docs-section title="Variants" anchor="variants">
          <docs-prose>
            <p>
              <strong>size</strong>: <code>sm</code> | <code>md</code> (default) | <code>lg</code> — affects padding, gap, font size.
            </p>
            <p>
              <strong>variant</strong>: <code>default</code> (border + bg) | <code>ghost</code> (transparent) | <code>bordered</code> (heavier border).
            </p>
          </docs-prose>
        </docs-section>

        <docs-section title="Keyboard shortcuts" anchor="keyboard">
          <docs-api-table [rows]="keyboard" [showDefault]="false" />
        </docs-section>

        <docs-section title="Accessibility" anchor="a11y">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><strong>role</strong>: <code>form</code> with configurable <code>aria-label</code></li>
              <li><strong>aria-live</strong> polite region announces state changes ("Message submitted", "AI is responding", "Submission failed")</li>
              <li><strong>aria-disabled</strong> reflects the <code>disabled</code> input</li>
              <li><strong>data-state</strong> attribute exposes current state for CSS targeting</li>
              <li><strong>focus-within</strong> ring on the container for keyboard navigation</li>
              <li><strong>Reduced motion</strong>: respects <code>prefers-reduced-motion</code> — dropdowns skip the scale animation</li>
            </ul>
          </docs-prose>
        </docs-section>

        <docs-section title="Theming" anchor="theming">
          <docs-prose>
            <p>Semantic CSS variables consumed by the container:</p>
          </docs-prose>
          <docs-api-table [rows]="cssVars" [showDefault]="false" />
        </docs-section>

        <docs-section title="Design decisions" anchor="adrs">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li>
                <strong>Monolithic components</strong> (no Brain/Helm split) — follow shadcn original;
                spartan-ng/brain supplies headless primitives when needed (<a routerLink="/docs/getting-started">ADR-011</a>).
              </li>
              <li>
                <strong>No library-namespace prefix</strong> on selectors — preserves white-label
                (<a routerLink="/docs/getting-started">ADR-012</a>).
              </li>
              <li>
                <strong>Three-tier tokens</strong> (primitives → semantics → AI-specific) — rebrand
                in one edit (<a routerLink="/docs/getting-started">ADR-013</a>).
              </li>
              <li>
                <strong>State machine over reactive state</strong> — explicit transitions, easier to
                reason about under streaming.
              </li>
            </ul>
          </docs-prose>
        </docs-section>

        <docs-section title="Known issues" anchor="known-issues">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li>
                The global <code>Mod+K</code> shortcut focuses the first <code>&lt;textarea&gt;</code>
                inside the container. If multiple PromptInputs are mounted, the first one in DOM wins.
              </li>
              <li>
                Drag-and-drop and paste validation only run when <code>acceptAttachments</code> is set
                to an array. Default <code>false</code> disables attachments entirely.
              </li>
              <li>
                Dropdown components (action-menu, model-select) use a v0.1 native popover. Migration
                to <code>&#64;spartan-ng/brain</code> menu/select is planned for v0.2 once their API
                stabilizes.
              </li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class PromptInputPage {
  protected readonly previewValue = signal('');

  protected readonly anatomy = `<prompt-input>
├── <prompt-input-attachments>           (optional, see Attachments docs)
│   └── <prompt-input-attachment>
├── <prompt-input-textarea>              (required)
└── <prompt-input-toolbar>               (optional but recommended)
    ├── <prompt-input-tools>
    │   ├── <prompt-input-action-menu>
    │   ├── <prompt-input-button>
    │   └── <prompt-input-model-select>
    └── <prompt-input-submit>            (one per toolbar)`;

  protected readonly usageExample = `import { Component, signal } from '@angular/core';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputSubmitEvent,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@kalvner/shadng-prompt-input';

@Component({
  selector: 'app-chat',
  imports: [PromptInput, PromptInputTextarea, PromptInputToolbar, PromptInputSubmit],
  template: \`
    <prompt-input
      [(value)]="message"
      [state]="status()"
      (submitted)="onSubmit($event)"
    >
      <prompt-input-textarea placeholder="Ask anything…" />
      <prompt-input-toolbar>
        <prompt-input-submit />
      </prompt-input-toolbar>
    </prompt-input>
  \`,
})
export class ChatComponent {
  message = signal('');
  status = signal<'ready' | 'submitted' | 'streaming' | 'error'>('ready');

  async onSubmit({ value }: PromptInputSubmitEvent) {
    this.status.set('submitted');
    // ... call your LLM, set 'streaming' on first chunk, 'ready' on done, 'error' on failure
  }
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'value', type: 'Signal<string>', default: "signal('')", description: "Textarea value. Two-way bindable with [(value)]." },
    { name: 'attachments', type: 'Signal<readonly File[]>', default: 'signal([])', description: 'List of attached files. Two-way bindable.' },
    { name: 'state', type: "'ready' | 'submitted' | 'streaming' | 'error'", default: "'ready'", description: 'State machine. Drives submit visual + Esc behavior + aria-live announcements.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Visual size — padding, gap, font.' },
    { name: 'variant', type: "'default' | 'ghost' | 'bordered'", default: "'default'", description: 'Border treatment.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the whole container (children inherit via DI).' },
    { name: 'submitOnEnter', type: 'boolean', default: 'true', description: 'When false, only Mod+Enter submits. Useful for multi-line drafting.' },
    { name: 'ariaLabel', type: 'string', default: "'AI prompt input'", description: 'aria-label for the form container.' },
    { name: 'acceptAttachments', type: 'readonly string[] | false', default: 'false', description: "MIME patterns accepted (e.g. ['image/*', 'application/pdf']). false disables attachments." },
    { name: 'maxAttachments', type: 'number', default: '10', description: 'Maximum simultaneous attachments.' },
    { name: 'maxAttachmentSize', type: 'number', default: '10485760', description: 'Maximum bytes per file (10MB default).' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'submitted', type: 'PromptInputSubmitEvent', description: 'Fires on Enter (when submitOnEnter), Mod+Enter, or submit button click in ready state. Payload: { value, attachments, preventDefault }.' },
    { name: 'canceled', type: 'void', description: 'Fires on submit click during streaming, or Esc during streaming.' },
    { name: 'retried', type: 'void', description: 'Fires on submit click in error state.' },
    { name: 'attachmentError', type: 'PromptInputAttachmentError', description: 'Fires when an attachment is rejected. Payload: { file, reason, message }.' },
  ];

  protected readonly methods: readonly ApiRow[] = [
    { name: 'submit()', type: '() => void', description: 'Programmatically trigger submit (respects current state).' },
    { name: 'clear()', type: '() => void', description: 'Clear textarea value and attachments.' },
    { name: 'focusTextarea()', type: '() => void', description: 'Focus the first <textarea> descendant.' },
    { name: 'addFiles(files)', type: '(files: readonly File[]) => void', description: 'Add files programmatically — runs validation and emits errors.' },
    { name: 'removeAttachment(file)', type: '(file: File) => void', description: 'Remove a specific attachment.' },
  ];

  protected readonly states: readonly ApiRow[] = [
    { name: 'ready', type: 'state', description: 'Default. User can type and submit.' },
    { name: 'submitted', type: 'state', description: 'Message sent, waiting for first chunk. Submit shows spinner. Textarea disabled.' },
    { name: 'streaming', type: 'state', description: 'Receiving response. Submit becomes Stop button (destructive tint). Esc cancels.' },
    { name: 'error', type: 'state', description: 'Last submit failed. Container border destructive. Submit becomes Retry.' },
  ];

  protected readonly keyboard: readonly ApiRow[] = [
    { name: 'Enter', type: 'on container', description: 'Submit (if submitOnEnter=true). Otherwise newline.' },
    { name: 'Shift+Enter', type: 'in textarea', description: 'Insert newline. Never submits.' },
    { name: 'Mod+Enter', type: 'on container', description: 'Force submit regardless of submitOnEnter.' },
    { name: 'Esc', type: 'on container', description: 'Clear textarea (in ready/error) or cancel streaming.' },
    { name: 'Mod+K', type: 'global (document)', description: 'Focus the first textarea on the page.' },
  ];

  protected readonly cssVars: readonly ApiRow[] = [
    { name: '--background', type: 'semantic', description: 'Container background.' },
    { name: '--input', type: 'semantic', description: 'Container border (default variant).' },
    { name: '--ring', type: 'semantic', description: 'Focus-within ring.' },
    { name: '--destructive', type: 'semantic', description: 'Border + ring tint when state="error".' },
    { name: '--radius-md', type: 'semantic', description: 'Container border-radius.' },
  ];
}
