import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { QrCode } from './qr-code';

const URL_VALUE = 'https://pocketbook.example/link/K7Q2-M9XD';

@Component({
  standalone: true,
  imports: [QrCode],
  template: `
    <gr-qr-code id="plain" [value]="value" />
    <gr-qr-code id="named" [value]="value" aria-label="Pairing code" />
    <gr-qr-code id="q" [value]="value" ecc="Q" size="lg" />
    <gr-qr-code id="h" [value]="value" ecc="H" size="sm" />
    <gr-qr-code id="logo" [value]="value"
      ><svg data-testid="logo"></svg
    ></gr-qr-code>
    <gr-qr-code id="long" [value]="long" />
  `,
})
class Host {
  value = URL_VALUE;
  long = 'x'.repeat(8000);
}

describe('QrCode', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }
  const byId = (root: HTMLElement, id: string) =>
    root.querySelector(`#${id}`) as HTMLElement;

  it('is an image with a default accessible name', () => {
    const el = byId(render(), 'plain');
    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('aria-label')).toBe('QR code');
  });

  it('takes a custom accessible name', () => {
    expect(byId(render(), 'named').getAttribute('aria-label')).toBe(
      'Pairing code',
    );
  });

  it('draws one path in currentColor with a four module quiet zone', () => {
    const el = byId(render(), 'plain');
    expect(el.querySelectorAll('path')).toHaveLength(1);
    expect(el.querySelector('path')?.getAttribute('fill')).toBe('currentColor');
    // Same matrix as React: 29 modules + 2 * 4 quiet zone = 37.
    expect(el.querySelector('svg')?.getAttribute('viewBox')).toBe(
      '-4 -4 37 37',
    );
    expect(el.getAttribute('data-modules')).toBe('419');
  });

  it('colors from tokens only', () => {
    const el = byId(render(), 'plain');
    expect(el.classList).toContain('bg-gray-50');
    expect(el.classList).toContain('text-gray-950');
  });

  it('grows with the error correction level and maps size to a class', () => {
    const root = render();
    expect(byId(root, 'q').querySelector('svg')?.getAttribute('viewBox')).toBe(
      '-4 -4 41 41',
    );
    expect(byId(root, 'h').querySelector('svg')?.getAttribute('viewBox')).toBe(
      '-4 -4 45 45',
    );
    expect(byId(root, 'q').classList).toContain('size-64');
    expect(byId(root, 'h').classList).toContain('size-32');
    expect(byId(root, 'plain').classList).toContain('size-48');
  });

  it('projects a centered mark', () => {
    const root = render();
    expect(
      byId(root, 'logo').querySelector('[data-testid="logo"]'),
    ).not.toBeNull();
  });

  it('renders an empty box instead of throwing when the value cannot fit', () => {
    expect(byId(render(), 'long').querySelector('path')).toBeNull();
  });
});
