'use client';

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerChannelSlider,
  ColorPickerContent,
  ColorPickerValueText,
} from '@gremorie/rx-forms';

export function ColorPickerInlinePreview() {
  return (
    <ColorPicker inline defaultValue="oklch(0.65 0.17 150)" className="w-72">
      <ColorPickerContent>
        <ColorPickerArea />
        <ColorPickerChannelSlider channel="hue" />
        <ColorPickerValueText />
      </ColorPickerContent>
    </ColorPicker>
  );
}
