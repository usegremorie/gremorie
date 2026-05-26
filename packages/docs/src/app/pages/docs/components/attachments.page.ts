import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  AttachmentInfo,
  AttachmentItem,
  AttachmentList,
  AttachmentName,
  AttachmentPreview,
  AttachmentRemove,
  AttachmentSize,
  AttachmentEmpty,
  type AttachmentData,
} from '@gremorie/ng-ai';

import { DocsApiTable, ApiRow } from '../../../shared/api-table.component';
import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../../shared/doc-page.component';
import { DocsPreview } from '../../../shared/preview.component';

const PREVIEW_ITEMS: AttachmentData[] = [
  {
    id: 'preview-1',
    filename: 'design-spec.pdf',
    mediaType: 'application/pdf',
    size: 1024 * 240,
  },
  {
    id: 'preview-2',
    filename: 'voice-note.mp3',
    mediaType: 'audio/mpeg',
    size: 1024 * 1024 * 2,
  },
  {
    id: 'preview-3',
    filename: 'screen-recording.mp4',
    mediaType: 'video/mp4',
    size: 1024 * 1024 * 14,
  },
];

@Component({
  selector: 'docs-attachments',
  imports: [
    DocsLayout,
    DocsPage,
    DocsSection,
    DocsProse,
    DocsCodeBlock,
    DocsApiTable,
    DocsPreview,
    AttachmentList,
    AttachmentItem,
    AttachmentPreview,
    AttachmentInfo,
    AttachmentName,
    AttachmentSize,
    AttachmentRemove,
    AttachmentEmpty,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Component · Chatbot"
        title="Attachments"
        lede="Composable system for displaying file attachments — inline badges in a prompt input, grid cards in a message bubble, or full-detail rows in an upload UI. Works standalone or inside PromptInput."
      >
        <docs-section title="Preview — grid" anchor="preview-grid">
          <docs-preview [code]="gridCode" lang="html">
            <attachment-list variant="grid">
              @for (item of previewItems; track item.id) {
                <attachment-item [data]="item" (removed)="onRemoved($event)">
                  <attachment-preview />
                  <attachment-info [showMediaType]="true" />
                  <attachment-remove />
                </attachment-item>
              }
            </attachment-list>
          </docs-preview>
        </docs-section>

        <docs-section title="Preview — inline" anchor="preview-inline">
          <docs-preview [code]="inlineCode" lang="html">
            <attachment-list variant="inline">
              @for (item of previewItems; track item.id) {
                <attachment-item [data]="item" (removed)="onRemoved($event)">
                  <attachment-preview />
                  <attachment-name />
                  <attachment-remove />
                </attachment-item>
              }
            </attachment-list>
          </docs-preview>
        </docs-section>

        <docs-section title="Preview — list" anchor="preview-list">
          <docs-preview [code]="listCode" lang="html">
            <attachment-list variant="list">
              @for (item of previewItems; track item.id) {
                <attachment-item [data]="item" (removed)="onRemoved($event)">
                  <attachment-preview />
                  <div class="flex min-w-0 flex-1 flex-col">
                    <attachment-name />
                    <attachment-size />
                  </div>
                  <attachment-remove />
                </attachment-item>
              }
            </attachment-list>
          </docs-preview>
        </docs-section>

        <docs-section title="Empty state" anchor="preview-empty">
          <docs-preview [code]="emptyCode" lang="html">
            <attachment-list>
              <attachment-empty>
                <p class="text-sm">Drop files here or paste an image.</p>
              </attachment-empty>
            </attachment-list>
          </docs-preview>
        </docs-section>

        <docs-section title="Anatomy" anchor="anatomy">
          <docs-code-block lang="text" [code]="anatomy" />
        </docs-section>

        <docs-section title="Installation" anchor="install">
          <docs-code-block lang="bash" code="npm install @gremorie/ng-ai @gremorie/ng-core" />
          <docs-prose>
            <p>Or via the CLI:</p>
          </docs-prose>
          <docs-code-block lang="bash" code="npx gremorie add attachments" />
        </docs-section>

        <docs-section title="Basic usage" anchor="usage">
          <docs-code-block lang="typescript" [code]="usage" />
        </docs-section>

        <docs-section title="Variants" anchor="variants">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><strong>grid</strong> (default) — wraps cards with a thumbnail header. Best for message bubbles and rich previews.</li>
              <li><strong>inline</strong> — compact badge row. Best for the row above a prompt input's textarea.</li>
              <li><strong>list</strong> — vertical stack with full metadata. Best for upload UIs.</li>
            </ul>
          </docs-prose>
        </docs-section>

        <docs-section title="Composition with PromptInput" anchor="prompt-input">
          <docs-prose>
            <p>
              When nested inside a <a routerLink="/docs/components/prompt-input">PromptInput</a>, the attachment
              state is owned by the container. Bind the <code>attachments</code> model both ways and
              wire the list:
            </p>
          </docs-prose>
          <docs-code-block lang="typescript" [code]="promptInputUsage" />
        </docs-section>

        <docs-section title="API — AttachmentData" anchor="api-data">
          <docs-prose>
            <p>The shape every item accepts. Compatible with <code>FileUIPart</code> from the Vercel AI SDK.</p>
          </docs-prose>
          <docs-api-table [rows]="dataShape" [showDefault]="false" />
        </docs-section>

        <docs-section title="API — AttachmentList" anchor="api-list">
          <docs-api-table [rows]="listInputs" />
        </docs-section>

        <docs-section title="API — AttachmentItem" anchor="api-item">
          <docs-api-table [rows]="itemInputs" />
        </docs-section>

        <docs-section title="API — AttachmentItem outputs" anchor="api-item-outputs">
          <docs-api-table [rows]="itemOutputs" [showDefault]="false" />
        </docs-section>

        <docs-section title="API — AttachmentPreview" anchor="api-preview">
          <docs-api-table [rows]="previewInputs" />
        </docs-section>

        <docs-section title="API — AttachmentInfo" anchor="api-info">
          <docs-api-table [rows]="infoInputs" />
        </docs-section>

        <docs-section title="API — AttachmentRemove" anchor="api-remove">
          <docs-api-table [rows]="removeInputs" />
        </docs-section>

        <docs-section title="Utility functions" anchor="utils">
          <docs-prose>
            <p>Re-exported from <code>&#64;Gremorie NG/attachments</code>:</p>
          </docs-prose>
          <docs-api-table [rows]="utils" [showDefault]="false" />
        </docs-section>

        <docs-section title="Accessibility" anchor="a11y">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><strong>role="list"</strong> on the AttachmentList container, configurable <code>ariaLabel</code></li>
              <li><strong>role="listitem"</strong> on each AttachmentItem, with <code>data-media-category</code> for CSS targeting</li>
              <li>Remove button has an explicit <code>aria-label</code> (default "Remove attachment")</li>
              <li>Preview images get an <code>alt</code> derived from the filename — pass a more descriptive value via your own <code>fallback</code> template when needed</li>
              <li>Errored state surfaces a visible "Error" badge in addition to the destructive border</li>
            </ul>
          </docs-prose>
        </docs-section>

        <docs-section title="Theming" anchor="theming">
          <docs-prose>
            <p>Semantic tokens consumed:</p>
            <ul class="ml-5 list-disc space-y-1">
              <li><code>--card</code> / <code>--card-foreground</code> — item background</li>
              <li><code>--border</code> — item border</li>
              <li><code>--muted</code> / <code>--muted-foreground</code> — preview background, secondary text</li>
              <li><code>--accent</code> / <code>--accent-foreground</code> — remove button hover</li>
              <li><code>--destructive</code> / <code>--destructive-foreground</code> — errored item border + error badge</li>
              <li><code>--ring</code> — focus rings</li>
            </ul>
            <p>The component does <strong>not</strong> ship its own tokens — see <a routerLink="/docs/primitives/theme">Theme tokens</a> for the full list.</p>
          </docs-prose>
        </docs-section>

        <docs-section title="Known issues" anchor="known-issues">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><strong>Hover cards deferred to v0.2.</strong> AI Elements ships an AttachmentHoverCard for showing a larger preview on hover in inline variant. Gremorie NG will adopt it once the popover primitive lands (target: v0.2 alongside Conversation).</li>
              <li><strong>id generation.</strong> <code>toAttachmentData()</code> uses an internal counter for ids. If you persist attachments across reloads, generate stable ids yourself.</li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class AttachmentsPage {
  protected readonly previewItems = PREVIEW_ITEMS;

  protected readonly removedAt = signal<string | null>(null);
  protected onRemoved(item: AttachmentData): void {
    // Preview pages don't actually remove from the list — just log.
    this.removedAt.set(item.id);
  }

  protected readonly gridCode = `<attachment-list variant="grid">
  @for (item of attachments(); track item.id) {
    <attachment-item [data]="item" (removed)="onRemove($event)">
      <attachment-preview />
      <attachment-info [showMediaType]="true" />
      <attachment-remove />
    </attachment-item>
  }
</attachment-list>`;

  protected readonly inlineCode = `<attachment-list variant="inline">
  @for (item of attachments(); track item.id) {
    <attachment-item [data]="item" (removed)="onRemove($event)">
      <attachment-preview />
      <attachment-name />
      <attachment-remove />
    </attachment-item>
  }
</attachment-list>`;

  protected readonly listCode = `<attachment-list variant="list">
  @for (item of attachments(); track item.id) {
    <attachment-item [data]="item" (removed)="onRemove($event)">
      <attachment-preview />
      <div class="flex min-w-0 flex-1 flex-col">
        <attachment-name />
        <attachment-size />
      </div>
      <attachment-remove />
    </attachment-item>
  }
</attachment-list>`;

  protected readonly emptyCode = `<attachment-list>
  <attachment-empty>
    <p class="text-sm">Drop files here or paste an image.</p>
  </attachment-empty>
</attachment-list>`;

  protected readonly anatomy = `<attachment-list variant="grid | inline | list">
├── <attachment-item [data]="..." (removed)="...">
│   ├── <attachment-preview [fallback]="..." />        Image / video / icon
│   ├── <attachment-info  [showMediaType]="..." />     Name + secondary line
│   │   — or finer-grained:
│   ├── <attachment-name />                            Filename only
│   ├── <attachment-size />                            Formatted bytes
│   └── <attachment-remove [label]="..." />            Close button
└── <attachment-empty>                                 Empty-state slot
      Custom message via <ng-content>
    </attachment-empty>`;

  protected readonly usage = `import { Component, signal } from '@angular/core';
import {
  AttachmentInfo,
  AttachmentItem,
  AttachmentList,
  AttachmentPreview,
  AttachmentRemove,
  toAttachmentData,
  type AttachmentData,
} from '@gremorie/ng-ai';

@Component({
  selector: 'app-uploader',
  imports: [
    AttachmentList,
    AttachmentItem,
    AttachmentPreview,
    AttachmentInfo,
    AttachmentRemove,
  ],
  template: \`
    <attachment-list variant="grid">
      @for (item of items(); track item.id) {
        <attachment-item [data]="item" (removed)="onRemove($event)">
          <attachment-preview />
          <attachment-info [showMediaType]="true" />
          <attachment-remove label="Remove this file" />
        </attachment-item>
      }
    </attachment-list>
  \`,
})
export class Uploader {
  items = signal<AttachmentData[]>([]);

  onFileSelected(file: File) {
    this.items.update((prev) => [...prev, toAttachmentData(file)]);
  }

  onRemove(item: AttachmentData) {
    this.items.update((prev) => prev.filter((it) => it.id !== item.id));
  }
}`;

  protected readonly promptInputUsage = `<prompt-input
  [(value)]="text"
  [(attachments)]="attachments"
  [acceptAttachments]="['image/*', 'application/pdf']"
  (submitted)="send($event)"
>
  @if (attachments().length > 0) {
    <attachment-list variant="inline">
      @for (item of attachments(); track item.id) {
        <attachment-item [data]="item" (removed)="removeAttachment($event)">
          <attachment-preview />
          <attachment-name />
          <attachment-remove />
        </attachment-item>
      }
    </attachment-list>
  }
  <prompt-input-textarea />
  <prompt-input-toolbar>
    <prompt-input-submit />
  </prompt-input-toolbar>
</prompt-input>`;

  protected readonly dataShape: readonly ApiRow[] = [
    { name: 'id', type: 'string', description: 'Stable identifier — used for tracking in @for loops.' },
    { name: 'filename', type: 'string?', description: 'Display name. Falls back to a category label ("Image", "Document") when omitted.' },
    { name: 'mediaType', type: 'string?', description: 'MIME type. Drives the preview surface and label fallback.' },
    { name: 'url', type: 'string?', description: 'Already-uploaded URL — used as <img>/<video> source.' },
    { name: 'file', type: 'File?', description: 'Native File — used to derive a blob URL for image previews.' },
    { name: 'size', type: 'number?', description: 'Bytes. When omitted but `file` is set, derived from file.size.' },
  ];

  protected readonly listInputs: readonly ApiRow[] = [
    { name: 'variant', type: "'grid' | 'inline' | 'list'", default: "'grid'", description: 'Layout shape. Items read this from the list via DI.' },
    { name: 'ariaLabel', type: 'string', default: "'Attachments'", description: 'aria-label applied to the role="list" host.' },
  ];

  protected readonly itemInputs: readonly ApiRow[] = [
    { name: 'data', type: 'AttachmentData', default: '(required)', description: 'The attachment to render.' },
    { name: 'loading', type: 'boolean', default: 'false', description: 'Show animated skeleton overlay on the preview.' },
    { name: 'errored', type: 'boolean', default: 'false', description: 'Destructive border + "Error" badge.' },
    { name: 'variant', type: "'grid' | 'inline' | 'list' | undefined", default: 'undefined', description: 'Override the parent list variant for a single item.' },
  ];

  protected readonly itemOutputs: readonly ApiRow[] = [
    { name: 'removed', type: 'AttachmentData', description: 'Emitted when AttachmentRemove inside the item is clicked. Carries the data object.' },
  ];

  protected readonly previewInputs: readonly ApiRow[] = [
    { name: 'fallback', type: 'TemplateRef<unknown> | null', default: 'null', description: 'Custom non-image surface (your own icon system, custom layout, etc).' },
  ];

  protected readonly infoInputs: readonly ApiRow[] = [
    { name: 'showMediaType', type: 'boolean', default: 'false', description: 'Add the MIME type to the secondary line.' },
    { name: 'showSize', type: 'boolean', default: 'true', description: 'Add the formatted file size to the secondary line.' },
  ];

  protected readonly removeInputs: readonly ApiRow[] = [
    { name: 'label', type: 'string', default: "'Remove attachment'", description: 'Screen-reader label and tooltip.' },
  ];

  protected readonly utils: readonly ApiRow[] = [
    { name: 'toAttachmentData(file, overrides?)', type: '(File, Partial<AttachmentData>?) => AttachmentData', description: 'Convert a native File into the shape components consume. Generates an id if you do not provide one.' },
    { name: 'getMediaCategory(data)', type: '(data) => "image" | "video" | "audio" | "document" | "source" | "unknown"', description: 'Coarse classification driving the preview surface.' },
    { name: 'getAttachmentLabel(data)', type: '(data) => string', description: 'Best human-readable label — filename, then category fallback, then "Attachment".' },
    { name: 'formatFileSize(bytes)', type: '(number | undefined) => string', description: 'Format bytes as a short string like "240 KB" or "12.4 MB".' },
  ];
}
