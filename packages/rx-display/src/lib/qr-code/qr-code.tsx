import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@gremorie/rx-core';

import {
  buildQrMatrix,
  QR_QUIET_ZONE,
  type QrCodeEcc,
  type QrCodeMatrix,
} from './qr-code.logic';

/**
 * QrCode: a scannable code drawn as one SVG path, so color comes from tokens.
 *
 * The matrix is built by `uqr` (value + error correction level) and the dark
 * modules are painted with `currentColor`: `text-foreground` on
 * `bg-background` by default, with the four-module quiet zone scanners need
 * kept inside the box. An optional `icon` sits in the center; raise `ecc` to
 * `Q` or `H` when it covers more than a small mark.
 */
const qrCodeVariants = cva(
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

export type QrCodeProps = Omit<React.ComponentProps<'div'>, 'children'> &
  VariantProps<typeof qrCodeVariants> & {
    /** Text the code encodes, usually a URL. */
    value: string;
    /** Error correction level: L ~7%, M ~15%, Q ~25%, H ~30%. Default M. */
    ecc?: QrCodeEcc;
    /** Mark centered over the code (use `Q` or `H` for anything large). */
    icon?: React.ReactNode;
  };

function QrCode({
  className,
  size,
  value,
  ecc = 'M',
  icon,
  'aria-label': ariaLabel = 'QR code',
  ...props
}: QrCodeProps) {
  const matrix = React.useMemo<QrCodeMatrix | null>(() => {
    try {
      return buildQrMatrix(value, ecc);
    } catch {
      // Value longer than the largest code can hold: render an empty box.
      return null;
    }
  }, [value, ecc]);
  const span = matrix ? matrix.size + QR_QUIET_ZONE * 2 : 0;

  return (
    <div
      data-slot="qr-code"
      data-ecc={ecc}
      data-modules={matrix?.modules}
      role="img"
      aria-label={ariaLabel}
      className={cn(qrCodeVariants({ size }), className)}
      {...props}
    >
      {matrix ? (
        <svg
          aria-hidden="true"
          className="size-full"
          shapeRendering="crispEdges"
          viewBox={`${-QR_QUIET_ZONE} ${-QR_QUIET_ZONE} ${span} ${span}`}
        >
          <path d={matrix.path} fill="currentColor" />
        </svg>
      ) : null}
      {icon ? (
        <span
          data-slot="qr-code-icon"
          className="absolute inset-0 m-auto flex size-1/5 items-center justify-center rounded-md bg-background [&_svg]:size-full"
        >
          {icon}
        </span>
      ) : null}
    </div>
  );
}

export { QrCode, qrCodeVariants };
