import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { DatePicker } from './date-picker';

/**
 * DatePicker — composite of Popover + Calendar with Gremorie defaults. Angular
 * parity port of React `DatePicker` from `@gremorie/rx-overlays`. Composes the
 * spartan brain `BrnPopover` (portalled overlay + open/close a11y) with the
 * local `gr-calendar`, and styles the trigger with the ng-core outline button.
 */
const meta: Meta<DatePicker> = {
  title: 'Inputs/Date/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [DatePicker] })],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<DatePicker>;

/** Interactive workbench — open the popover and pick a date. */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    placeholder: 'Pick a date',
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <gr-date-picker [placeholder]="placeholder" [disabled]="disabled" />
    `,
  }),
};

/** Disabled trigger. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<gr-date-picker [disabled]="true" placeholder="Unavailable" />`,
  }),
};
