import { describe, expect, it } from 'vitest';

import { buildQrMatrix } from './qr-code.logic';

const URL_VALUE = 'https://pocketbook.example/link/K7Q2-M9XD';

describe('buildQrMatrix', () => {
  it('encodes the pairing URL at level M as a 29 module matrix', () => {
    const matrix = buildQrMatrix(URL_VALUE);
    expect(matrix.size).toBe(29);
    expect(matrix.modules).toBe(419);
  });

  it.each([
    ['L', 29, 426],
    ['M', 29, 419],
    ['Q', 33, 551],
    ['H', 37, 674],
  ] as const)('level %s yields %i modules per side', (ecc, size, modules) => {
    const matrix = buildQrMatrix(URL_VALUE, ecc);
    expect(matrix.size).toBe(size);
    expect(matrix.modules).toBe(modules);
  });

  it('is deterministic and builds a single path', () => {
    const a = buildQrMatrix(URL_VALUE);
    const b = buildQrMatrix(URL_VALUE);
    expect(a.path).toBe(b.path);
    expect(a.path.startsWith('M')).toBe(true);
    expect(a.path.endsWith('z')).toBe(true);
  });

  it('covers exactly the dark modules with the path runs', () => {
    const { path, modules } = buildQrMatrix(URL_VALUE);
    const covered = [...path.matchAll(/h(\d+)v1/g)].reduce(
      (sum, m) => sum + Number(m[1]),
      0,
    );
    expect(covered).toBe(modules);
  });

  it('defaults to level M', () => {
    expect(buildQrMatrix(URL_VALUE).path).toBe(
      buildQrMatrix(URL_VALUE, 'M').path,
    );
  });
});
