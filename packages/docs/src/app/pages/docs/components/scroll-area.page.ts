import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ScrollArea } from '@gremorie/ng-containers';

import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import {
  DocsPage,
  DocsSection,
  DocsProse,
} from '../../../shared/doc-page.component';
import { DocsPreview } from '../../../shared/preview.component';

@Component({
  selector: 'docs-scroll-area',
  imports: [
    DocsLayout,
    DocsPage,
    DocsSection,
    DocsProse,
    DocsCodeBlock,
    DocsPreview,
    ScrollArea,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Component · Layout"
        title="Scroll Area"
        lede="Themeable scroll container. The visible bar comes from the DS scrollbar baseline in @gremorie/tokens (thin, --border thumb) — gr-scroll-area is a thin structural wrapper, no third-party scrollbar library."
      >
        <docs-section title="Installation" anchor="install">
          <docs-prose>Install the package:</docs-prose>
          <docs-code-block lang="bash" [code]="install" />
          <docs-prose>Or via the Gremorie NG CLI:</docs-prose>
          <docs-code-block lang="bash" [code]="installCli" />
        </docs-section>

        <docs-section
          title="Usage"
          anchor="usage"
          lede="Wrap your content in <gr-scroll-area> and give it a constrained height so it can overflow and scroll."
        >
          <docs-preview [code]="usage" label="vertical scroll">
            <gr-scroll-area class="h-56 w-full rounded-md border border-border">
              <div class="flex flex-col gap-2 p-4">
                @for (item of items; track item) {
                  <div
                    class="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
                  >
                    {{ item }}
                  </div>
                }
              </div>
            </gr-scroll-area>
          </docs-preview>
          <docs-code-block lang="ts" [code]="component" />
        </docs-section>

        <docs-section title="Notes" anchor="notes">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li>
                <code>ScrollArea</code> is a standalone component with selector
                <code>gr-scroll-area</code> — it renders its own host element
                and an inner viewport, no third-party scrollbar library.
              </li>
              <li>
                The visible bar comes from the DS scrollbar baseline in
                <code>@gremorie/tokens</code> (<code>scrollbar-width: thin</code
                >, thumb on <code>--border</code>), applied globally — there are
                no per-component CSS custom properties to tune.
              </li>
              <li>
                The host gets <code>display: block</code> and
                <code>data-slot="scroll-area"</code> for styling/testing hooks;
                the inner viewport carries
                <code>data-slot="scroll-area-viewport"</code>.
              </li>
              <li>
                Constrain it with a fixed height/width via the host
                <code>class</code> so its content can overflow.
              </li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class ScrollAreaPage {
  protected readonly items = Array.from(
    { length: 24 },
    (_, i) => 'Item ' + (i + 1),
  );

  protected readonly install = 'npm install @gremorie/ng-containers';

  protected readonly installCli = 'npx gremorie add scroll-area';

  protected readonly usage = [
    '<gr-scroll-area class="h-56 w-full rounded-md border border-border">',
    '  <div class="flex flex-col gap-2 p-4">',
    '    @for (item of items; track item) {',
    '      <div class="...">{{ item }}</div>',
    '    }',
    '  </div>',
    '</gr-scroll-area>',
  ].join('\n');

  protected readonly component = [
    "import { Component } from '@angular/core';",
    "import { ScrollArea } from '@gremorie/ng-containers';",
    '',
    '@Component({',
    "  selector: 'app-example',",
    '  imports: [ScrollArea],',
    "  templateUrl: './example.html',",
    '})',
    'export class ExampleComponent {}',
  ].join('\n');
}
