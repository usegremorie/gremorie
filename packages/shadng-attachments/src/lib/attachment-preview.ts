import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { cva } from 'class-variance-authority';

import { AttachmentItem } from './attachment-item';
import { AttachmentMediaCategory } from './attachment.types';

const previewVariants = cva(
  'relative flex shrink-0 items-center justify-center overflow-hidden bg-muted text-muted-foreground',
  {
    variants: {
      variant: {
        grid: 'h-32 w-full rounded-md',
        inline: 'size-5 rounded-sm',
        list: 'size-10 rounded-md',
      },
    },
    defaultVariants: { variant: 'grid' },
  },
);

const ICON_BY_CATEGORY: Record<
  Exclude<AttachmentMediaCategory, 'image'>,
  string
> = {
  video:
    'M23 7l-7 5 7 5V7z M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z',
  audio:
    'M9 18V5l12-2v13 M6 18a3 3 0 1 0 3 3v-3 M18 16a3 3 0 1 0 3 3v-3',
  document:
    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8',
  source:
    'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  unknown:
    'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M13 2v7h7',
};

/**
 * Visual preview surface. Renders an <img> for image data when a blob
 * URL or static URL is available, otherwise a media-type icon.
 *
 * Override entirely via the optional `fallback` TemplateRef input —
 * useful when you have your own icon system (lucide / heroicons / etc).
 */
@Component({
  selector: 'attachment-preview',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="hostClass()">
      @if (mediaCategory() === 'image' && imageSrc(); as src) {
        <img [src]="src" [alt]="alt()" class="size-full object-cover" />
      } @else if (fallback()) {
        <ng-container *ngTemplateOutlet="fallback()!"></ng-container>
      } @else {
        <svg
          [class]="iconClass()"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path [attr.d]="iconPath()"></path>
        </svg>
      }
      @if (parent.loading()) {
        <span class="absolute inset-0 animate-pulse bg-muted/60"></span>
      }
      @if (parent.errored()) {
        <span class="absolute inset-x-0 bottom-0 bg-destructive py-0.5 text-center text-[10px] font-medium text-destructive-foreground">
          Error
        </span>
      }
    </div>
  `,
  imports: [NgTemplateOutlet],
})
export class AttachmentPreview {
  protected readonly parent = inject(AttachmentItem);

  readonly fallback = input<TemplateRef<unknown> | null>(null);

  protected readonly mediaCategory = computed(() =>
    this.parent.mediaCategory(),
  );

  protected readonly imageSrc = computed(() => this.parent.getPreviewUrl());

  protected readonly alt = computed(
    () => this.parent.data().filename ?? 'Attachment preview',
  );

  protected readonly hostClass = computed(() =>
    previewVariants({ variant: this.parent.resolvedVariant() }),
  );

  protected readonly iconClass = computed(() => {
    const variant = this.parent.resolvedVariant();
    return variant === 'inline' ? 'size-3.5' : 'size-5';
  });

  protected readonly iconPath = computed(() => {
    const category = this.mediaCategory();
    if (category === 'image') return '';
    return ICON_BY_CATEGORY[category];
  });
}
