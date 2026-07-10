import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MessageResponse } from './message-response';

@Component({
  standalone: true,
  imports: [MessageResponse],
  template: `<message-response [text]="text()" />`,
})
class Host {
  readonly text = signal('');
}

function render(markdown: string): HTMLElement {
  const fixture = TestBed.createComponent(Host);
  fixture.componentInstance.text.set(markdown);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('MessageResponse', () => {
  describe('sanitization of untrusted model output', () => {
    it('strips <script> tags', () => {
      const el = render('Hello\n\n<script>globalThis.__pwned = true;</script>');
      expect(el.querySelector('script')).toBeNull();
      expect(el.innerHTML).not.toContain('__pwned');
    });

    it('strips event-handler attributes', () => {
      const el = render('<img src="x" onerror="globalThis.__pwned = true">');
      // `<img>` and `src` survive the allowlist; only the handler is dropped.
      expect(el.innerHTML).not.toContain('onerror');
      expect(el.querySelector('img')?.hasAttribute('onerror') ?? false).toBe(
        false,
      );
    });

    it('neutralizes javascript: hrefs', () => {
      const el = render('[click](javascript:globalThis.__pwned=true)');
      const href = el.querySelector('a')?.getAttribute('href') ?? '';
      expect(href.startsWith('javascript:')).toBe(false);
    });

    it('strips <iframe>', () => {
      const el = render('<iframe src="https://evil.example"></iframe>');
      expect(el.querySelector('iframe')).toBeNull();
    });

    it('strips <style> and its contents', () => {
      const el = render('<style>body{display:none}</style>text');
      expect(el.querySelector('style')).toBeNull();
      expect(el.innerHTML).not.toContain('display:none');
    });

    // Regression guard for the fix. If someone re-wraps the parser output in
    // `DomSanitizer.bypassSecurityTrustHtml()`, Angular stops sanitizing the
    // `[innerHTML]` binding and every assertion above silently passes through
    // raw markup. This asserts the payload is gone from the live DOM.
    it('does not bypass Angular sanitization', () => {
      const el = render(
        '<img src=x onerror="globalThis.__pwned=true"><script>globalThis.__pwned=true</script>',
      );
      expect(
        (globalThis as Record<string, unknown>)['__pwned'],
      ).toBeUndefined();
      expect(el.innerHTML.toLowerCase()).not.toContain('onerror');
      expect(el.innerHTML.toLowerCase()).not.toContain('<script');
    });
  });

  describe('markdown fidelity', () => {
    it('renders headings, emphasis and links', () => {
      const el = render('# Title\n\n**bold** and [link](https://example.com)');
      expect(el.querySelector('h1')?.textContent).toBe('Title');
      expect(el.querySelector('strong')?.textContent).toBe('bold');
      expect(el.querySelector('a')?.getAttribute('href')).toBe(
        'https://example.com',
      );
    });

    it('renders GFM tables', () => {
      const el = render('| a | b |\n| --- | --- |\n| 1 | 2 |');
      expect(el.querySelector('table')).not.toBeNull();
      expect(el.querySelectorAll('td').length).toBe(2);
    });

    it('keeps the language hint class on fenced code', () => {
      const el = render('```ts\nconst a = 1;\n```');
      const code = el.querySelector('pre code');
      expect(code?.className).toContain('language-ts');
    });

    // `<input>` is not on Angular's sanitizer allowlist, so the default GFM
    // checkbox would be dropped and the task marker lost entirely.
    it('preserves task-list state through sanitization', () => {
      const el = render('- [x] done\n- [ ] todo');
      expect(el.textContent).toContain('☑');
      expect(el.textContent).toContain('☐');
      expect(el.textContent).toContain('done');
      expect(el.textContent).toContain('todo');
    });

    it('renders nothing for empty text', () => {
      const el = render('');
      expect(el.querySelector('div')?.innerHTML ?? '').toBe('');
    });
  });
});
