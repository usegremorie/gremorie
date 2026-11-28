import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';

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
  ColorPickerValueText,
} from './color-picker';

/**
 * # Color Picker
 *
 * Pick a colour on an OKLCH area (chroma x lightness) and channel sliders,
 * type it in any CSS format, choose from swatches and keep saved colours.
 * Opens in a popover from the trigger, or renders in place with `inline`.
 *
 * ## Anatomy
 *
 * ```text
 * ColorPicker                       root, shared state
 * ├─ ColorPickerLabel
 * ├─ ColorPickerControl
 * │  ├─ ColorPickerTrigger          opens the popover
 * │  └─ ColorPickerChannelInput     text field (css, hex or a channel)
 * └─ ColorPickerContent             panel
 *    ├─ ColorPickerArea             2D area
 *    │  └─ ColorPickerAreaThumb
 *    ├─ ColorPickerChannelSlider    hue, alpha, lightness or chroma
 *    ├─ ColorPickerFormatSelect
 *    ├─ ColorPickerEyeDropperTrigger
 *    ├─ ColorPickerSwatchGroup
 *    │  └─ ColorPickerSwatchTrigger
 *    │     └─ ColorPickerSwatch
 *    └─ ColorPickerSavedColors
 *       └─ ColorPickerSaveTrigger
 * ```
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--popover-surface` | panel surface |
 * | `--border` | swatch and track hairline |
 * | `--field` | text field |
 * | `--ring` | focus and hover ring |
 * | `--muted`, `--background` | transparency checkerboard |
 */
const meta = {
  title: 'Inputs/Selection/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    defaultFormat: {
      control: 'inline-radio',
      options: ['oklch', 'hex', 'rgb', 'hsl'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    inline: { control: 'boolean' },
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

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

function Panel({ alpha = true }: { alpha?: boolean }) {
  return (
    <>
      <ColorPickerArea />
      <ColorPickerChannelSlider channel="hue" />
      {alpha ? <ColorPickerChannelSlider channel="alpha" /> : null}
      <div className="flex gap-2">
        <ColorPickerFormatSelect />
        <ColorPickerChannelInput />
        <ColorPickerEyeDropperTrigger />
      </div>
      <ColorPickerSwatchGroup aria-label="Presets">
        {PRESETS.map((c) => (
          <ColorPickerSwatchTrigger key={c} value={c} />
        ))}
      </ColorPickerSwatchGroup>
      <ColorPickerSavedColors>
        <ColorPickerSaveTrigger />
      </ColorPickerSavedColors>
    </>
  );
}

/**
 * Workbench preset: renders the IDENTICAL use case as the Angular `Workbench`
 * story in `ng-forms`. Keep both datasets in sync.
 */
export const Workbench: Story = {
  args: { defaultValue: 'oklch(0.55 0.2 260)', inline: true },
  render: (args) => (
    <ColorPicker {...args} className="w-72">
      <ColorPickerContent>
        <Panel />
      </ColorPickerContent>
    </ColorPicker>
  ),
};

/** Trigger and field; the panel opens in a popover. */
export const Default: Story = {
  args: { defaultValue: 'oklch(0.55 0.2 260)' },
  render: (args) => (
    <ColorPicker {...args}>
      <ColorPickerLabel>Brand color</ColorPickerLabel>
      <ColorPickerControl className="w-60">
        <ColorPickerTrigger />
        <ColorPickerChannelInput />
      </ColorPickerControl>
      <ColorPickerContent>
        <Panel />
      </ColorPickerContent>
    </ColorPicker>
  ),
};

/** In place, without a popover. */
export const Inline: Story = {
  args: { defaultValue: 'oklch(0.65 0.17 150)', inline: true },
  render: Workbench.render,
};

/** Opaque colours only: no alpha slider, hex field. */
export const WithoutAlpha: Story = {
  args: { defaultValue: '#3366cc', defaultFormat: 'hex', inline: true },
  render: (args) => (
    <ColorPicker {...args} className="w-72">
      <ColorPickerContent>
        <Panel alpha={false} />
      </ColorPickerContent>
    </ColorPicker>
  ),
};

/** Saved colours kept by the app (here in state). */
export const SavedColors: Story = {
  args: { inline: true },
  render: function Render(args) {
    const [saved, setSaved] = React.useState([
      'oklch(0.63 0.2 25)',
      'oklch(0.55 0.2 260)',
    ]);
    const [value, setValue] = React.useState('oklch(0.7 0.18 55)');
    return (
      <div className="grid w-72 gap-3">
        <ColorPicker
          {...args}
          value={value}
          onValueChange={(d) => setValue(d.valueAsString)}
          savedColors={saved}
          onSavedColorsChange={setSaved}
        >
          <ColorPickerContent>
            <ColorPickerArea />
            <ColorPickerChannelSlider channel="hue" />
            <ColorPickerSavedColors>
              <ColorPickerSaveTrigger />
            </ColorPickerSavedColors>
            <ColorPickerValueText />
          </ColorPickerContent>
        </ColorPicker>
      </div>
    );
  },
};

/** Disabled. */
export const Disabled: Story = {
  args: { defaultValue: 'oklch(0.55 0.2 260)', inline: true, disabled: true },
  render: Workbench.render,
};
