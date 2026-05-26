import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DocsCodeBlock } from '../../shared/code-block.component';
import { DocsLayout } from '../../shared/doc-layout.component';
import { DocsPage, DocsSection, DocsProse } from '../../shared/doc-page.component';

@Component({
  selector: 'docs-getting-started',
  imports: [DocsLayout, DocsPage, DocsSection, DocsProse, DocsCodeBlock, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <docs-layout>
      <docs-page
        eyebrow="Introduction"
        title="Getting started"
        lede="Gremorie NG is a registry-style component library for Angular focused on AI interfaces. Install the components you need, own the code, integrate with whichever LLM stack you prefer."
      >
        <docs-section title="Requirements" anchor="requirements">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><strong>Angular 21+</strong> (Angular 22 supported when GA)</li>
              <li><strong>TypeScript 5.9+</strong></li>
              <li><strong>Tailwind CSS v4</strong> with OKLCH color support</li>
              <li><strong>Standalone components</strong> (no NgModule support)</li>
              <li><strong>Zoneless</strong> compatible (recommended; works with zone.js too)</li>
            </ul>
          </docs-prose>
        </docs-section>

        <docs-section title="Install the library" anchor="install">
          <docs-code-block lang="bash" code="npm install @gremorie/ng-ai" />
          <docs-prose>
            <p>
              <code>&#64;usegremorie/gremorie-prompt-input</code> ships the full PromptInput family
              (10 components). Each component is standalone and tree-shakeable — import only
              what you use.
            </p>
            <p>
              Peer dependencies (<code>clsx</code>, <code>tailwind-merge</code>) are installed
              alongside. <code>&#64;angular/core ^21.2.0</code> is required.
            </p>
          </docs-prose>
        </docs-section>

        <docs-section title="Add the theme" anchor="theme">
          <docs-prose>
            <p>
              Gremorie NG ships a two-tier token system (primitives → semantics), fully
              shadcn-compatible. Import it once in your global stylesheet, then customize
              the variables for rebrand.
            </p>
          </docs-prose>
          <docs-code-block
            title="styles.css"
            lang="css"
            [code]="themeImport"
          />
        </docs-section>

        <docs-section title="Use a component" anchor="use">
          <docs-prose>
            <p>Compose the three core PromptInput pieces in a standalone component:</p>
          </docs-prose>
          <docs-code-block
            title="chat.component.ts"
            lang="typescript"
            [code]="basicUsage"
          />
          <docs-prose>
            <p>
              See <a routerLink="/docs/components/prompt-input">PromptInput</a> for the full
              container API, or jump to <a routerLink="/docs/integrations/signals">Plain signals</a>
              for a complete end-to-end streaming example with no AI library.
            </p>
          </docs-prose>
        </docs-section>

        <docs-section title="Editor support (Angular ESLint)" anchor="eslint">
          <docs-prose>
            <p>
              Gremorie NG ships components with selectors like <code>prompt-input</code> (no library
              prefix). If your project uses <code>&#64;angular-eslint</code> with the default
              <code>app</code> prefix, add the Gremorie NG-allowed prefixes to your rule config.
            </p>
          </docs-prose>
          <docs-code-block
            title="eslint.config.mjs"
            lang="javascript"
            [code]="eslintConfig"
          />
        </docs-section>

        <docs-section title="What's next" anchor="next">
          <docs-prose>
            <ul class="ml-5 list-disc space-y-1">
              <li><a routerLink="/docs/components/prompt-input">Browse the PromptInput container</a> — start here</li>
              <li><a routerLink="/docs/integrations/signals">Plain signals integration</a> — wire it to anything</li>
              <li><a href="https://github.com/usegremorie/gremorie" target="_blank" rel="noopener">GitHub repository</a> — source, issues, discussions</li>
            </ul>
          </docs-prose>
        </docs-section>
      </docs-page>
    </docs-layout>
  `,
})
export default class GettingStartedPage {
  protected readonly themeImport = `@import 'tailwindcss';
@import '@gremorie/ng-ai/theme.css';

/* Optional: override primitives or semantics here */
:root {
  --primary: oklch(0.5 0.2 250);  /* your brand color */
}`;

  protected readonly basicUsage = `import { Component, signal } from '@angular/core';
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputSubmitEvent,
  PromptInputTextarea,
  PromptInputToolbar,
} from '@gremorie/ng-ai';

@Component({
  selector: 'app-chat',
  imports: [PromptInput, PromptInputTextarea, PromptInputToolbar, PromptInputSubmit],
  template: \`
    <prompt-input [(value)]="message" (submitted)="onSubmit($event)">
      <prompt-input-textarea placeholder="Ask anything…" />
      <prompt-input-toolbar>
        <prompt-input-submit />
      </prompt-input-toolbar>
    </prompt-input>
  \`,
})
export class ChatComponent {
  message = signal('');

  onSubmit(event: PromptInputSubmitEvent) {
    console.log('User submitted:', event.value);
  }
}`;

  protected readonly eslintConfig = `{
  '@angular-eslint/component-selector': [
    'error',
    {
      type: 'element',
      style: 'kebab-case',
      // 'app' for your code, 'ai' + multi-word names for Gremorie NG components.
      prefix: ['app', 'ai', 'prompt-input', 'message', 'tool-call', 'code-block'],
    },
  ],
}`;
}
