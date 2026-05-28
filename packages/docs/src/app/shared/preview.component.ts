import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';

type Tab = 'preview' | 'code';

/**
 * Tabbed preview surface - "Preview" tab projects the live component,
 * "Code" tab renders the source snippet. A common docs convention for
 * showing live components side by side with their source.
 */
@Component({
  selector: 'docs-preview',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-hidden rounded-lg border border-border bg-card">
      <div role="tablist" class="flex items-center gap-1 border-b border-border bg-muted/40 px-2 py-1">
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="active() === 'preview'"
          [class]="tabClass('preview')"
          (click)="setActive('preview')"
        >
          Preview
        </button>
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="active() === 'code'"
          [class]="tabClass('code')"
          (click)="setActive('code')"
        >
          Code
        </button>
        @if (label(); as text) {
          <span class="ml-auto text-xs text-muted-foreground">{{ text }}</span>
        }
      </div>

      <div role="tabpanel" [hidden]="active() !== 'preview'" class="relative">
        <div [class]="surfaceClass()">
          <ng-content />
        </div>
      </div>

      <div role="tabpanel" [hidden]="active() !== 'code'" class="relative">
        <pre class="overflow-x-auto p-4 text-[13px] leading-relaxed text-foreground"><code [class]="codeClass()">{{ code() }}</code></pre>
        <button
          type="button"
          class="absolute right-2 top-2 inline-flex h-7 items-center gap-1 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          [attr.aria-label]="copied() ? 'Copied' : 'Copy code'"
          (click)="copy()"
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
    </div>
  `,
})
export class DocsPreview {
  readonly code = input.required<string>();
  readonly lang = input<string>('html');
  readonly label = input<string>('');
  /** When `true`, the preview surface has no padding — useful when the
   *  projected content already brings its own card layout. */
  readonly flush = input<boolean>(false);
  /** Visual minimum height for the preview surface (defaults to 12rem). */
  readonly minHeight = input<string>('12rem');

  protected readonly active = signal<Tab>('preview');
  protected readonly copied = signal(false);

  protected readonly codeClass = computed(() =>
    this.lang() ? `language-${this.lang()}` : '',
  );

  protected readonly surfaceClass = computed(() =>
    [
      'flex items-start justify-start',
      this.flush() ? '' : 'p-6',
    ]
      .filter(Boolean)
      .join(' '),
  );

  protected tabClass(tab: Tab): string {
    const base =
      'rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
    if (this.active() === tab) {
      return `${base} bg-background text-foreground shadow-sm`;
    }
    return `${base} text-muted-foreground hover:bg-background/60 hover:text-foreground`;
  }

  protected setActive(tab: Tab): void {
    this.active.set(tab);
  }

  protected copy(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.code()).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 1500);
      });
    }
  }

  // Custom host style for the min-height surface — uses a CSS variable
  // so the input can drive the surface size declaratively.
  protected readonly hostStyle = computed(
    () => ({ ['--docs-preview-min-height' as string]: this.minHeight() }),
  );
}
