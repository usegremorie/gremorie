import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocsApiTable, ApiRow } from '../../shared/api-table.component';
import { DocsCodeBlock } from '../../shared/code-block.component';
import { DocsLayout } from '../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../shared/doc-page.component';

@Component({
  selector: 'docs-cli',
  imports: [DocsLayout, DocsPage, DocsSection, DocsProse, DocsCodeBlock, DocsApiTable, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Tooling"
        title="CLI"
        lede="The Gremorie NG CLI scaffolds the theme + dependencies, installs component families, and shows what is available. Use it once for setup, then once per component you adopt."
      >
        <docs-section title="Install" anchor="install">
          <docs-prose>
            <p>No global install needed — use <code>npx</code>:</p>
          </docs-prose>
          <docs-code-block lang="bash" code="npx gremorie init" />
          <docs-prose>
            <p>Or install globally if you prefer:</p>
          </docs-prose>
          <docs-code-block lang="bash" code="npm install -g @gremorie/ng-cli" />
        </docs-section>

        <docs-section title="gremorie init" anchor="init">
          <docs-prose>
            <p>Set up the theme + dependencies in an existing Angular project. Detects your package manager (npm / pnpm / yarn / bun), installs <code>&#64;Gremorie NG/core</code> with its peer deps, and prepends the theme import to <code>src/styles.css</code>.</p>
          </docs-prose>
          <docs-code-block lang="bash" code="gremorie init" />
          <docs-prose>
            <p>Preview what it will do before writing anything:</p>
          </docs-prose>
          <docs-code-block lang="bash" code="gremorie init --dry-run" />
        </docs-section>

        <docs-section title="gremorie add" anchor="add">
          <docs-prose>
            <p>Install a component family by friendly name. The CLI runs the install for you and prints an import snippet.</p>
          </docs-prose>
          <docs-code-block lang="bash" code="gremorie add prompt-input" />
          <docs-prose>
            <p>Available today:</p>
            <ul class="ml-5 list-disc space-y-1">
              <li><code>core</code> — utilities + Button primitive (<a routerLink="/docs/primitives/button">docs</a>)</li>
              <li><code>prompt-input</code> — PromptInput family (<a routerLink="/docs/components/prompt-input">docs</a>)</li>
            </ul>
          </docs-prose>
        </docs-section>

        <docs-section title="gremorie list" anchor="list">
          <docs-prose>
            <p>Show what's available and what's scheduled. Useful to scan the roadmap at a glance.</p>
          </docs-prose>
          <docs-code-block lang="bash" code="gremorie list" />
        </docs-section>

        <docs-section title="Flags" anchor="flags">
          <docs-api-table [rows]="flags" [showDefault]="false" />
        </docs-section>

        <docs-section title="Roadmap" anchor="roadmap">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><strong>v0.1 (current)</strong> — installs pre-built packages from npm.</li>
              <li><strong>v0.2</strong> - copies source files into your project. You own the code.</li>
              <li><strong>v0.3</strong> — hosted registry at <code>gremorie.com/registry</code> so new components don't need a CLI release.</li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class CliPage {
  protected readonly flags: readonly ApiRow[] = [
    { name: '--dry-run', type: 'bool', description: 'Print what would happen without writing files or running installs. Available on init + add.' },
    { name: '-y, --yes', type: 'bool', description: 'Skip confirmation prompts. Available on init.' },
    { name: '-v, --version', type: 'bool', description: 'Print the CLI version.' },
    { name: '-h, --help', type: 'bool', description: 'Show help for the command.' },
  ];
}
