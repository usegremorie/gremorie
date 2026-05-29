import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgScrollbar, ScrollArea } from '@gremorie/ng-containers';

import { ApiRow, DocsApiTable } from '../../../shared/api-table.component';
import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../../shared/doc-page.component';
import { DocsPreview } from '../../../shared/preview.component';

@Component({
  selector: 'docs-scroll-area',
  imports: [
    DocsLayout,
    DocsPage,
    DocsSection,
    DocsProse,
    DocsCodeBlock,
    DocsApiTable,
    DocsPreview,
    NgScrollbar,
    ScrollArea,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Component · Layout"
        title="Scroll Area"
        lede="Cross-browser, overlay scrollbar styled with Gremorie NG design tokens. A thin directive over ngx-scrollbar — the same primitive Spartan uses — so you get smooth, consistent scrollbars without fighting native browser styles."
      >
        <docs-section title="Installation" anchor="install">
          <docs-prose>
            Scroll Area wraps
            <a href="https://ngx-scrollbar.netlify.app" target="_blank" rel="noopener noreferrer">ngx-scrollbar</a>,
            so install both:
          </docs-prose>
          <docs-code-block lang="bash" [code]="install" />
          <docs-prose>Or via the Gremorie NG CLI:</docs-prose>
          <docs-code-block lang="bash" [code]="installCli" />
        </docs-section>

        <docs-section
          title="Usage"
          anchor="usage"
          lede="Add the [gremorie] attribute to an <ng-scrollbar> and give it a constrained height."
        >
          <docs-preview [code]="usage" label="vertical scroll">
            <ng-scrollbar gremorie class="h-56 w-full rounded-md border border-border">
              <div class="flex flex-col gap-2 p-4">
                @for (item of items; track item) {
                  <div class="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground">
                    {{ item }}
                  </div>
                }
              </div>
            </ng-scrollbar>
          </docs-preview>
          <docs-code-block lang="ts" [code]="component" />
        </docs-section>

        <docs-section
          title="Customization"
          anchor="customization"
          lede="Every visual token is an ngx-scrollbar CSS variable. Override per-instance with a style binding."
        >
          <docs-code-block lang="html" [code]="customize" />
          <docs-api-table [rows]="tokens" />
        </docs-section>

        <docs-section title="Notes" anchor="notes">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><code>ScrollArea</code> is an attribute directive — it does not render its own element, it styles <code>&lt;ng-scrollbar&gt;</code>.</li>
              <li>Import <code>ScrollAreaImports</code> to pull in both <code>NgScrollbarModule</code> and the <code>[gremorie]</code> directive at once.</li>
              <li>The host gets <code>display: block</code> and <code>data-slot="scroll-area"</code> for styling/testing hooks.</li>
              <li>ngx-scrollbar handles the heavy lifting (overlay scrollbar, smooth scroll, RTL, virtual scroll integration).</li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class ScrollAreaPage {
  protected readonly items = Array.from({ length: 24 }, (_, i) => 'Item ' + (i + 1));

  protected readonly install = 'npm install ngx-scrollbar @gremorie/ng-containers';

  protected readonly installCli = 'npx gremorie add scroll-area';

  protected readonly usage = [
    '<ng-scrollbar gremorie class="h-56 w-full rounded-md border border-border">',
    '  <div class="flex flex-col gap-2 p-4">',
    '    @for (item of items; track item) {',
    '      <div class="...">{{ item }}</div>',
    '    }',
    '  </div>',
    '</ng-scrollbar>',
  ].join('\n');

  protected readonly component = [
    "import { Component } from '@angular/core';",
    "import { ScrollAreaImports } from '@gremorie/ng-containers';",
    '',
    '@Component({',
    "  selector: 'app-example',",
    '  imports: [ScrollAreaImports],',
    "  templateUrl: './example.html',",
    '})',
    'export class ExampleComponent {}',
  ].join('\n');

  protected readonly customize = [
    '<!-- Thicker bar, accent thumb, for this instance only -->',
    '<ng-scrollbar',
    '  Gremorie NG',
    '  class="h-72"',
    '  [style.--scrollbar-thickness]="10"',
    "  [style.--scrollbar-thumb-color]=\"'var(--primary)'\"",
    '>',
    '  …',
    '</ng-scrollbar>',
  ].join('\n');

  protected readonly tokens: readonly ApiRow[] = [
    {
      name: '--scrollbar-thickness',
      type: 'number',
      default: '7',
      description: 'Thumb/track thickness in pixels.',
    },
    {
      name: '--scrollbar-thumb-color',
      type: 'color',
      default: 'var(--border)',
      description: 'Resting thumb color.',
    },
    {
      name: '--scrollbar-thumb-hover-color',
      type: 'color',
      default: 'var(--border)',
      description: 'Thumb color on hover.',
    },
    {
      name: '--scrollbar-border-radius',
      type: 'length',
      default: '100px',
      description: 'Thumb corner radius.',
    },
    {
      name: '--scrollbar-offset',
      type: 'number',
      default: '3',
      description: 'Gap between the thumb and the viewport edge.',
    },
  ];
}
