import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { Image } from './image';

@Component({
  standalone: true,
  imports: [Image],
  template: `<image
    [base64]="b64"
    mediaType="image/png"
    alt="pixel"
    class="size-4"
  />`,
})
class Host {
  readonly b64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgYGAAAAAEAAH2FzhVAAAAAElFTkSuQmCC';
}

describe('Image', () => {
  it('renders an img with a base64 data URL src', () => {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toContain('data:image/png;base64,');
    expect(img.getAttribute('alt')).toBe('pixel');
    expect(img.className).toContain('rounded-md');
    expect(img.className).toContain('size-4');
  });
});
