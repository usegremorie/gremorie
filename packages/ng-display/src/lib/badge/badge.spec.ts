import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Badge } from './badge';

@Component({
  standalone: true,
  imports: [Badge],
  template: `
    <gr-badge variant="outline">Outline</gr-badge>
    <gr-badge class="bg-muted">Custom</gr-badge>
  `,
})
class Host {}

describe('Badge', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('lets the outline variant border win over the base transparent border', () => {
    const badge = render().querySelectorAll('[data-slot="badge"]')[0];
    expect(badge.classList).toContain('border-border');
    expect(badge.classList).not.toContain('border-transparent');
  });

  it('merges a consumer class over the variant classes', () => {
    const badge = render().querySelectorAll('[data-slot="badge"]')[1];
    expect(badge.classList).toContain('bg-muted');
    expect(badge.classList).not.toContain('bg-primary');
  });
});
