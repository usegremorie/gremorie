'use client';

import {
  ColorPicker,
  ColorPickerChannelInput,
  ColorPickerChannelSlider,
  ColorPickerContent,
  ColorPickerSaveTrigger,
  ColorPickerSavedColors,
} from '@gremorie/rx-forms';
import * as React from 'react';

export function ColorPickerSavedPreview() {
  const [saved, setSaved] = React.useState([
    'oklch(0.63 0.2 25)',
    'oklch(0.55 0.2 260)',
  ]);
  return (
    <ColorPicker
      inline
      defaultValue="oklch(0.7 0.18 55)"
      defaultFormat="hex"
      savedColors={saved}
      onSavedColorsChange={setSaved}
      className="w-72"
    >
      <ColorPickerContent>
        <ColorPickerChannelSlider channel="hue" />
        <ColorPickerChannelSlider channel="chroma" />
        <ColorPickerChannelInput />
        <ColorPickerSavedColors>
          <ColorPickerSaveTrigger />
        </ColorPickerSavedColors>
      </ColorPickerContent>
    </ColorPicker>
  );
}
