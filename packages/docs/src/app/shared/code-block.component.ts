import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'docs-code-block',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group relative overflow-hidden rounded-md border border-border bg-card">
      @if (lang() || title()) {
        <div class="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-1.5 text-xs font-mono text-muted-foreground">
          <span>{{ title() || lang() }}</span>
        </div>
      }
      <pre class="overflow-x-auto p-4 text-[13px] leading-relaxed text-foreground"><code [class]="codeClass()">{{ code() }}</code></pre>
      <button
        type="button"
        class="absolute right-2 top-2 inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground opacity-0 transition-opacity hover:bg-accent group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        (click)="copy()"
        [attr.aria-label]="copied() ? 'Copied' : 'Copy code'"
      >
        @if (copied()) {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        } @else {
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy
        }
      </button>
    </div>
  `,
})
export class DocsCodeBlock {
  readonly code = input.required<string>();
  readonly lang = input<string>('');
  readonly title = input<string>('');

  protected readonly copied = signal(false);

  protected readonly codeClass = () => (this.lang() ? `language-${this.lang()}` : '');

  copy(): void {
    const text = this.code();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 1500);
      });
    }
  }
}
