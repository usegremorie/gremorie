import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Calendar } from './calendar';

/**
 * Calendar — month grid for picking dates. Angular parity port of React
 * `Calendar` from `@gremorie/rx-forms` (built on react-day-picker). Composes the
 * spartan brain calendar directives, which own the days matrix, grid a11y,
 * roving focus + full keyboard navigation, selection and `min`/`max`
 * constraints. For a compact field, wrap it in a Popover — that is the
 * `DatePicker` composition.
 */
const meta: Meta<Calendar> = {
  title: 'Forms/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [Calendar] })],
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<Calendar>;

/** Interactive workbench — pick a date; toggle `disabled`. */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  args: {
    disabled: false,
  },
  render: (args) => ({
    props: args,
    template: `
      <gn-calendar class="rounded-md border" [disabled]="disabled" />
    `,
  }),
};

/** Bordered card, the common embedded presentation. */
export const Bordered: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<gn-calendar class="rounded-md border" />`,
  }),
};

/** Disabled grid. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `<gn-calendar class="rounded-md border" [disabled]="true" />`,
  }),
};
