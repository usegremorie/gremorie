import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Card, CardContent, CardHeader } from './card';

@Component({
  standalone: true,
  imports: [Card, CardHeader, CardContent],
  template: `
    <gr-card class="gap-2 py-4">
      <gr-card-header class="px-4">Header</gr-card-header>
      <gr-card-content class="px-4">Body</gr-card-content>
    </gr-card>
  `,
})
class Host {}

describe('Card', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('lets a consumer class override the built-in spacing (cn merge)', () => {
    const host = render();
    const card = host.querySelector('[data-slot="card"]')!;
    expect(card.className).toContain('gap-2');
    expect(card.className).not.toContain('gap-6');
    expect(card.className).not.toContain('py-6');
    const header = host.querySelector('[data-slot="card-header"]')!;
    expect(header.className).toContain('px-4');
    expect(header.className).not.toContain('px-6');
    const content = host.querySelector('[data-slot="card-content"]')!;
    expect(content.className).toBe('px-4');
  });
});
