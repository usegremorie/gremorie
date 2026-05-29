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
import { cva } from 'class-variance-authority';

import { AttachmentList } from './attachment-list';
import {
  AttachmentData,
  AttachmentMediaCategory,
} from './attachment.types';
import {
  getAttachmentLabel,
  getMediaCategory,
} from './attachment.utils';

const itemVariants = cva(
  'group/attachment relative rounded-md border border-border bg-card text-card-foreground transition-colors motion-safe:animate-[gremorie-fade-in_120ms_ease-out]',
  {
    variants: {
      variant: {
        // Column-flex card with thumbnail on top, info below.
        grid: 'flex w-[220px] flex-col items-stretch gap-2 p-2',
        // Compact badge — row-flex, small icon + text + remove.
        inline: 'inline-flex h-9 max-w-[220px] items-center gap-1.5 px-2 py-1',
        // Wide row — square thumbnail, info, remove.
        list: 'flex w-full items-center gap-3 p-2',
      },
      errored: {
        true: 'border-destructive',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'grid',
      errored: false,
    },
  },
);

/**
 * Individual attachment wrapper. Provides its data + state to children
 * (preview, info, remove, etc) via DI so they can be composed in any
 * order without prop-drilling.
 */
@Component({
  selector: 'attachment-item',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'listitem',
    '[attr.data-id]': 'data().id',
    '[attr.data-media-category]': 'mediaCategory()',
    '[attr.data-loading]': 'loading() ? "" : null',
    '[attr.data-error]': 'errored() ? "" : null',
    '[class]': 'hostClass()',
  },
})
export class AttachmentItem {
  /**
   * Parent list is optional — the item still works standalone outside
   * of an AttachmentList (read variant directly from input).
   */
  private readonly list = inject(AttachmentList, { optional: true });

  readonly data = input.required<AttachmentData>();
  readonly loading = input<boolean>(false);
  readonly errored = input<boolean>(false);
  readonly variant = input<'grid' | 'inline' | 'list' | undefined>(undefined);

  readonly removed = output<AttachmentData>();

  private readonly previewUrl = signal<string | null>(null);

  readonly resolvedVariant = computed(
    () => this.variant() ?? this.list?.variant() ?? 'grid',
  );

  readonly mediaCategory = computed<AttachmentMediaCategory>(() =>
    getMediaCategory(this.data()),
  );

  readonly label = computed(() => getAttachmentLabel(this.data()));

  protected readonly hostClass = computed(() =>
    itemVariants({
      variant: this.resolvedVariant(),
      errored: this.errored(),
    }),
  );

  constructor() {
    effect((onCleanup) => {
      const current = this.data();
      // Only generate blob URL when we have a File and no explicit URL.
      if (current.url) {
        this.previewUrl.set(current.url);
        return;
      }
      if (current.file && getMediaCategory(current) === 'image') {
        const url = URL.createObjectURL(current.file);
        this.previewUrl.set(url);
        onCleanup(() => URL.revokeObjectURL(url));
        return;
      }
      this.previewUrl.set(null);
    });
  }

  /** Called by `<attachment-remove>` via DI. */
  emitRemove(): void {
    this.removed.emit(this.data());
  }

  /** Current preview URL — resolved from `data.url` or generated from `data.file`. */
  getPreviewUrl(): string | null {
    return this.previewUrl();
  }
}

