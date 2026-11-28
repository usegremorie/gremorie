'use client';

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerChannelSlider,
  ColorPickerContent,
  ColorPickerValueText,
} from '@gremorie/rx-forms';

export function ColorPickerAlphaPreview() {
  return (
    <ColorPicker
      inline
      defaultValue="oklch(0.6 0.2 350 / 0.6)"
      defaultFormat="rgb"
      className="w-72"
    >
      <ColorPickerContent>
        <ColorPickerArea />
        <ColorPickerChannelSlider channel="hue" />
        <ColorPickerChannelSlider channel="alpha" />
        <ColorPickerValueText />
      </ColorPickerContent>
    </ColorPicker>
  );
}
