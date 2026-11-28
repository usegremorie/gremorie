'use client';

import {
  ColorPicker,
  ColorPickerArea,
  ColorPickerChannelInput,
  ColorPickerChannelSlider,
  ColorPickerContent,
  ColorPickerControl,
  ColorPickerEyeDropperTrigger,
  ColorPickerFormatSelect,
  ColorPickerLabel,
  ColorPickerSaveTrigger,
  ColorPickerSavedColors,
  ColorPickerSwatchGroup,
  ColorPickerSwatchTrigger,
  ColorPickerTrigger,
} from '@gremorie/rx-forms';

const PRESETS = [
  'oklch(0.63 0.2 25)',
  'oklch(0.7 0.18 55)',
  'oklch(0.8 0.16 90)',
  'oklch(0.65 0.17 150)',
  'oklch(0.6 0.12 200)',
  'oklch(0.55 0.2 260)',
  'oklch(0.55 0.22 295)',
  'oklch(0.6 0.2 350)',
];

export function ColorPickerPreview() {
  return (
    <ColorPicker defaultValue="oklch(0.55 0.2 260)">
      <ColorPickerLabel>Brand color</ColorPickerLabel>
      <ColorPickerControl className="w-60">
        <ColorPickerTrigger />
        <ColorPickerChannelInput />
      </ColorPickerControl>
      <ColorPickerContent>
        <ColorPickerArea />
        <ColorPickerChannelSlider channel="hue" />
        <ColorPickerChannelSlider channel="alpha" />
        <div className="flex gap-2">
          <ColorPickerFormatSelect />
          <ColorPickerChannelInput />
          <ColorPickerEyeDropperTrigger />
        </div>
        <ColorPickerSwatchGroup aria-label="Presets">
          {PRESETS.map((color) => (
            <ColorPickerSwatchTrigger key={color} value={color} />
          ))}
        </ColorPickerSwatchGroup>
        <ColorPickerSavedColors>
          <ColorPickerSaveTrigger />
        </ColorPickerSavedColors>
      </ColorPickerContent>
    </ColorPicker>
  );
}
