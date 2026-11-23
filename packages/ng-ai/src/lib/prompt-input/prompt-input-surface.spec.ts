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

  it('keeps the translucent input fill in dark mode', () => {
    expect(classes()).toContain('dark:bg-input/50');
  });
});
