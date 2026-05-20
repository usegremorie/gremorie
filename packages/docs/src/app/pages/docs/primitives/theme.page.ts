import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DocsApiTable, ApiRow } from '../../../shared/api-table.component';
import { DocsCodeBlock } from '../../../shared/code-block.component';
import { DocsLayout } from '../../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../../shared/doc-page.component';

@Component({
  selector: 'docs-primitive-theme',
  imports: [DocsLayout, DocsPage, DocsSection, DocsProse, DocsCodeBlock, DocsApiTable],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Primitive · Tokens"
        title="Theme tokens"
        lede="ShadNG uses a two-tier token system — primitives → semantics — fully shadcn-compatible. Rebrand the whole library by editing the primitive palette, or remap dark mode by overriding semantics inside .dark."
      >
        <docs-section title="Why two tiers" anchor="why">
          <docs-prose>
            <p>
              <strong>Primitives</strong> are the raw palette and base radii — pure colors and
              numbers with no semantic meaning (<code>--color-gray-500</code>, <code>--radius-base</code>).
              They never change between light and dark mode.
            </p>
            <p>
              <strong>Semantics</strong> are what components consume — <code>--background</code>,
              <code>--foreground</code>, <code>--primary</code>, etc. Dark mode just remaps these.
              Names match shadcn 1:1, so existing shadcn themes work as-is.
            </p>
            <p>
              ShadNG does <strong>not</strong> ship component-specific tokens. If a future AI
              component needs a surface that doesn't fit the existing semantics, the right move
              is to add a new <em>semantic</em> token shared by every consumer — not a
              component-scoped one.
            </p>
          </docs-prose>
        </docs-section>

        <docs-section title="Install" anchor="install">
          <docs-code-block lang="css" title="styles.css" [code]="install" />
          <docs-prose>
            <p>The import order matters — <code>tailwindcss</code> first, then the theme.</p>
          </docs-prose>
        </docs-section>

        <docs-section title="Primitives" anchor="primitives">
          <docs-prose>
            <p>Pure palette + base scale. Edit these to rebrand globally.</p>
          </docs-prose>
          <docs-api-table [rows]="primitives" [showDefault]="false" />
        </docs-section>

        <docs-section title="Semantics" anchor="semantics">
          <docs-prose>
            <p>What components actually consume. Edit <code>.dark</code> overrides to retune dark mode.</p>
          </docs-prose>
          <docs-api-table [rows]="semantics" [showDefault]="false" />
        </docs-section>

        <docs-section title="Rebrand examples" anchor="rebrand">
          <docs-prose>
            <p><strong>Global brand color change</strong> — edit primary semantic in <code>:root</code>:</p>
          </docs-prose>
          <docs-code-block lang="css" [code]="brandExample" />

          <docs-prose>
            <p><strong>Custom dark mode tint</strong> — override semantics inside <code>.dark</code>:</p>
          </docs-prose>
          <docs-code-block lang="css" [code]="darkExample" />
        </docs-section>

        <docs-section title="Reduced motion" anchor="motion">
          <docs-prose>
            <p>
              The theme file also ships a global <code>prefers-reduced-motion</code> override.
              All animations and transitions are reduced to 0.01ms for users who request it —
              works automatically with the rest of your app's CSS.
            </p>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class ThemePrimitivePage {
  protected readonly install = `@import 'tailwindcss';
@import '@shadng/core/theme.css';`;

  protected readonly brandExample = `:root {
  --primary: oklch(0.5 0.2 250);          /* your blue */
  --primary-foreground: oklch(0.985 0 0);
}`;

  protected readonly darkExample = `.dark {
  --background: oklch(0.12 0.02 250);     /* deep blue-tinted dark */
  --foreground: oklch(0.95 0 0);
  --primary: oklch(0.7 0.15 250);
}`;

  protected readonly primitives: readonly ApiRow[] = [
    { name: '--color-gray-50 … 950', type: 'palette', description: '11 gray steps in OKLCH. Used by semantics in light and dark.' },
    { name: '--color-red-400 / 500', type: 'palette', description: 'Destructive accents. Light uses 500, dark uses 400.' },
    { name: '--radius-base', type: 'scale', description: '0.625rem (10px) — anchor for all derived radii.' },
    { name: '--radius-sm / md / lg / xl', type: 'scale', description: 'Derived as 0.6× / 0.8× / 1× / 1.4× of base.' },
  ];

  protected readonly semantics: readonly ApiRow[] = [
    { name: '--background / --foreground', type: 'surface', description: 'Default page background and primary text.' },
    { name: '--card / --card-foreground', type: 'surface', description: 'Elevated container surface.' },
    { name: '--popover / --popover-foreground', type: 'surface', description: 'Dropdowns, menus, popovers.' },
    { name: '--primary / --primary-foreground', type: 'action', description: 'Submit button, primary CTA.' },
    { name: '--secondary / --secondary-foreground', type: 'action', description: 'Secondary buttons, badges.' },
    { name: '--muted / --muted-foreground', type: 'state', description: 'Disabled or de-emphasized content.' },
    { name: '--accent / --accent-foreground', type: 'state', description: 'Hover and pressed states.' },
    { name: '--destructive / --destructive-foreground', type: 'state', description: 'Error states, dangerous actions.' },
    { name: '--border / --input', type: 'border', description: 'Component borders. Input is slightly stronger.' },
    { name: '--ring', type: 'focus', description: 'Focus ring color.' },
  ];
}
