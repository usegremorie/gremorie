import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';

/**
 * Select — dropdown chooser for short, fixed lists. Angular parity port of
 * React `Select` from `@gremorie/rx-forms`. Composes the spartan brain
 * `BrnSelect` + `BrnPopover`, which together own the value, listbox a11y,
 * type-ahead, arrow-key navigation and the portalled overlay.
 */
const meta: Meta<Select> = {
  title: 'Inputs/Selection/Select',
  component: Select,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        Select,
        SelectTrigger,
        SelectValue,
        SelectContent,
        SelectItem,
        SelectGroup,
        SelectLabel,
        SelectSeparator,
      ],
    }),
  ],
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Select>;

/** Interactive workbench — open the listbox and pick a fruit. */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <gr-select [disabled]="disabled">
        <gr-select-trigger class="w-48">
          <gr-select-value placeholder="Pick a fruit" />
        </gr-select-trigger>
        <gr-select-content>
          <gr-select-item value="apple">Apple</gr-select-item>
          <gr-select-item value="banana">Banana</gr-select-item>
          <gr-select-item value="blueberry">Blueberry</gr-select-item>
          <gr-select-item value="grapes">Grapes</gr-select-item>
        </gr-select-content>
      </gr-select>
    `,
  }),
};

/** Grouped options with a heading and a separator. */
export const Grouped: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gr-select>
        <gr-select-trigger class="w-56">
          <gr-select-value placeholder="Select a timezone" />
        </gr-select-trigger>
        <gr-select-content>
          <gr-select-group>
            <gr-select-label>North America</gr-select-label>
            <gr-select-item value="est">Eastern (EST)</gr-select-item>
            <gr-select-item value="pst">Pacific (PST)</gr-select-item>
          </gr-select-group>
          <gr-select-separator />
          <gr-select-group>
            <gr-select-label>Europe</gr-select-label>
            <gr-select-item value="gmt">Greenwich (GMT)</gr-select-item>
            <gr-select-item value="cet">Central European (CET)</gr-select-item>
          </gr-select-group>
        </gr-select-content>
      </gr-select>
    `,
  }),
};

/** Small trigger via `size="sm"`. */
export const Small: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gr-select>
        <gr-select-trigger size="sm" class="w-40">
          <gr-select-value placeholder="Size" />
        </gr-select-trigger>
        <gr-select-content>
          <gr-select-item value="s">Small</gr-select-item>
          <gr-select-item value="m">Medium</gr-select-item>
          <gr-select-item value="l">Large</gr-select-item>
        </gr-select-content>
      </gr-select>
    `,
  }),
};

/** Disabled. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gr-select [disabled]="true">
        <gr-select-trigger class="w-48">
          <gr-select-value placeholder="Unavailable" />
        </gr-select-trigger>
        <gr-select-content>
          <gr-select-item value="a">A</gr-select-item>
        </gr-select-content>
      </gr-select>
    `,
  }),
};
