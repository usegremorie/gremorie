import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  InjectionToken,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { codeToHtml, type BundledLanguage, type ShikiTransformer } from 'shiki';

/**
 * Highlights `code` for both light and dark themes (github-light-default
 * and github-dark-default — same as rx-ai). Optionally prepends line
 * numbers via a Shiki transformer.
 */
export async function highlightCode(
  code: string,
  language: BundledLanguage,
  showLineNumbers = false,
): Promise<[string, string]> {
  const transformers: ShikiTransformer[] = showLineNumbers
    ? [lineNumberTransformer]
    : [];

  return Promise.all([
    codeToHtml(code, {
      lang: language,
      theme: 'github-light-default',
      transformers,
    }),
    codeToHtml(code, {
      lang: language,
      theme: 'github-dark-default',
      transformers,
    }),
  ]) as Promise<[string, string]>;
}

const lineNumberTransformer: ShikiTransformer = {
  name: 'line-numbers',
  line(node, line) {
    node.children.unshift({
      type: 'element',
      tagName: 'span',
      properties: {
        className: [
          'inline-block',
          'min-w-10',
          'mr-4',
          'text-right',
          'select-none',
          'text-muted-foreground',
        ],
      },
      children: [{ type: 'text', value: String(line) }],
    });
  },
};

/**
 * CodeBlock — Shiki-highlighted code container.
 *
 * Mirrors React `CodeBlock`. Renders both light and dark snapshots and
 * shows the right one via Tailwind's `dark:` variants — same approach as
 * rx-ai. Exposes the raw `code` via DI so `<code-block-copy-button>`
 * stays decoupled.
 */
export interface CodeBlockState {
  code: () => string;
}

export const CODE_BLOCK = new InjectionToken<CodeBlockState>('CodeBlockState');

@Component({
  selector: 'code-block',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative">
      <div
        class="overflow-auto dark:hidden [&>pre]:m-0 [&>pre]:bg-background! [&>pre]:p-4 [&>pre]:text-foreground! [&>pre]:text-sm [&_code]:font-mono [&_code]:text-sm"
        [innerHTML]="lightHtml()"
      ></div>
      <div
        class="hidden overflow-auto dark:block [&>pre]:m-0 [&>pre]:bg-background! [&>pre]:p-4 [&>pre]:text-foreground! [&>pre]:text-sm [&_code]:font-mono [&_code]:text-sm"
        [innerHTML]="darkHtml()"
      ></div>
      <div class="absolute top-2 right-2 flex items-center gap-2">
        <ng-content />
      </div>
    </div>
  `,
  host: {
    class:
      'group relative w-full overflow-hidden rounded-md border bg-background text-foreground block',
  },
  providers: [
    { provide: CODE_BLOCK, useExisting: forwardRef(() => CodeBlock) },
  ],
})
export class CodeBlock implements CodeBlockState {
  readonly code = input.required<string>();
  readonly language = input.required<BundledLanguage>();
  readonly showLineNumbers = input<boolean>(false);

  protected readonly lightHtml = signal<string>('');
  protected readonly darkHtml = signal<string>('');

  constructor() {
    let cancelled = false;
    effect((onCleanup) => {
      cancelled = false;
      onCleanup(() => {
        cancelled = true;
      });
      const c = this.code();
      const lang = this.language();
      const lines = this.showLineNumbers();
      highlightCode(c, lang, lines)
        .then(([light, dark]) => {
          if (cancelled) return;
          this.lightHtml.set(light);
          this.darkHtml.set(dark);
        })
        .catch((err) => {
          // Fallback to plain pre on highlight failure.
          if (cancelled) return;
          const fallback = `<pre><code>${escapeHtml(c)}</code></pre>`;
          this.lightHtml.set(fallback);
          this.darkHtml.set(fallback);
          console.warn('[ng-ai] CodeBlock highlight failed', err);
        });
    });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
