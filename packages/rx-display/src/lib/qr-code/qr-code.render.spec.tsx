import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { QrCode } from './qr-code';

const URL_VALUE = 'https://pocketbook.example/link/K7Q2-M9XD';
const html = (el: React.ReactElement) => renderToStaticMarkup(el);

describe('QrCode', () => {
  it('is an image with a default accessible name', () => {
    const out = html(<QrCode value={URL_VALUE} />);
    expect(out).toContain('role="img"');
    expect(out).toContain('aria-label="QR code"');
  });

  it('takes a custom accessible name', () => {
    const out = html(<QrCode value={URL_VALUE} aria-label="Pairing code" />);
    expect(out).toContain('aria-label="Pairing code"');
  });

  it('draws one path in currentColor with a four module quiet zone', () => {
    const out = html(<QrCode value={URL_VALUE} />);
    expect(out.match(/<path/g)).toHaveLength(1);
    expect(out).toContain('fill="currentColor"');
    // 29 modules + 2 * 4 quiet zone = 37.
    expect(out).toContain('viewBox="-4 -4 37 37"');
    expect(out).toContain('data-modules="419"');
  });

  it('colors from tokens only', () => {
    const out = html(<QrCode value={URL_VALUE} />);
    expect(out).toContain('bg-gray-50');
    expect(out).toContain('text-gray-950');
  });

  it('grows with the error correction level', () => {
    expect(html(<QrCode value={URL_VALUE} ecc="Q" />)).toContain(
      'viewBox="-4 -4 41 41"',
    );
    expect(html(<QrCode value={URL_VALUE} ecc="H" />)).toContain(
      'viewBox="-4 -4 45 45"',
    );
  });

  it.each([
    ['sm', 'size-32'],
    ['md', 'size-48'],
    ['lg', 'size-64'],
  ] as const)('maps size %s to %s', (size, cls) => {
    expect(html(<QrCode value={URL_VALUE} size={size} />)).toContain(cls);
  });

  it('centers an icon only when one is given', () => {
    expect(html(<QrCode value={URL_VALUE} />)).not.toContain('qr-code-icon');
    expect(
      html(<QrCode value={URL_VALUE} icon={<svg data-testid="logo" />} />),
    ).toContain('data-slot="qr-code-icon"');
  });

  it('renders an empty box instead of throwing when the value cannot fit', () => {
    const out = html(<QrCode value={'x'.repeat(8000)} />);
    expect(out).not.toContain('<path');
  });
});
