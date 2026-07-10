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
      <gn-select [disabled]="disabled">
        <gn-select-trigger class="w-48">
          <gn-select-value placeholder="Pick a fruit" />
        </gn-select-trigger>
        <gn-select-content>
          <gn-select-item value="apple">Apple</gn-select-item>
          <gn-select-item value="banana">Banana</gn-select-item>
          <gn-select-item value="blueberry">Blueberry</gn-select-item>
          <gn-select-item value="grapes">Grapes</gn-select-item>
        </gn-select-content>
      </gn-select>
    `,
  }),
};

/** Grouped options with a heading and a separator. */
export const Grouped: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-select>
        <gn-select-trigger class="w-56">
          <gn-select-value placeholder="Select a timezone" />
        </gn-select-trigger>
        <gn-select-content>
          <gn-select-group>
            <gn-select-label>North America</gn-select-label>
            <gn-select-item value="est">Eastern (EST)</gn-select-item>
            <gn-select-item value="pst">Pacific (PST)</gn-select-item>
          </gn-select-group>
          <gn-select-separator />
          <gn-select-group>
            <gn-select-label>Europe</gn-select-label>
            <gn-select-item value="gmt">Greenwich (GMT)</gn-select-item>
            <gn-select-item value="cet">Central European (CET)</gn-select-item>
          </gn-select-group>
        </gn-select-content>
      </gn-select>
    `,
  }),
};

/** Small trigger via `size="sm"`. */
export const Small: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-select>
        <gn-select-trigger size="sm" class="w-40">
          <gn-select-value placeholder="Size" />
        </gn-select-trigger>
        <gn-select-content>
          <gn-select-item value="s">Small</gn-select-item>
          <gn-select-item value="m">Medium</gn-select-item>
          <gn-select-item value="l">Large</gn-select-item>
        </gn-select-content>
      </gn-select>
    `,
  }),
};

/** Disabled. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-select [disabled]="true">
        <gn-select-trigger class="w-48">
          <gn-select-value placeholder="Unavailable" />
        </gn-select-trigger>
        <gn-select-content>
          <gn-select-item value="a">A</gn-select-item>
        </gn-select-content>
      </gn-select>
    `,
  }),
};
