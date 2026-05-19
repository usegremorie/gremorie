import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';

import { PromptInput } from './prompt-input';
import { PromptInputAttachmentType } from './prompt-input.types';
import { cn } from './utils';

const ICON_PATHS: Record<Exclude<PromptInputAttachmentType, 'image'>, string> = {
  pdf: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  audio:
    'M9 18V5l12-2v13 M6 18a3 3 0 1 0 3 3v-3 M18 16a3 3 0 1 0 3 3v-3',
  video:
    'M23 7l-7 5 7 5V7z M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z',
  text: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H9',
  generic:
    'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M13 2v7h7',
};

@Component({
  selector: 'prompt-input-attachment',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="cardClass()">
      <div [class]="previewClass()">
        @if (type() === 'image' && previewUrl(); as src) {
          <img [src]="src" [alt]="file().name" class="size-full object-cover" />
        } @else {
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="size-5"
          >
            <path [attr.d]="iconPath()"></path>
          </svg>
        }

        @if (errored()) {
          <span class="absolute inset-x-0 bottom-0 bg-destructive py-0.5 text-center text-[10px] font-medium text-destructive-foreground">
            Error
          </span>
        } @else if (loading()) {
          <span class="absolute inset-0 animate-pulse bg-muted/60"></span>
        }
      </div>

      <div class="flex min-w-0 flex-1 flex-col">
        <span [class]="nameClass()" [title]="file().name">{{ file().name }}</span>
        <span class="text-xs text-muted-foreground">{{ formattedSize() }}</span>
      </div>

      @if (removable()) {
        <button
          type="button"
          class="inline-flex size-6 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          [attr.aria-label]="'Remove ' + file().name"
          (click)="handleRemove()"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="size-3.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      }
    </div>
  `,
  host: {
    role: 'listitem',
    '[attr.data-type]': 'type()',
    '[attr.data-loading]': 'loading() ? "" : null',
    '[attr.data-error]': 'errored() ? "" : null',
  },
})
export class PromptInputAttachment {
  private readonly parent = inject(PromptInput, { optional: true });

  readonly file = input.required<File>();
  readonly loading = input<boolean>(false);
  readonly errored = input<boolean>(false);
  readonly removable = input<boolean>(true);

  readonly removed = output<File>();

  protected readonly previewUrl = signal<string | null>(null);

  protected readonly type = computed<PromptInputAttachmentType>(() => {
    const mime = this.file().type;
    if (mime.startsWith('image/')) return 'image';
    if (mime.startsWith('video/')) return 'video';
    if (mime.startsWith('audio/')) return 'audio';
    if (mime === 'application/pdf') return 'pdf';
    if (mime.startsWith('text/')) return 'text';
    return 'generic';
  });

  protected readonly iconPath = computed(() => {
    const type = this.type();
    if (type === 'image') return '';
    return ICON_PATHS[type];
  });

  protected readonly formattedSize = computed(() => {
    const bytes = this.file().size;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  });

  protected readonly cardClass = computed(() =>
    cn(
      'inline-flex max-w-[220px] items-center gap-2 rounded-md border border-border bg-card p-2',
      this.errored() && 'border-destructive',
    ),
  );

  protected readonly previewClass = computed(() =>
    cn(
      'relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded bg-muted text-muted-foreground',
    ),
  );

  protected readonly nameClass = computed(() =>
    cn('truncate text-sm text-foreground'),
  );

  constructor() {
    effect((onCleanup) => {
      const currentFile = this.file();
      if (this.type() !== 'image') {
        this.previewUrl.set(null);
        return;
      }
      const url = URL.createObjectURL(currentFile);
      this.previewUrl.set(url);
      onCleanup(() => URL.revokeObjectURL(url));
    });
  }

  protected handleRemove(): void {
    this.removed.emit(this.file());
    this.parent?.removeAttachment(this.file());
  }
}
