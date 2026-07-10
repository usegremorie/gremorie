import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  inject,
  InjectionToken,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { cn, safeHttpUrl } from '@gremorie/ng-core';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/ng-overlays';

/**
 * One console line rendered by `WebPreviewConsole`. Mirrors React's
 * `WebPreviewConsoleProps['logs'][number]`.
 */
export interface WebPreviewLog {
  level: 'log' | 'warn' | 'error';
  message: string;
  timestamp: Date;
}

/**
 * Shared state for the WebPreview family. Mirrors React's
 * `WebPreviewContextValue`, exposed via DI so the navigation / url / body /
 * console subcomponents stay decoupled — the same pattern `CodeBlock` uses for
 * its copy button and `Artifact` uses for its menus.
 */
export interface WebPreviewState {
  url: () => string;
  setUrl: (url: string) => void;
  consoleOpen: () => boolean;
  setConsoleOpen: (open: boolean) => void;
}

export const WEB_PREVIEW = new InjectionToken<WebPreviewState>(
  'WebPreviewState',
);

/**
 * WebPreview — a sandboxed live-preview card: a URL bar over an `<iframe>` with
 * an optional collapsible console. Parity port of `@gremorie/rx-artifacts`'
 * `WebPreview`. State (current URL, console open/closed) lives on the root and
 * is shared with the subcomponents via the `WEB_PREVIEW` DI token.
 *
 * Inputs: `defaultUrl` (seeds the iframe + input), `onUrlChange` is the
 * `(urlChange)` output (fires when the URL is committed).
 */
@Component({
  selector: 'web-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'web-preview',
    class: 'flex size-full flex-col rounded-lg border bg-card',
  },
  template: `<ng-content />`,
  providers: [
    { provide: WEB_PREVIEW, useExisting: forwardRef(() => WebPreview) },
  ],
})
export class WebPreview implements WebPreviewState {
  readonly defaultUrl = input<string>('');
  readonly urlChange = output<string>();

  private readonly urlState = signal<string | null>(null);
  private readonly consoleOpenState = signal(false);

  readonly url = (): string => this.urlState() ?? this.defaultUrl();
  readonly consoleOpen = (): boolean => this.consoleOpenState();

  readonly setUrl = (url: string): void => {
    this.urlState.set(url);
    this.urlChange.emit(url);
  };

  readonly setConsoleOpen = (open: boolean): void => {
    this.consoleOpenState.set(open);
  };
}

/** Top toolbar row. Parity with React `WebPreviewNavigation`. */
@Component({
  selector: 'web-preview-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'web-preview-navigation',
    class: 'flex items-center gap-1 border-b p-2',
  },
  template: `<ng-content />`,
})
export class WebPreviewNavigation {}

/**
 * Ghost icon button for the toolbar. Parity with React
 * `WebPreviewNavigationButton`. When `tooltip` is set, the button is wrapped
 * in the styled `gn-tooltip` compound from `@gremorie/ng-overlays` (the same
 * primitive the React side uses from `@gremorie/rx-overlays`), and the text
 * doubles as the `aria-label`. Disabled + click forward.
 */
@Component({
  selector: 'web-preview-navigation-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgTemplateOutlet,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  ],
  host: { 'data-slot': 'web-preview-navigation-button' },
  template: `
    <ng-template #btn>
      <button
        type="button"
        class="inline-flex size-8 items-center justify-center rounded-md p-0 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        [disabled]="disabled()"
        [attr.aria-label]="tooltip() || null"
        (click)="clicked.emit($event)"
      >
        <ng-content />
      </button>
    </ng-template>

    @if (tooltip()) {
      <gn-tooltip-provider>
        <gn-tooltip>
          <gn-tooltip-trigger>
            <ng-container [ngTemplateOutlet]="btn" />
          </gn-tooltip-trigger>
          <gn-tooltip-content>{{ tooltip() }}</gn-tooltip-content>
        </gn-tooltip>
      </gn-tooltip-provider>
    } @else {
      <ng-container [ngTemplateOutlet]="btn" />
    }
  `,
})
export class WebPreviewNavigationButton {
  readonly tooltip = input<string>();
  readonly disabled = input<boolean>(false);
  readonly clicked = output<MouseEvent>();
}

/**
 * Address input. Commits the typed value to the shared URL on Enter. Parity
 * with React `WebPreviewUrl`. `value` is an optional controlled override; when
 * unset the field tracks the shared URL.
 */
@Component({
  selector: 'web-preview-url',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'web-preview-url', class: 'contents' },
  template: `
    <input
      type="text"
      class="flex h-8 w-full flex-1 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      placeholder="Enter URL..."
      [value]="displayValue()"
      (input)="onInput($event)"
      (keydown.enter)="commit($event)"
    />
  `,
})
export class WebPreviewUrl {
  readonly value = input<string>();

  private readonly host = inject(WEB_PREVIEW);
  protected readonly inputValue = signal('');

  protected readonly displayValue = (): string =>
    this.value() ?? this.inputValue();

  constructor() {
    // Sync the local input with the shared URL when it changes externally.
    effect(() => {
      this.inputValue.set(this.host.url());
    });
  }

  protected onInput(event: Event): void {
    this.inputValue.set((event.target as HTMLInputElement).value);
  }

  protected commit(event: Event): void {
    this.host.setUrl((event.target as HTMLInputElement).value);
  }
}

/**
 * The sandboxed `<iframe>`. Uses the shared URL unless `src` is set. Parity with
 * React `WebPreviewBody`. The optional `loading` slot is projected after the
 * iframe.
 *
 * ## Security
 *
 * The frame previews untrusted URLs, so the sandbox deliberately omits
 * `allow-same-origin`. Combined with `allow-scripts` it is a documented escape:
 * a framed page on the embedder's origin can reach `window.parent`, strip the
 * `sandbox` attribute and re-load itself unsandboxed. `safeHttpUrl` already
 * rejects relative URLs, but an absolute URL aimed at the host origin would
 * still slip through, so the capability is dropped outright.
 *
 * The `sandbox` value is a static attribute, not a binding: Angular forbids a
 * bound `sandbox` on an iframe (NG0910) precisely to stop it being weakened at
 * runtime. That constraint is a feature here, not a limitation.
 */
@Component({
  selector: 'web-preview-body',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'web-preview-body', class: 'flex-1' },
  template: `
    @if (safeSrc(); as src) {
      <iframe
        [class]="iframeClass"
        sandbox="allow-scripts allow-forms allow-popups allow-presentation"
        [src]="src"
        title="Preview"
      ></iframe>
    } @else {
      <iframe
        [class]="iframeClass"
        sandbox="allow-scripts allow-forms allow-popups allow-presentation"
        title="Preview"
      ></iframe>
    }
    <ng-content />
  `,
})
export class WebPreviewBody {
  readonly src = input<string>();
  readonly iframeClass = cn('size-full');

  private readonly host = inject(WEB_PREVIEW);
  private readonly sanitizer = inject(DomSanitizer);

  /** Resolved URL (own `src` wins over the shared URL), like React. */
  protected readonly resolvedSrc = (): string => this.src() ?? this.host.url();

  /**
   * Angular blocks dynamic `[src]` on an iframe unless the value is an
   * explicitly-trusted resource URL (NG0904), and `bypassSecurityTrustResourceUrl`
   * disables the sanitizer for whatever it is handed. It is therefore only ever
   * handed a URL that `safeHttpUrl` has already validated as absolute http(s);
   * anything else yields no `src` at all.
   */
  protected readonly safeSrc = (): SafeResourceUrl | null => {
    const url = safeHttpUrl(this.resolvedSrc());
    return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : null;
  };
}

/**
 * Collapsible console panel rendering a `logs` array. Parity with React
 * `WebPreviewConsole`. ng-artifacts has no Collapsible primitive, so the
 * expand/collapse is hand-built off the shared `consoleOpen` state — same
 * approach `Artifact`'s menu uses for its own popovers.
 */
@Component({
  selector: 'web-preview-console',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'web-preview-console',
    class: 'border-t bg-muted/50 font-mono text-sm',
  },
  template: `
    <button
      type="button"
      class="flex w-full items-center justify-between p-4 text-left font-medium transition-colors hover:bg-muted/50"
      [attr.aria-expanded]="open()"
      (click)="toggle()"
    >
      Console
      <svg
        class="h-4 w-4 transition-transform duration-200"
        [class.rotate-180]="open()"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>

    @if (open()) {
      <div class="px-4 pb-4">
        <div class="max-h-48 space-y-1 overflow-y-auto">
          @if (logs().length === 0) {
            <p class="text-muted-foreground">No console output</p>
          } @else {
            @for (log of logs(); track $index) {
              <div
                class="text-xs"
                [class.text-destructive]="log.level === 'error'"
                [class.text-yellow-600]="log.level === 'warn'"
                [class.text-foreground]="log.level === 'log'"
              >
                <span class="text-muted-foreground">{{
                  formatTime(log.timestamp)
                }}</span>
                {{ log.message }}
              </div>
            }
          }
          <ng-content />
        </div>
      </div>
    }
  `,
})
export class WebPreviewConsole {
  readonly logs = input<WebPreviewLog[]>([]);

  private readonly host = inject(WEB_PREVIEW);
  protected readonly open = (): boolean => this.host.consoleOpen();

  protected toggle(): void {
    this.host.setConsoleOpen(!this.host.consoleOpen());
  }

  protected formatTime(d: Date): string {
    return d.toLocaleTimeString();
  }
}
