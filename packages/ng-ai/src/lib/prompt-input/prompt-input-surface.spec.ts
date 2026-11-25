import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PromptInput } from './prompt-input';

@Component({
  standalone: true,
  imports: [PromptInput],
  template: `<prompt-input />`,
})
class Host {}

describe('PromptInput surface', () => {
  function classes(): string[] {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('prompt-input') as HTMLElement;
    return host.className.split(/\s+/);
  }

  it('sits above the page in light mode: --card fill, not the sunken input fill', () => {
    const list = classes();
    expect(list).toContain('bg-card');
    expect(list).not.toContain('bg-input/50');
  });

  it('uses one token per part: no dark: swap of fill or contour', () => {
    expect(classes().filter((c) => /^dark:(bg|ring)-/.test(c))).toEqual([]);
  });

  it('carries the border contour, same as Card: ring-1 ring-border', () => {
    const list = classes();
    expect(list).toContain('ring-1');
    expect(list).toContain('ring-border');
    expect(list.some((c) => c.startsWith('ring-foreground'))).toBe(false);
  });
});
