import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// The semantic tokens build on --color-gray-*. That scale is meant to be the
// shadcn/Tailwind Neutral ramp; --color-neutral-* is the canonical copy of it.
// Every step must match, so the surfaces read the same as the reference.
const SOURCE = JSON.parse(
  readFileSync(join(__dirname, '../tokens/primitive/color.json'), 'utf8'),
);
const STEPS = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
];

describe('gray scale', () => {
  it.each(STEPS)('gray-%s equals neutral', (step) => {
    const gray = SOURCE.color.gray[step].$value.components;
    const neutral = SOURCE.color.neutral[step].$value.components;
    expect(gray).toEqual(neutral);
  });
});
