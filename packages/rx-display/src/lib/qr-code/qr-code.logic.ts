import { encode } from 'uqr';

/** Error correction level: L ~7%, M ~15%, Q ~25%, H ~30% recoverable. */
export type QrCodeEcc = 'L' | 'M' | 'Q' | 'H';

export interface QrCodeMatrix {
  /** Modules per side (quiet zone not included). */
  size: number;
  /** Number of dark modules. */
  modules: number;
  /** One SVG path covering every dark module, in module units. */
  path: string;
}

/**
 * Quiet zone, in modules, kept clear on every side. The QR specification asks
 * for four; scanners lose the code below that.
 */
export const QR_QUIET_ZONE = 4;

/**
 * Encode `value` with `uqr` and fold the dark modules into a single path:
 * horizontal runs of adjacent modules become one `h` segment each, which keeps
 * the markup small and avoids hairline gaps between neighbouring squares.
 *
 * Mirrors `packages/ng-display/src/lib/qr-code/qr-code.logic.ts`; both
 * editions must produce the same matrix and path for the same input.
 */
export function buildQrMatrix(
  value: string,
  ecc: QrCodeEcc = 'M',
): QrCodeMatrix {
  const { data, size } = encode(value, { ecc, border: 0 });
  let modules = 0;
  let path = '';
  for (let y = 0; y < size; y++) {
    let x = 0;
    while (x < size) {
      if (!data[y][x]) {
        x++;
        continue;
      }
      const start = x;
      while (x < size && data[y][x]) x++;
      modules += x - start;
      path += `M${start} ${y}h${x - start}v1h-${x - start}z`;
    }
  }
  return { size, modules, path };
}
