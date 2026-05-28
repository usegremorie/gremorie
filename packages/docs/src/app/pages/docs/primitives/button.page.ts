import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Button } from '@gremorie/ng-core';

import { DocsApiTable, ApiRow } from '../../../shared/api-table.component';
import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../../shared/doc-page.component';
import { DocsPreview } from '../../../shared/preview.component';

@Component({
  selector: 'docs-primitive-button',
  imports: [
    DocsLayout,
    DocsPage,
    DocsSection,
    DocsProse,
    DocsCodeBlock,
    DocsApiTable,
    DocsPreview,
    Button,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Primitive"
        title="Button"
        lede="The Button primitive - 6 variants x 4 sizes. Used inside Gremorie NG components and freely composable in your own UI."
      >
        <docs-section title="Preview — variants" anchor="preview-variants">
          <docs-preview [code]="variantsCode" lang="html">
            <div class="flex flex-wrap items-center gap-2">
              <ai-button ariaLabel="Default">Default</ai-button>
              <ai-button variant="destructive" ariaLabel="Destructive">Destructive</ai-button>
              <ai-button variant="outline" ariaLabel="Outline">Outline</ai-button>
              <ai-button variant="secondary" ariaLabel="Secondary">Secondary</ai-button>
              <ai-button variant="ghost" ariaLabel="Ghost">Ghost</ai-button>
              <ai-button variant="link" ariaLabel="Link">Link</ai-button>
            </div>
          </docs-preview>
        </docs-section>

        <docs-section title="Preview — sizes" anchor="preview-sizes">
          <docs-preview [code]="sizesCode" lang="html">
            <div class="flex flex-wrap items-end gap-2">
              <ai-button size="sm" ariaLabel="Small">Small</ai-button>
              <ai-button ariaLabel="Default size">Default</ai-button>
              <ai-button size="lg" ariaLabel="Large">Large</ai-button>
              <ai-button size="icon" variant="outline" ariaLabel="Icon button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </ai-button>
              <ai-button [disabled]="true" ariaLabel="Disabled">Disabled</ai-button>
            </div>
          </docs-preview>
        </docs-section>

        <docs-section title="Installation" anchor="install">
          <docs-code-block lang="bash" code="npm install @gremorie/ng-core" />
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
          <docs-api-table [rows]="variants" [showDefault]="false" />
        </docs-section>

        <docs-section title="Sizes" anchor="sizes">
          <docs-api-table [rows]="sizes" [showDefault]="false" />
        </docs-section>

        <docs-section title="Accessibility" anchor="a11y">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li>Native <code>&lt;button&gt;</code> under the hood — full keyboard support out of the box (Tab, Enter, Space).</li>
              <li><code>ariaLabel</code> recommended for icon-only buttons (size <code>icon</code>) — required by AT for context.</li>
              <li><code>pressed</code> input toggles <code>aria-pressed</code> for toggle-button semantics (null = not a toggle).</li>
              <li>Focus ring uses the <code>--ring</code> semantic token, with offset against <code>--background</code>.</li>
              <li>Touch targets: <code>default</code>/<code>icon</code> = 36px, <code>sm</code> = 32px, <code>lg</code> = 40px — meets WCAG 2.2 SC 2.5.8.</li>
            </ul>
          </docs-prose>
        </docs-section>

        <docs-section title="Theming" anchor="theming">
          <docs-prose>
            <p>Semantic tokens consumed per variant:</p>
            <ul class="ml-5 list-disc space-y-1">
              <li><strong>default</strong> — <code>--primary</code> / <code>--primary-foreground</code></li>
              <li><strong>destructive</strong> — <code>--destructive</code> / <code>--destructive-foreground</code></li>
              <li><strong>outline</strong> — <code>--input</code> (border) + <code>--background</code> + hover <code>--accent</code></li>
              <li><strong>secondary</strong> — <code>--secondary</code> / <code>--secondary-foreground</code></li>
              <li><strong>ghost</strong> — transparent + hover <code>--accent</code></li>
              <li><strong>link</strong> — <code>--primary</code> as text color</li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class ButtonPrimitivePage {
  protected readonly variantsCode = `<ai-button>Default</ai-button>
<ai-button variant="destructive">Destructive</ai-button>
<ai-button variant="outline">Outline</ai-button>
<ai-button variant="secondary">Secondary</ai-button>
<ai-button variant="ghost">Ghost</ai-button>
<ai-button variant="link">Link</ai-button>`;

  protected readonly sizesCode = `<ai-button size="sm">Small</ai-button>
<ai-button>Default</ai-button>
<ai-button size="lg">Large</ai-button>
<ai-button size="icon" variant="outline" ariaLabel="Search">
  <svg><!-- icon --></svg>
</ai-button>
<ai-button [disabled]="true">Disabled</ai-button>`;

  protected readonly usage = `import { Component } from '@angular/core';
import { Button } from '@gremorie/ng-core';

@Component({
  selector: 'app-search-bar',
  imports: [Button],
  template: \`
    <ai-button
      variant="default"
      size="default"
      (pressedChange)="onClick()"
    >
      Search
    </ai-button>

    <ai-button
      variant="destructive"
      (pressedChange)="onDelete()"
    >
      Delete
    </ai-button>

    <ai-button
      variant="outline"
      size="icon"
      ariaLabel="Toggle theme"
      [pressed]="isDark()"
      (pressedChange)="toggleTheme()"
    >
      <svg><!-- icon --></svg>
    </ai-button>
  \`,
})
export class SearchBar {
  onClick() { /* ... */ }
  onDelete() { /* ... */ }
}`;

  protected readonly inputs: readonly ApiRow[] = [
    { name: 'variant', type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'", default: "'default'", description: 'Visual treatment.' },
    { name: 'size', type: "'default' | 'sm' | 'lg' | 'icon'", default: "'default'", description: 'Size class. Use icon for icon-only buttons (square).' },
    { name: 'type', type: "'button' | 'submit' | 'reset'", default: "'button'", description: 'Native button type. Stays as button by default to avoid accidental form submissions.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button.' },
    { name: 'pressed', type: 'boolean | null', default: 'null', description: 'Toggle state. null means not a toggle (no aria-pressed emitted).' },
    { name: 'ariaLabel', type: 'string', default: "''", description: 'Accessible name. Required for icon-only buttons.' },
    { name: 'title', type: 'string', default: "''", description: 'Native HTML title tooltip.' },
  ];

  protected readonly outputs: readonly ApiRow[] = [
    { name: 'pressedChange', type: 'MouseEvent', description: 'Fires on click. Carries the native MouseEvent in case modifier keys matter.' },
  ];

  protected readonly variants: readonly ApiRow[] = [
    { name: 'default', type: 'variant', description: 'Primary CTA. Solid background using --primary.' },
    { name: 'destructive', type: 'variant', description: 'Dangerous actions (delete, remove). Uses --destructive.' },
    { name: 'outline', type: 'variant', description: 'Bordered, transparent fill. Secondary actions where presence is needed but not bold.' },
    { name: 'secondary', type: 'variant', description: 'Soft alternative to default. Uses --secondary.' },
    { name: 'ghost', type: 'variant', description: 'No background at rest, accent on hover. Use in toolbars or compact layouts.' },
    { name: 'link', type: 'variant', description: 'Renders like an underlined link. Use for inline navigation actions.' },
  ];

  protected readonly sizes: readonly ApiRow[] = [
    { name: 'default', type: 'size', description: '36px high (h-9), text-sm. The standard for most buttons.' },
    { name: 'sm', type: 'size', description: '32px high (h-8), text-xs. Compact rows.' },
    { name: 'lg', type: 'size', description: '40px high (h-10). Heroes and primary CTAs.' },
    { name: 'icon', type: 'size', description: '36px square. Icon-only buttons. Pair with ariaLabel.' },
  ];
}
