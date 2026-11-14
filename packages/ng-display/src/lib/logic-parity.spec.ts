import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Drift gate for the pure logic shared by the two editions.
 *
 * MediaRangePlayer and WordTimeline keep their framework-free logic in a
 * `*.logic.ts` file on each side. The Angular copy must match the React one
 * line for line (below its provenance header), so a fix landed in one edition
 * cannot silently skip the other.
 */
const PAIRS = [
  'media-range-player/media-range-player.logic.ts',
  'word-timeline/word-timeline.logic.ts',
];

const body = (path: string) =>
  readFileSync(path, 'utf8')
    .replace(/\r\n/g, '\n')
    // Drop the leading comment block + blank line that records provenance.
    .replace(/^(\/\/[^\n]*\n)+\n/, '');

describe('logic parity with @gremorie/rx-display', () => {
  for (const rel of PAIRS) {
    it(`${rel} matches the React edition`, () => {
      const ng = resolve(__dirname, rel);
      const rx = resolve(__dirname, '../../../rx-display/src/lib', rel);
      expect(body(ng)).toBe(body(rx));
    });
  }
});
