import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';

import { ColorPicker, ColorPickerImports } from './color-picker';

/**
 * ColorPicker - pick a colour on an OKLCH area and channel sliders, type it in
 * any CSS format, choose from swatches and keep saved colours. Angular parity
 * port of React `ColorPicker` from `@gremorie/rx-forms`; both share the logic
 * in `@gremorie/color`.
 */
const meta: Meta<ColorPicker> = {
  title: 'Inputs/Selection/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [...ColorPickerImports, BrnPopoverContent] }),
  ],
  argTypes: {
    format: {
      control: 'inline-radio',
      options: ['oklch', 'hex', 'rgb', 'hsl'],
    },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<ColorPicker>;

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

const panel = (alpha = true) => `
  <gr-color-picker-area />
  <gr-color-picker-channel-slider channel="hue" />
  ${alpha ? '<gr-color-picker-channel-slider channel="alpha" />' : ''}
  <div class="flex gap-2">
    <gr-color-picker-format-select />
    <input gr-color-picker-channel-input />
    <button gr-color-picker-eye-dropper-trigger></button>
  </div>
  <gr-color-picker-swatch-group aria-label="Presets">
    @for (c of presets; track c) {
      <button gr-color-picker-swatch-trigger [value]="c"></button>
    }
  </gr-color-picker-swatch-group>
  <gr-color-picker-saved-colors>
    <button gr-color-picker-save-trigger></button>
  </gr-color-picker-saved-colors>
`;

const inlineRender = (alpha = true): Story['render'] => (args) => ({
  props: { ...args, presets: PRESETS },
  template: `
    <gr-color-picker
      inline
      class="w-72"
      [defaultValue]="defaultValue"
      [format]="format"
      [disabled]="disabled"
      [readOnly]="readOnly"
    >
      <gr-color-picker-content>${panel(alpha)}</gr-color-picker-content>
    </gr-color-picker>
  `,
});

/**
 * Workbench preset: renders the IDENTICAL use case as the React `Workbench`
 * story in `rx-forms`. Keep both datasets in sync.
 */
export const Workbench: Story = {
  args: { defaultValue: 'oklch(0.55 0.2 260)', format: 'oklch', disabled: false, readOnly: false },
  render: inlineRender(),
};

/** Trigger and field; the panel opens in a popover. */
export const Default: Story = {
  args: { defaultValue: 'oklch(0.55 0.2 260)', format: 'oklch' },
  render: (args) => ({
    props: { ...args, presets: PRESETS },
    template: `
      <gr-color-picker [defaultValue]="defaultValue" [format]="format">
        <label gr-color-picker-label>Brand color</label>
        <gr-color-picker-control class="w-60">
          <button gr-color-picker-trigger></button>
          <input gr-color-picker-channel-input />
        </gr-color-picker-control>
        <ng-template brnPopoverContent>
          <gr-color-picker-content>${panel()}</gr-color-picker-content>
        </ng-template>
      </gr-color-picker>
    `,
  }),
};

/** In place, without a popover. */
export const Inline: Story = {
  args: { defaultValue: 'oklch(0.65 0.17 150)', format: 'oklch' },
  render: inlineRender(),
};

/** Opaque colours only: no alpha slider, hex field. */
export const WithoutAlpha: Story = {
  args: { defaultValue: '#3366cc', format: 'hex' },
  render: inlineRender(false),
};

/** Saved colours kept by the app (two-way). */
export const SavedColors: Story = {
  render: () => ({
    props: {
      value: 'oklch(0.7 0.18 55)',
      saved: ['oklch(0.63 0.2 25)', 'oklch(0.55 0.2 260)'],
    },
    template: `
      <gr-color-picker inline class="w-72" [(value)]="value" [(savedColors)]="saved">
        <gr-color-picker-content>
          <gr-color-picker-area />
          <gr-color-picker-channel-slider channel="hue" />
          <gr-color-picker-saved-colors>
            <button gr-color-picker-save-trigger></button>
          </gr-color-picker-saved-colors>
          <gr-color-picker-value-text />
        </gr-color-picker-content>
      </gr-color-picker>
    `,
  }),
};

/** Disabled. */
export const Disabled: Story = {
  args: { defaultValue: 'oklch(0.55 0.2 260)', format: 'oklch', disabled: true },
  render: inlineRender(),
};
