// @vitest-environment jsdom
import { act, useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
  type ColorPickerProps,
} from './color-picker';

(
  globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

let host: HTMLDivElement;
let root: Root;

beforeEach(() => {
  // jsdom has no canvas; the area paints nothing.
  HTMLCanvasElement.prototype.getContext = (() =>
    null) as unknown as HTMLCanvasElement['getContext'];
  host = document.createElement('div');
  document.body.append(host);
  root = createRoot(host);
});

afterEach(() => {
  act(() => root.unmount());
  document.body.innerHTML = '';
  delete (window as { EyeDropper?: unknown }).EyeDropper;
});

function Picker(props: ColorPickerProps) {
  return (
    <ColorPicker inline {...props}>
      <ColorPickerContent>
        <ColorPickerArea />
        <ColorPickerChannelSlider channel="hue" />
        <ColorPickerChannelSlider channel="alpha" />
        <ColorPickerChannelInput channel="hex" />
        <ColorPickerEyeDropperTrigger />
        <ColorPickerSwatchGroup>
          <ColorPickerSwatchTrigger value="#ff0000" />
        </ColorPickerSwatchGroup>
        <ColorPickerSavedColors>
          <ColorPickerSaveTrigger />
        </ColorPickerSavedColors>
        <ColorPickerValueText />
      </ColorPickerContent>
    </ColorPicker>
  );
}

const render = (props: ColorPickerProps = {}) =>
  act(() => root.render(<Picker {...props} />));

const q = <T extends Element>(sel: string) =>
  document.querySelector<T>(sel) as T;
const slider = (name: string) =>
  q<HTMLElement>(`[role="slider"][aria-label="${name}"]`);
const key = (el: Element, k: string, init: KeyboardEventInit = {}) =>
  act(() => {
    el.dispatchEvent(
      new KeyboardEvent('keydown', { key: k, bubbles: true, ...init }),
    );
  });
const valueText = () => q('[data-slot="color-picker-value-text"]').textContent;

describe('ColorPicker', () => {
  it('starts from defaultValue and prints it in the format', () => {
    render({ defaultValue: '#3366cc', defaultFormat: 'hex' });
    expect(valueText()).toBe('#3366cc');
  });

  it('defaults to oklch output', () => {
    render({ defaultValue: 'oklch(0.7 0.1 200)' });
    expect(valueText()).toBe('oklch(0.7 0.1 200)');
  });

  it('steps a channel with the keyboard and reports it', () => {
    const onValueChange = vi.fn();
    const onValueChangeEnd = vi.fn();
    render({
      defaultValue: 'oklch(0.7 0.1 200)',
      onValueChange,
      onValueChangeEnd,
    });
    const hue = slider('Hue');
    expect(hue.getAttribute('aria-valuetext')).toBe('Hue 200 degrees');
    key(hue, 'ArrowRight');
    expect(hue.getAttribute('aria-valuenow')).toBe('201');
    expect(onValueChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ valueAsString: 'oklch(0.7 0.1 201)' }),
    );
    key(hue, 'ArrowLeft', { shiftKey: true });
    expect(hue.getAttribute('aria-valuenow')).toBe('191');
    expect(onValueChangeEnd).toHaveBeenCalledTimes(2);
  });

  it('moves the area thumb on both axes', () => {
    render({ defaultValue: 'oklch(0.7 0.1 200)' });
    const thumb = q<HTMLElement>('[data-slot="color-picker-area-thumb"]');
    key(thumb, 'ArrowUp');
    key(thumb, 'ArrowRight');
    expect(valueText()).toBe('oklch(0.71 0.105 200)');
  });

  it('fires onValueChangeEnd only when a drag ends', () => {
    const onValueChange = vi.fn();
    const onValueChangeEnd = vi.fn();
    render({
      defaultValue: 'oklch(0.7 0.1 200)',
      onValueChange,
      onValueChangeEnd,
    });
    const track = q<HTMLElement>(
      '[data-slot="color-picker-channel-slider"][data-channel="hue"]',
    );
    track.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 360,
        height: 12,
        right: 360,
        bottom: 12,
      }) as DOMRect;
    track.setPointerCapture = () => undefined;
    const fire = (type: string, x: number) =>
      act(() => {
        track.dispatchEvent(
          new MouseEvent(type, {
            bubbles: true,
            clientX: x,
            clientY: 6,
            button: 0,
          }),
        );
      });
    fire('pointerdown', 90);
    fire('pointermove', 180);
    expect(onValueChange).toHaveBeenCalled();
    expect(onValueChangeEnd).not.toHaveBeenCalled();
    fire('pointerup', 180);
    expect(onValueChangeEnd).toHaveBeenCalledTimes(1);
    expect(slider('Hue').getAttribute('aria-valuenow')).toBe('180');
  });

  it('keeps invalid text until blur, then restores the last valid value', () => {
    const onValueChange = vi.fn();
    render({ defaultValue: '#3366cc', onValueChange });
    const input = q<HTMLInputElement>(
      '[data-slot="color-picker-channel-input"]',
    );
    expect(input.value).toBe('#3366cc');
    act(() => {
      input.focus();
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      )!.set!;
      setter.call(input, 'nope');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(input.value).toBe('nope');
    act(() => input.blur());
    expect(input.value).toBe('#3366cc');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('accepts a valid colour typed in the field on Enter', () => {
    render({ defaultValue: '#3366cc', defaultFormat: 'hex' });
    const input = q<HTMLInputElement>(
      '[data-slot="color-picker-channel-input"]',
    );
    act(() => {
      input.focus();
      const setter = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value',
      )!.set!;
      setter.call(input, '#ff0000');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    key(input, 'Enter');
    expect(valueText()).toBe('#ff0000');
  });

  it('follows a controlled value', () => {
    render({ value: '#3366cc', format: 'hex' });
    expect(valueText()).toBe('#3366cc');
    render({ value: '#00ff00', format: 'hex' });
    expect(valueText()).toBe('#00ff00');
  });

  it('picks a swatch', () => {
    render({ defaultValue: '#3366cc', defaultFormat: 'hex' });
    const swatch = q<HTMLButtonElement>(
      '[data-slot="color-picker-swatch-trigger"]',
    );
    act(() => swatch.click());
    expect(valueText()).toBe('#ff0000');
    expect(swatch.getAttribute('aria-pressed')).toBe('true');
  });

  it('saves the current colour and removes it with Delete', () => {
    const onSavedColorsChange = vi.fn();
    render({
      defaultValue: '#3366cc',
      defaultFormat: 'hex',
      onSavedColorsChange,
    });
    act(() =>
      q<HTMLButtonElement>('[data-slot="color-picker-save-trigger"]').click(),
    );
    expect(onSavedColorsChange).toHaveBeenLastCalledWith(['#3366cc']);
    const saved = q<HTMLButtonElement>(
      '[data-slot="color-picker-saved-colors"] [data-slot="color-picker-swatch-trigger"]',
    );
    expect(saved.getAttribute('aria-label')).toBe('#3366cc');
    key(saved, 'Delete');
    expect(onSavedColorsChange).toHaveBeenLastCalledWith([]);
  });

  it('shows the eye dropper only where the browser supports it', () => {
    render();
    expect(q('[data-slot="color-picker-eye-dropper-trigger"]')).toBeNull();
    act(() => root.unmount());
    (window as { EyeDropper?: unknown }).EyeDropper = class {};
    root = createRoot(host);
    render();
    expect(q('[data-slot="color-picker-eye-dropper-trigger"]')).not.toBeNull();
  });

  it('submits the value through a hidden input when named', () => {
    render({ defaultValue: '#3366cc', defaultFormat: 'hex', name: 'brand' });
    expect(
      q<HTMLInputElement>('input[type="hidden"][name="brand"]').value,
    ).toBe('#3366cc');
  });

  it('ignores input when disabled', () => {
    const onValueChange = vi.fn();
    render({ defaultValue: '#3366cc', disabled: true, onValueChange });
    const hue = slider('Hue');
    expect(hue.getAttribute('tabindex')).toBe('-1');
    key(hue, 'ArrowRight');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("paints the area in the colour's hue", () => {
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
    render({ defaultValue: 'oklch(0.6 0.2 264)' });
    // Middle row, a third of the way in: a blue, not the red of hue 0.
    const i = (32 * 96 + 32) * 4;
    expect(data![i + 2]).toBeGreaterThan(data![i]);
  });

  it('keeps swatch triggers as tall as their swatch', () => {
    render();
    const swatch = q('[data-slot="color-picker-swatch-trigger"]');
    expect(swatch.className).toContain('inline-flex');
  });

  it('shows the value a controlling parent clamps back to, even unchanged', () => {
    // The parent caps chroma at 0.1 and the value is already there: the
    // emitted 0.4 comes back as the same string, so the prop never changes.
    function Clamped() {
      const [value, setValue] = useState('oklch(0.7 0.1 200)');
      return (
        <ColorPicker
          inline
          value={value}
          onValueChange={(d) =>
            setValue(`oklch(0.7 ${Math.min(d.value.c, 0.1)} 200)`)
          }
        >
          <ColorPickerContent>
            <ColorPickerChannelSlider channel="chroma" />
            <ColorPickerChannelInput />
          </ColorPickerContent>
        </ColorPicker>
      );
    }
    act(() => root.render(<Clamped />));
    key(slider('Chroma'), 'End');
    expect(slider('Chroma').getAttribute('aria-valuenow')).toBe('0.1');
    expect(
      q<HTMLInputElement>('[data-slot="color-picker-channel-input"]').value,
    ).toBe('oklch(0.7 0.1 200)');
  });

  it('follows the parent back to a value it emitted before', () => {
    let setOuter: (v: string) => void = () => undefined;
    function Outer() {
      const [value, setValue] = useState('oklch(0.7 0.1 200)');
      setOuter = setValue;
      return (
        <ColorPicker
          inline
          value={value}
          onValueChange={(d) => setValue(d.valueAsString)}
        >
          <ColorPickerContent>
            <ColorPickerChannelSlider channel="hue" />
            <ColorPickerValueText />
          </ColorPickerContent>
        </ColorPicker>
      );
    }
    act(() => root.render(<Outer />));
    key(slider('Hue'), 'ArrowRight'); // emits A = hue 201
    expect(valueText()).toBe('oklch(0.7 0.1 201)');
    act(() => setOuter('oklch(0.7 0.1 50)')); // B from outside
    expect(valueText()).toBe('oklch(0.7 0.1 50)');
    act(() => setOuter('oklch(0.7 0.1 201)')); // back to A
    expect(valueText()).toBe('oklch(0.7 0.1 201)');
  });

  it('gives the area thumb the numbers of its y channel', () => {
    render({ defaultValue: 'oklch(0.7 0.1 200)' });
    const thumb = q<HTMLElement>('[data-slot="color-picker-area-thumb"]');
    expect(thumb.getAttribute('aria-valuenow')).toBe('0.7');
    expect(thumb.getAttribute('aria-valuemin')).toBe('0');
    expect(thumb.getAttribute('aria-valuemax')).toBe('1');
    expect(thumb.getAttribute('aria-valuetext')).toBe(
      'Chroma 0.1, Lightness 70%',
    );
  });

  it('ends a drag the browser cancels', () => {
    const onValueChangeEnd = vi.fn();
    render({ defaultValue: 'oklch(0.7 0.1 200)', onValueChangeEnd });
    const track = q<HTMLElement>(
      '[data-slot="color-picker-channel-slider"][data-channel="hue"]',
    );
    track.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        width: 360,
        height: 12,
        right: 360,
        bottom: 12,
      }) as DOMRect;
    track.setPointerCapture = () => undefined;
    act(() => {
      track.dispatchEvent(
        new MouseEvent('pointerdown', {
          bubbles: true,
          clientX: 90,
          button: 0,
        }),
      );
    });
    expect(q('[data-slot="color-picker"]').hasAttribute('data-dragging')).toBe(
      true,
    );
    act(() => {
      track.dispatchEvent(new MouseEvent('pointercancel', { bubbles: true }));
    });
    expect(onValueChangeEnd).toHaveBeenCalledTimes(1);
    expect(q('[data-slot="color-picker"]').hasAttribute('data-dragging')).toBe(
      false,
    );
  });

  it('opens the panel from the trigger in popover mode', () => {
    act(() =>
      root.render(
        <ColorPicker defaultValue="#3366cc">
          <ColorPickerTrigger />
          <ColorPickerContent>
            <ColorPickerChannelSlider channel="hue" />
          </ColorPickerContent>
        </ColorPicker>,
      ),
    );
    expect(document.querySelector('[role="slider"]')).toBeNull();
    const trigger = q<HTMLButtonElement>('[data-slot="color-picker-trigger"]');
    expect(trigger.getAttribute('aria-label')).toBe('Pick a color');
    act(() => {
      trigger.dispatchEvent(
        new MouseEvent('pointerdown', { bubbles: true, button: 0 }),
      );
      trigger.click();
    });
    expect(document.querySelector('[role="slider"]')).not.toBeNull();
  });
});
