import { describe, expect, it } from 'vitest';

import { safeHttpUrl } from './url';

describe('safeHttpUrl', () => {
  describe('rejects', () => {
    it.each([
      ['javascript scheme', 'javascript:alert(1)'],
      ['javascript with mixed case', 'JaVaScRiPt:alert(1)'],
      ['javascript with leading whitespace', '  javascript:alert(1)'],
      ['javascript with embedded newline', 'java\nscript:alert(1)'],
      ['data scheme', 'data:text/html,<script>alert(1)</script>'],
      ['blob scheme', 'blob:https://example.com/uuid'],
      ['vbscript scheme', 'vbscript:msgbox(1)'],
      ['file scheme', 'file:///etc/passwd'],
      ['absolute path (same origin)', '/admin'],
      ['protocol-relative', '//evil.example/x'],
      ['bare relative path', 'settings/tokens'],
      ['empty string', ''],
      ['not a url', 'nonsense'],
    ])('%s', (_label, input) => {
      expect(safeHttpUrl(input)).toBeUndefined();
    });

    it('null and undefined', () => {
      expect(safeHttpUrl(null)).toBeUndefined();
      expect(safeHttpUrl(undefined)).toBeUndefined();
    });
  });

  describe('accepts', () => {
    it('https urls', () => {
      expect(safeHttpUrl('https://example.com/a?b=1#c')).toBe(
        'https://example.com/a?b=1#c',
      );
    });

    it('http urls', () => {
      expect(safeHttpUrl('http://example.com/')).toBe('http://example.com/');
    });

    it('uppercase schemes, normalized', () => {
      expect(safeHttpUrl('HTTPS://Example.com')).toBe('https://example.com/');
    });

    it('urls with ports and credentials-free authority', () => {
      expect(safeHttpUrl('http://localhost:3000/preview')).toBe(
        'http://localhost:3000/preview',
      );
    });
  });
});
