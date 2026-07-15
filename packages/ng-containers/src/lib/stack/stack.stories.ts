import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Stack } from './stack';

/**
 * Stack — vertical layout primitive. Mirrors React `Stack` from
 * `@gremorie/rx-containers`.
 *
 * A `<div>` pre-configured as `flex flex-col` with consistent `gap`,
 * `align` and `justify` inputs. Reach for Stack any time items flow
 * top-to-bottom: card contents, form sections, settings rows, vertical
 * menus.
 */
const meta: Meta<Stack> = {
  title: 'Layout & display/Containers/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [moduleMetadata({ imports: [Stack] })],
  argTypes: {
    gap: {
      control: 'inline-radio',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    align: {
      control: 'inline-radio',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
    },
    justify: {
      control: 'inline-radio',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
    },
  },
};

export default meta;
type Story = StoryObj<Stack>;

const BOX =
  'bg-muted flex h-10 items-center justify-center rounded-md border px-4 text-sm';

/** Default — `gap="md"`, stretched children; all three knobs are live. */
export const Workbench: Story = {
  args: { gap: 'md', align: 'stretch', justify: 'start' },
  render: (args) => ({
    props: args,
    template: `
      <gr-stack [gap]="gap" [align]="align" [justify]="justify" class="w-64">
        <div class="${BOX}">One</div>
        <div class="${BOX}">Two</div>
        <div class="${BOX}">Three</div>
      </gr-stack>
    `,
  }),
};

/** Every `gap` step, side by side. */
export const Gaps: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-start gap-8">
        @for (gap of ['none','sm','md','lg','xl']; track gap) {
          <div>
            <div class="text-muted-foreground mb-2 text-xs">gap={{ gap }}</div>
            <gr-stack [gap]="gap" class="w-24">
              <div class="${BOX}">1</div>
              <div class="${BOX}">2</div>
              <div class="${BOX}">3</div>
            </gr-stack>
          </div>
        }
      </div>
    `,
  }),
};

/** Cross-axis `align` values (note the varying child widths). */
export const Align: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-start gap-8">
        @for (align of ['start','center','end','stretch']; track align) {
          <div>
            <div class="text-muted-foreground mb-2 text-xs">align={{ align }}</div>
            <gr-stack [align]="align" gap="sm" class="bg-card w-40 rounded-md border p-2">
              <div class="${BOX}">Short</div>
              <div class="${BOX}">A longer item</div>
            </gr-stack>
          </div>
        }
      </div>
    `,
  }),
};

/** Main-axis `justify` inside a fixed-height container. */
export const Justify: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex items-start gap-8">
        @for (justify of ['start','center','end','between']; track justify) {
          <div>
            <div class="text-muted-foreground mb-2 text-xs">justify={{ justify }}</div>
            <gr-stack [justify]="justify" class="bg-card h-48 w-28 rounded-md border p-2">
              <div class="${BOX}">1</div>
              <div class="${BOX}">2</div>
              <div class="${BOX}">3</div>
            </gr-stack>
          </div>
        }
      </div>
    `,
  }),
};
