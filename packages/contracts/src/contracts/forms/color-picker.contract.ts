import { defineContract } from '../../types';

/**
 * ColorPicker - pick a colour on an OKLCH area and channel sliders, type it in
 * any CSS format, choose from swatches and keep saved colours. Both editions
 * share the logic in `@gremorie/color`.
 * React: `@gremorie/rx-forms`. Angular: `@gremorie/ng-forms`.
 */
export const colorPicker = defineContract({
  name: 'color-picker',
  category: 'forms',
  status: 'stable',
  anatomy: `
    <color-picker>
    └─ root (shared state)
       ├─ label
       ├─ control
       │  ├─ trigger (opens the popover)
       │  └─ channel-input (css, hex or one channel)
       └─ content (popover, or in place with inline)
          ├─ area (2D: chroma x lightness by default)
          │  └─ area-thumb
          ├─ channel-slider (hue, alpha, lightness or chroma)
          ├─ format-select
          ├─ eye-dropper-trigger (only where the browser supports it)
          ├─ swatch-group
          │  └─ swatch-trigger
          │     └─ swatch (+ transparency-grid under alpha)
          ├─ saved-colors
          │  └─ save-trigger
          └─ value-text`,
  props: [
    {
      name: 'value',
      type: 'string',
      adapts: { ng: 'input: value + output: valueChange, two-way [(value)]; also ControlValueAccessor' },
      desc: 'Colour as CSS text (controlled).',
    },
    {
      name: 'defaultValue',
      type: 'string',
      default: 'oklch(0 0 0)',
      desc: 'Initial colour (uncontrolled).',
    },
    {
      name: 'onValueChange',
      type: '(details: { value: Color; valueAsString: string }) => void',
      adapts: { ng: 'output: valueChange (emits the string)' },
      desc: 'Fires on every change, while dragging too.',
    },
    {
      name: 'onValueChangeEnd',
      type: '(details: { value: Color; valueAsString: string }) => void',
      adapts: { ng: 'output: valueChangeEnd' },
      desc: 'Fires when a change is committed: drag released, key, swatch or field.',
    },
    {
      name: 'format',
      type: "'oklch' | 'hex' | 'rgb' | 'hsl'",
      options: ['oklch', 'hex', 'rgb', 'hsl'],
      adapts: { ng: 'model: format (two-way)' },
      desc: 'Format of the value text and of the field (controlled).',
    },
    {
      name: 'defaultFormat',
      type: "'oklch' | 'hex' | 'rgb' | 'hsl'",
      default: 'oklch',
      adapts: { ng: 'model: format' },
      desc: 'Initial format (uncontrolled).',
    },
    {
      name: 'onFormatChange',
      type: '(format: ColorFormat) => void',
      adapts: { ng: 'model: format (two-way)' },
      desc: 'Fires when the format changes.',
    },
    {
      name: 'open',
      type: 'boolean',
      adapts: { ng: 'model: open (two-way)' },
      desc: 'Popover open state (controlled).',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      default: false,
      adapts: { ng: 'model: open' },
      desc: 'Initial open state (uncontrolled).',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      adapts: { ng: 'model: open (two-way)' },
      desc: 'Fires when the popover opens or closes.',
    },
    {
      name: 'inline',
      type: 'boolean',
      default: false,
      desc: 'Render the panel in place, without a popover.',
    },
    {
      name: 'closeOnSelect',
      type: 'boolean',
      default: false,
      desc: 'Close the popover when a swatch is picked.',
    },
    {
      name: 'savedColors',
      type: 'string[]',
      adapts: { ng: 'model: savedColors (two-way)' },
      desc: 'Saved colours, newest first (controlled).',
    },
    {
      name: 'defaultSavedColors',
      type: 'string[]',
      adapts: { ng: 'model: savedColors' },
      desc: 'Initial saved colours (uncontrolled). Defaults to none.',
    },
    {
      name: 'onSavedColorsChange',
      type: '(colors: string[]) => void',
      adapts: { ng: 'model: savedColors (two-way)' },
      desc: 'Fires when a colour is saved or removed.',
    },
    {
      name: 'maxSavedColors',
      type: 'number',
      default: 16,
      desc: 'Most saved colours kept; the oldest goes first.',
    },
    { name: 'disabled', type: 'boolean', default: false, desc: 'Disables every part.' },
    {
      name: 'readOnly',
      type: 'boolean',
      default: false,
      desc: 'Shows the value but takes no changes.',
    },
    {
      name: 'required',
      type: 'boolean',
      default: false,
      desc: 'Marks the hidden form input as required.',
    },
    {
      name: 'invalid',
      type: 'boolean',
      default: false,
      desc: 'Error styling on the trigger and field.',
    },
    {
      name: 'name',
      type: 'string',
      desc: 'Form field name: renders a hidden input with the value.',
    },
    {
      name: 'channelLabels',
      type: 'ChannelLabels',
      desc: 'Words for channel names in assistive text, to translate them.',
    },
    {
      name: 'className',
      type: 'string',
      adapts: { rx: 'inherited: div props', ng: 'input: class' },
      desc: 'Merged onto the root.',
    },
  ],
  guidance: {
    summary:
      'Pick a colour on an OKLCH area and sliders, type it, or choose from swatches and saved colours.',
    whenToUse: [
      'Let people choose any colour: a brand colour, a theme accent, a label colour.',
      'Offer presets with swatches and keep the colours someone reuses as saved colours.',
    ],
    whenNotToUse: [
      { text: 'Choosing from a short fixed palette only', use: 'radio-group' },
      { text: 'A colour that is just text in a form', use: 'input' },
    ],
    rules: [
      'Values stay OKLCH while editing; format only changes how the value is printed.',
      'Hex, rgb and hsl print the closest sRGB colour; oklch keeps the chosen one.',
      'Keep the alpha slider off when the value cannot be translucent.',
      'Saved colours are controlled: store them where the app keeps preferences.',
    ],
    example:
      '<color-picker defaultValue="oklch(0.55 0.2 260)"><trigger /><content><area /><channel-slider channel="hue" /></content></color-picker>',
  },
  preview: {
    rx: 'inputs-selection-colorpicker--workbench',
    ng: 'inputs-selection-colorpicker--workbench',
  },
  tag: { rx: 'ColorPicker', ng: 'gr-color-picker' },
  example: {
    defaultValue: 'oklch(0.55 0.2 260)',
    inline: true,
    disabled: false,
  },
  figma: { nodeId: null },
});
