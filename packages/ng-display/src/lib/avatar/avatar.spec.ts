import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { Avatar, AvatarFallback, AvatarImage } from './avatar';

@Component({
  standalone: true,
  imports: [Avatar, AvatarImage, AvatarFallback],
  template: `
    <gr-avatar [size]="size">
      <gr-avatar-image [src]="src" alt="me" />
      <gr-avatar-fallback>CN</gr-avatar-fallback>
    </gr-avatar>
  `,
})
class Host {
  size: 'sm' | 'default' | 'lg' = 'lg';
  src: string | undefined = undefined;
}

describe('Avatar', () => {
  function render() {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return fixture;
  }

  it('renders the root with size propagated via data-size', () => {
    const fixture = render();
    const root = fixture.nativeElement.querySelector(
      '[data-slot="avatar"]',
    ) as HTMLElement;
    expect(root).not.toBeNull();
    expect(root.getAttribute('data-size')).toBe('lg');
    expect(root.className).toContain('rounded-full');
  });

  it('shows the fallback when there is no image source', () => {
    const fixture = render();
    const fallback = fixture.nativeElement.querySelector(
      '[data-slot="avatar-fallback"]',
    ) as HTMLElement;
    expect(fallback).not.toBeNull();
    expect(fallback.textContent?.trim()).toBe('CN');
  });

  it('renders an <img> once a source is provided', () => {
    const fixture = render();
    fixture.componentInstance.src = 'https://example.com/a.png';
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector(
      '[data-slot="avatar-image"]',
    ) as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.getAttribute('alt')).toBe('me');
  });
});
