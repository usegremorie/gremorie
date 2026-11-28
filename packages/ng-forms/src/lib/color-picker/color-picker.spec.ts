import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerChannelInput,
  ColorPickerChannelSlider,
  ColorPickerContent,
  ColorPickerEyeDropperTrigger,
  ColorPickerSaveTrigger,
  ColorPickerSavedColors,
  ColorPickerSwatchGroup,
  ColorPickerSwatchTrigger,
  ColorPickerTrigger,
  ColorPickerValueText,
  type ColorFormat,
  type ColorPickerValueChangeDetails,
} from './color-picker';

const PARTS = [
  ColorPicker,
  ColorPickerArea,
  ColorPickerChannelInput,
  ColorPickerChannelSlider,
  ColorPickerContent,
  ColorPickerEyeDropperTrigger,
  ColorPickerSaveTrigger,
  ColorPickerSavedColors,
  ColorPickerSwatchGroup,
  ColorPickerSwatchTrigger,
  ColorPickerValueText,
];

@Component({
  standalone: true,
  imports: [...PARTS],
  template: `
    <gr-color-picker
      inline
      [(value)]="value"
      [format]="format()"
      [disabled]="disabled()"
      [name]="name()"
      [(savedColors)]="saved"
      (valueChangeEnd)="ends.push($event)"
    >
      <gr-color-picker-content>
        <gr-color-picker-area />
        <gr-color-picker-channel-slider channel="hue" />
        <gr-color-picker-channel-slider channel="alpha" />
        <input gr-color-picker-channel-input channel="hex" />
        <button gr-color-picker-eye-dropper-trigger aria-label="Eye dropper"></button>
        <gr-color-picker-swatch-group>
          <button gr-color-picker-swatch-trigger value="#ff0000" aria-label="Red"></button>
        </gr-color-picker-swatch-group>
        <gr-color-picker-saved-colors>
          <button gr-color-picker-save-trigger aria-label="Save color"></button>
        </gr-color-picker-saved-colors>
        <gr-color-picker-value-text />
      </gr-color-picker-content>
    </gr-color-picker>
  `,
})
class Host {
  value = signal('oklch(0.7 0.1 200)');
  format = signal<ColorFormat>('oklch');
  disabled = signal(false);
  name = signal('');
  saved = signal<string[]>([]);
  ends: ColorPickerValueChangeDetails[] = [];
}

@Component({
  standalone: true,
  imports: [ColorPicker, ColorPickerChannelSlider, ColorPickerValueText],
  template: `
    <gr-color-picker inline defaultValue="oklch(0.7 0.1 200)">
      <gr-color-picker-channel-slider channel="hue" />
      <gr-color-picker-value-text />
    </gr-color-picker>
  `,
})
class UncontrolledHost {}

@Component({
  standalone: true,
  imports: [ColorPicker, ColorPickerValueText, ReactiveFormsModule],
  template: `
    <gr-color-picker inline [formControl]="control" format="hex">
      <gr-color-picker-value-text />
    </gr-color-picker>
  `,
})
class FormHost {
  control = new FormControl('#3366cc');
}

@Component({
  standalone: true,
  imports: [
    ColorPicker,
    ColorPickerTrigger,
    ColorPickerContent,
    ColorPickerChannelSlider,
    BrnPopoverContent,
  ],
  template: `
    <gr-color-picker defaultValue="#3366cc">
      <!-- The default label is under test. -->
      <!-- eslint-disable-next-line @angular-eslint/template/elements-content -->
      <button gr-color-picker-trigger></button>
      <ng-template brnPopoverContent>
        <gr-color-picker-content>
          <gr-color-picker-channel-slider channel="hue" />
        </gr-color-picker-content>
      </ng-template>
    </gr-color-picker>
  `,
})
class PopoverHost {}

@Component({
  standalone: true,
  imports: [...PARTS],
  template: `
    <gr-color-picker inline [value]="value()" (valueChange)="onChange($event)">
      <gr-color-picker-content>
        <gr-color-picker-channel-slider channel="chroma" />
        <input gr-color-picker-channel-input />
      </gr-color-picker-content>
    </gr-color-picker>
  `,
})
class ClampHost {
  // Caps chroma at 0.1; the value is already there, so it hands back the same
  // string and the binding never changes.
  value = signal('oklch(0.7 0.1 200)');
  onChange(text: string) {
    const c = Number(/oklch\([\d.]+ ([\d.]+)/.exec(text)?.[1] ?? 0);
    this.value.set(`oklch(0.7 ${Math.min(c, 0.1)} 200)`);
  }
}

beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = (() =>
    null) as unknown as HTMLCanvasElement['getContext'];
});

afterEach(() => {
  delete (window as { EyeDropper?: unknown }).EyeDropper;
  document
    .querySelectorAll('.cdk-overlay-container')
    .forEach((el) => (el.innerHTML = ''));
});

function render() {
  TestBed.configureTestingModule({ imports: [Host] });
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  return fixture;
}

const q = <T extends Element>(root: ParentNode, sel: string) =>
  root.querySelector<T>(sel) as T;
const key = (el: Element, k: string, init: KeyboardEventInit = {}) =>
  el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...init }));
const typeIn = (input: HTMLInputElement, text: string) => {
  input.value = text;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

describe('ColorPicker (Angular)', () => {
  it('prints the value in the format', () => {
    const fixture = render();
    const el = fixture.nativeElement as HTMLElement;
    expect(q(el, '[data-slot="color-picker-value-text"]').textContent?.trim()).toBe(
      'oklch(0.7 0.1 200)',
    );
    fixture.componentInstance.value.set('#3366cc');
    fixture.componentInstance.format.set('hex');
    fixture.detectChanges();
    expect(q(el, '[data-slot="color-picker-value-text"]').textContent?.trim()).toBe(
      '#3366cc',
    );
  });

  it('steps a channel with the keyboard, two-way', () => {
    const fixture = render();
    const el = fixture.nativeElement as HTMLElement;
    const hue = q<HTMLElement>(el, '[role="slider"][aria-label="Hue"]');
    expect(hue.getAttribute('aria-valuetext')).toBe('Hue 200 degrees');
    key(hue, 'ArrowRight');
    fixture.detectChanges();
    expect(hue.getAttribute('aria-valuenow')).toBe('201');
    expect(fixture.componentInstance.value()).toBe('oklch(0.7 0.1 201)');
    key(hue, 'ArrowLeft', { shiftKey: true });
    fixture.detectChanges();
    expect(hue.getAttribute('aria-valuenow')).toBe('191');
    expect(fixture.componentInstance.ends).toHaveLength(2);
  });

  it('moves the area thumb on both axes', () => {
    const fixture = render();
    const el = fixture.nativeElement as HTMLElement;
    const thumb = q<HTMLElement>(el, '[data-slot="color-picker-area-thumb"]');
    key(thumb, 'ArrowUp');
    key(thumb, 'ArrowRight');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('oklch(0.71 0.105 200)');
  });

  it('fires valueChangeEnd only when a drag ends', () => {
    const fixture = render();
    const el = fixture.nativeElement as HTMLElement;
    const track = q<HTMLElement>(
      el,
      '[data-slot="color-picker-channel-slider"][data-channel="hue"]',
    );
    track.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 360, height: 12, right: 360, bottom: 12 }) as DOMRect;
    track.setPointerCapture = () => undefined;
    const fire = (type: string, x: number) =>
      track.dispatchEvent(
        new MouseEvent(type, { bubbles: true, clientX: x, clientY: 6, button: 0 }),
      );
    fire('pointerdown', 90);
    fire('pointermove', 180);
    fixture.detectChanges();
    expect(fixture.componentInstance.ends).toHaveLength(0);
    fire('pointerup', 180);
    fixture.detectChanges();
    expect(fixture.componentInstance.ends).toHaveLength(1);
    expect(fixture.componentInstance.value()).toBe('oklch(0.7 0.1 180)');
  });

  it('keeps invalid text until blur, then restores the last valid value', () => {
    const fixture = render();
    fixture.componentInstance.value.set('#3366cc');
    fixture.detectChanges();
    const input = q<HTMLInputElement>(
      fixture.nativeElement,
      '[data-slot="color-picker-channel-input"]',
    );
    expect(input.value).toBe('#3366cc');
    input.focus();
    typeIn(input, 'nope');
    fixture.detectChanges();
    expect(input.value).toBe('nope');
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(input.value).toBe('#3366cc');
    expect(fixture.componentInstance.value()).toBe('#3366cc');
  });

  it('accepts a valid colour typed in the field on Enter', () => {
    const fixture = render();
    fixture.componentInstance.format.set('hex');
    fixture.detectChanges();
    const input = q<HTMLInputElement>(
      fixture.nativeElement,
      '[data-slot="color-picker-channel-input"]',
    );
    typeIn(input, '#ff0000');
    key(input, 'Enter');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('#ff0000');
  });

  it('picks a swatch', () => {
    const fixture = render();
    fixture.componentInstance.format.set('hex');
    fixture.detectChanges();
    const swatch = q<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-slot="color-picker-swatch-trigger"]',
    );
    swatch.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('#ff0000');
    expect(swatch.getAttribute('aria-pressed')).toBe('true');
  });

  it('saves the current colour and removes it with Delete', () => {
    const fixture = render();
    fixture.componentInstance.value.set('#3366cc');
    fixture.componentInstance.format.set('hex');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    q<HTMLButtonElement>(el, '[data-slot="color-picker-save-trigger"]').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.saved()).toEqual(['#3366cc']);
    const saved = q<HTMLButtonElement>(
      el,
      '[data-slot="color-picker-saved-colors"] [data-slot="color-picker-swatch-trigger"]',
    );
    expect(saved.getAttribute('aria-label')).toBe('#3366cc');
    key(saved, 'Delete');
    fixture.detectChanges();
    expect(fixture.componentInstance.saved()).toEqual([]);
  });

  it('hides the eye dropper where the browser lacks it', () => {
    let fixture = render();
    const sel = '[data-slot="color-picker-eye-dropper-trigger"]';
    expect(q<HTMLElement>(fixture.nativeElement, sel).hidden).toBe(true);
    fixture.destroy();
    TestBed.resetTestingModule();
    (window as { EyeDropper?: unknown }).EyeDropper = class {};
    fixture = render();
    expect(q<HTMLElement>(fixture.nativeElement, sel).hidden).toBe(false);
  });

  it('submits through a hidden input when named', () => {
    const fixture = render();
    fixture.componentInstance.name.set('brand');
    fixture.componentInstance.value.set('#3366cc');
    fixture.componentInstance.format.set('hex');
    fixture.detectChanges();
    const hidden = q<HTMLInputElement>(
      fixture.nativeElement,
      'input[type="hidden"][name="brand"]',
    );
    expect(hidden.value).toBe('#3366cc');
  });

  it('ignores input when disabled', () => {
    const fixture = render();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const hue = q<HTMLElement>(fixture.nativeElement, '[role="slider"][aria-label="Hue"]');
    expect(hue.getAttribute('tabindex')).toBe('-1');
    key(hue, 'ArrowRight');
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('oklch(0.7 0.1 200)');
  });

  it('paints the area in the colour\'s hue', () => {
    let data: Uint8ClampedArray | undefined;
    HTMLCanvasElement.prototype.getContext = (() => ({
      createImageData: (w: number, h: number) => ({
        data: new Uint8ClampedArray(w * h * 4),
        width: w,
        height: h,
      }),
      putImageData: (img: { data: Uint8ClampedArray }) => {
        data = img.data;
      },
    })) as unknown as HTMLCanvasElement['getContext'];
    const fixture = render();
    fixture.componentInstance.value.set('oklch(0.6 0.2 264)');
    fixture.detectChanges();
    TestBed.tick();
    const i = (32 * 96 + 32) * 4;
    expect(data![i + 2]).toBeGreaterThan(data![i]);
  });

  it('keeps swatch triggers as tall as their swatch', () => {
    const fixture = render();
    const swatch = q(fixture.nativeElement, '[data-slot="color-picker-swatch-trigger"]');
    expect(swatch.className).toContain('inline-flex');
  });

  it('shows the value a controlling parent clamps back to, even unchanged', () => {
    TestBed.configureTestingModule({ imports: [ClampHost] });
    const fixture = TestBed.createComponent(ClampHost);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const chroma = q<HTMLElement>(el, '[role="slider"][aria-label="Chroma"]');
    key(chroma, 'End');
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
    expect(chroma.getAttribute('aria-valuenow')).toBe('0.1');
    expect(q<HTMLInputElement>(el, '[data-slot="color-picker-channel-input"]').value).toBe(
      'oklch(0.7 0.1 200)',
    );
  });

  it('follows the parent back to a value it emitted before', () => {
    const fixture = render();
    const el = fixture.nativeElement as HTMLElement;
    const text = () => q(el, '[data-slot="color-picker-value-text"]').textContent?.trim();
    key(q(el, '[role="slider"][aria-label="Hue"]'), 'ArrowRight'); // A = hue 201
    fixture.detectChanges();
    TestBed.tick();
    expect(text()).toBe('oklch(0.7 0.1 201)');
    fixture.componentInstance.value.set('oklch(0.7 0.1 50)'); // B
    fixture.detectChanges();
    expect(text()).toBe('oklch(0.7 0.1 50)');
    fixture.componentInstance.value.set('oklch(0.7 0.1 201)'); // back to A
    fixture.detectChanges();
    expect(text()).toBe('oklch(0.7 0.1 201)');
  });

  it('gives the area thumb the numbers of its y channel', () => {
    const fixture = render();
    const thumb = q<HTMLElement>(
      fixture.nativeElement,
      '[data-slot="color-picker-area-thumb"]',
    );
    expect(thumb.getAttribute('aria-valuenow')).toBe('0.7');
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('1');
    expect(thumb.getAttribute('aria-valuetext')).toBe('Chroma 0.1, Lightness 70%');
  });

  it('works without a bound value, from defaultValue', () => {
    TestBed.configureTestingModule({ imports: [UncontrolledHost] });
    const fixture = TestBed.createComponent(UncontrolledHost);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    key(q(el, '[role="slider"][aria-label="Hue"]'), 'ArrowRight');
    fixture.detectChanges();
    TestBed.tick();
    fixture.detectChanges();
    expect(q(el, '[data-slot="color-picker-value-text"]').textContent?.trim()).toBe(
      'oklch(0.7 0.1 201)',
    );
  });

  it('works as a form control', () => {
    TestBed.configureTestingModule({ imports: [FormHost] });
    const fixture = TestBed.createComponent(FormHost);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(q(el, '[data-slot="color-picker-value-text"]').textContent?.trim()).toBe(
      '#3366cc',
    );
    fixture.componentInstance.control.setValue('#00ff00');
    fixture.detectChanges();
    expect(q(el, '[data-slot="color-picker-value-text"]').textContent?.trim()).toBe(
      '#00ff00',
    );
  });

  it('opens the panel from the trigger in popover mode', () => {
    TestBed.configureTestingModule({ imports: [PopoverHost] });
    const fixture = TestBed.createComponent(PopoverHost);
    fixture.detectChanges();
    expect(document.querySelector('[role="slider"]')).toBeNull();
    const trigger = q<HTMLButtonElement>(
      fixture.nativeElement,
      '[data-slot="color-picker-trigger"]',
    );
    expect(trigger.getAttribute('aria-label')).toBe('Pick a color');
    trigger.click();
    fixture.detectChanges();
    expect(document.querySelector('[role="slider"]')).not.toBeNull();
  });
});
