import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cva, type VariantProps } from 'class-variance-authority';

import { AttachmentVariant } from './attachment.types';

/**
 * Layout for the attachment list.
 *
 * - **grid** — wraps cards, best for message bubbles or rich preview.
 * - **inline** — compact badge row, best for input toolbars.
 * - **list** — vertical stack with full metadata, best for upload UIs.
 */
const listVariants = cva('flex w-full', {
  variants: {
    variant: {
      grid: 'flex-wrap items-start gap-3',
      inline: 'flex-wrap items-center gap-2',
      list: 'flex-col gap-2',
    },
  },
  defaultVariants: {
    variant: 'grid',
  },
});

export type AttachmentListVariantProps = VariantProps<typeof listVariants>;

@Component({
  selector: 'attachment-list',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    role: 'list',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.data-variant]': 'variant()',
    '[class]': 'hostClass()',
  },
})
export class AttachmentList {
  readonly variant = input<AttachmentVariant>('grid');
  readonly ariaLabel = input<string>('Attachments');

  protected readonly hostClass = computed(() =>
    listVariants({ variant: this.variant() }),
  );
}
