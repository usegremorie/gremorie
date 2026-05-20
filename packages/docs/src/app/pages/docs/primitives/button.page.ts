import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PromptInputButton } from '@kalvner/shadng-prompt-input';

import { DocsApiTable, ApiRow } from '../../../shared/api-table.component';
import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../../shared/doc-page.component';

@Component({
  selector: 'docs-primitive-button',
  imports: [
    DocsLayout,
    DocsPage,
    DocsSection,
    DocsProse,
    DocsCodeBlock,
    DocsApiTable,
    PromptInputButton,
    RouterLink,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Primitive"
        title="Button"
        lede="The generic icon button used throughout the PromptInput family. Two variants (ghost, subtle), two sizes (sm, md), and full toggle semantics. Use it standalone for any AI-adjacent action."
      >
        <docs-section title="Preview" anchor="preview">
          <div class="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-5">
            <prompt-input-button ariaLabel="Demo ghost md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </prompt-input-button>

            <prompt-input-button variant="subtle" ariaLabel="Demo subtle md">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </prompt-input-button>

            <prompt-input-button size="sm" ariaLabel="Demo ghost sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </prompt-input-button>

            <prompt-input-button [pressed]="true" ariaLabel="Demo pressed">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </prompt-input-button>

            <prompt-input-button [disabled]="true" ariaLabel="Demo disabled">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
              </svg>
            </prompt-input-button>
          </div>
        </docs-section>

        <docs-section title="When to use" anchor="when">
          <docs-prose>
            <p>
              Reach for <code>Button</code> when you need a compact, icon-driven control. It is the
              same primitive that drives toolbar actions inside <a routerLink="/docs/components/prompt-input">PromptInput</a>,
              so reusing it keeps your interface visually consistent.
            </p>
            <p>
              For text-driven actions or primary CTAs, prefer your application's regular button (or
              one from <a href="https://www.spartan.ng" target="_blank" rel="noopener">spartan-ng</a>).
              For the prompt submit specifically — with the 4-state visual treatment — use
              <a routerLink="/docs/components/prompt-input-submit">PromptInputSubmit</a>.
            </p>
          </docs-prose>
        </docs-section>

        <docs-section title="Installation" anchor="install">
          <docs-code-block lang="bash" code="npm install @kalvner/shadng-prompt-input" />
        </docs-section>

        <docs-section title="Usage" anchor="usage">
          <docs-code-block lang="typescript" [code]="usage" />
        </docs-section>

        <docs-section title="API — Inputs" anchor="api-inputs">
          <docs-api-table [rows]="inputs" />
        </docs-section>

        <docs-section title="API — Outputs" anchor="api-outputs">
          <docs-api-table [rows]="outputs" [showDefault]="false" />
        </docs-section>

        <docs-section title="Variants" anchor="variants">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><strong>ghost</strong> — transparent background, hover reveals <code>accent</code>. Use in toolbars or alongside other content.</li>
              <li><strong>subtle</strong> — muted background, slightly more visible at rest. Use when the action needs more emphasis.</li>
            </ul>
          </docs-prose>
        </docs-section>

        <docs-section title="Sizes" anchor="sizes">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><strong>md</strong> (default) — 36px square. Matches <a routerLink="/docs/components/prompt-input-submit">PromptInputSubmit</a> and WCAG 2.2 SC 2.5.8 (minimum 24×24).</li>
              <li><strong>sm</strong> — 28px square. Use only when space is tight; avoid on touch-primary devices.</li>
            </ul>
          </docs-prose>
        </docs-section>

        <docs-section title="Accessibility" anchor="a11y">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><code>ariaLabel</code> is required — there is no visible text in icon-only buttons.</li>
              <li><code>aria-pressed</code> is emitted only when <code>pressed</code> is true/false (skipped when null).</li>
              <li>Inherits <code>disabled</code> from a parent <code>&lt;prompt-input&gt;</code> via DI when nested inside one.</li>
              <li>Focus ring uses the <code>--ring</code> semantic token.</li>
            </ul>
          </docs-prose>
        </docs-section>

        <docs-section title="Theming" anchor="theming">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><code>--accent</code> / <code>--accent-foreground</code> — hover state and pressed state</li>
              <li><code>--muted</code> — subtle variant background</li>
              <li><code>--ring</code> — focus ring color</li>
              <li><code>--radius-md</code> — corner radius</li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class ButtonPrimitivePage {
  protected readonly usage = `import { Component } from '@angular/core';
import { PromptInputButton } from '@kalvner/shadng-prompt-input';

@Component({
  selector: 'app-search-bar',
  imports: [PromptInputButton],
  template: \`
    <prompt-input-button
      ariaLabel="Search"
      title="Search"
      variant="ghost"
      size="md"
      (pressedChange)="onSearch()"
    >
      <svg><!-- search icon --></svg>
    </prompt-input-button>
  \`,
})
export class SearchBar {
  onSearch() { /* ... */ }
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'ariaLabel', type: 'string', default: '(required)', description: 'Accessible name. Required for icon-only buttons.' },
    { name: 'title', type: 'string', default: "''", description: 'Native tooltip. Falls back to ariaLabel.' },
    { name: 'variant', type: "'ghost' | 'subtle'", default: "'ghost'", description: 'Visual treatment.' },
    { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Touch target size.' },
    { name: 'pressed', type: 'boolean | null', default: 'null', description: 'Toggle state. null means not a toggle.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable independently of parent context.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'pressedChange', type: 'MouseEvent', description: 'Fires on click. Carries the native MouseEvent in case you need modifier keys.' },
  ];
}
