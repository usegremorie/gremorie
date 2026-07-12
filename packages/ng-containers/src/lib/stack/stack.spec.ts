import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { Stack } from './stack';

@Component({
  standalone: true,
  imports: [Stack],
  template: `<gr-stack [gap]="gap" [align]="align" [justify]="justify"
    ><span>child</span></gr-stack
  >`,
})
class Host {
  gap = 'md';
  align = 'stretch';
  justify = 'start';
}

describe('Stack', () => {
  function render() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector(
      '[data-slot="stack"]',
    ) as HTMLElement;
    return { fixture, el };
  }

  it('mounts as a flex column with the default gap', () => {
    const { el } = render();
    expect(el).toBeTruthy();
    expect(el.className).toContain('flex');
    expect(el.className).toContain('flex-col');
    expect(el.className).toContain('gap-4'); // gap="md"
    expect(el.textContent).toContain('child');
  });

  it('reflects gap / align / justify inputs into variant classes', () => {
    const { fixture, el } = render();
    fixture.componentInstance.gap = 'xl';
    fixture.componentInstance.align = 'center';
    fixture.componentInstance.justify = 'between';
    fixture.detectChanges();
    expect(el.className).toContain('gap-8');
    expect(el.className).toContain('items-center');
    expect(el.className).toContain('justify-between');
  });
});
