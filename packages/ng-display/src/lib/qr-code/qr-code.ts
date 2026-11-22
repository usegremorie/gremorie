import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from '@angular/core';
import { cn } from '@gremorie/ng-core';
import { cva, type VariantProps } from 'class-variance-authority';

import {
  buildQrMatrix,
  QR_QUIET_ZONE,
  type QrCodeEcc,
  type QrCodeMatrix,
} from './qr-code.logic';

/**
 * QrCode variants: mirrors React `qrCodeVariants` from `@gremorie/rx-display`
 * (class strings copied verbatim).
 */
export const qrCodeVariants = cva(
  'relative inline-flex shrink-0 overflow-hidden rounded-xl bg-background text-foreground',
  {
    variants: {
      size: {
        sm: 'size-32',
        md: 'size-48',
        lg: 'size-64',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export type QrCodeSize = NonNullable<
  VariantProps<typeof qrCodeVariants>['size']
>;

/**
 * QrCode: a scannable code drawn as one SVG path, so color comes from tokens.
 * Mirrors React `QrCode` from `@gremorie/rx-display`.
 *
 * The matrix is built by `uqr` (value + error correction level) and the dark
 * modules are painted with `currentColor`: `text-foreground` on
 * `bg-background` by default, with the four-module quiet zone scanners need
 * kept inside the box. Project a mark as content to center it over the code;
 * raise `ecc` to `Q` or `H` when it covers more than a small mark.
 *
 * @example
 * ```html
 * <gr-qr-code value="https://example.com/link/42" aria-label="Pairing code" />
 * ```
 */
@Component({
  selector: 'gr-qr-code',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (matrix(); as m) {
      <svg
        aria-hidden="true"
        class="size-full"
        shape-rendering="crispEdges"
        [attr.viewBox]="viewBox()"
      >
        <path [attr.d]="m.path" fill="currentColor" />
      </svg>
    }
    <span
      data-slot="qr-code-icon"
      class="absolute inset-0 m-auto flex size-1/5 items-center justify-center rounded-md bg-background empty:hidden [&_svg]:size-full"
      ><ng-content
    /></span>
  `,
  host: {
    'data-slot': 'qr-code',
    role: 'img',
    '[attr.aria-label]': 'ariaLabel()',
    '[attr.data-ecc]': 'ecc()',
    '[attr.data-modules]': 'matrix()?.modules',
    '[class]': 'mergedClass()',
  },
})
export class QrCode {
  /** Extra classes merged over the defaults via `cn`. Mirrors React `className`. */
  readonly class = input<string>();

  /** Text the code encodes, usually a URL. */
  readonly value = input.required<string>();
  /** Error correction level: L ~7%, M ~15%, Q ~25%, H ~30%. */
  readonly ecc = input<QrCodeEcc>('M');
  readonly size = input<QrCodeSize>('md');
  /** Accessible name of the code. Mirrors React `aria-label`. */
  readonly ariaLabel = input<string>('QR code', { alias: 'aria-label' });

  protected readonly matrix = computed<QrCodeMatrix | null>(() => {
    try {
      return buildQrMatrix(this.value(), this.ecc());
    } catch {
      // Value longer than the largest code can hold: render an empty box.
      return null;
    }
  });

  protected readonly viewBox = computed(() => {
    const m = this.matrix();
    const span = m ? m.size + QR_QUIET_ZONE * 2 : 0;
    return `${-QR_QUIET_ZONE} ${-QR_QUIET_ZONE} ${span} ${span}`;
  });

  protected readonly mergedClass = computed(() =>
    cn(qrCodeVariants({ size: this.size() }), this.class()),
  );
}
