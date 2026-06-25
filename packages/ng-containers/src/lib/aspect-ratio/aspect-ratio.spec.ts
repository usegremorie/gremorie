import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { AspectRatio } from './aspect-ratio';

@Component({
  standalone: true,
  imports: [AspectRatio],
  template: `<gn-aspect-ratio [ratio]="ratio"><img alt="" /></gn-aspect-ratio>`,
})
class Host {
  ratio = 16 / 9;
}

describe('AspectRatio', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '[data-slot="aspect-ratio"]',
    ) as HTMLElement;
    return { fixture, el };
  }

  it('mounts and projects its child', () => {
    const { el } = render();
    expect(el).toBeTruthy();
    expect(el.querySelector('img')).toBeTruthy();
  });

  it('applies the ratio via the CSS aspect-ratio property', () => {
    const { fixture, el } = render();
    // 16 / 9 ≈ 1.777…
    expect(el.style.aspectRatio).toContain('1.7');

    fixture.componentInstance.ratio = 1;
    fixture.detectChanges();
    expect(el.style.aspectRatio).toBe('1');
  });
});
