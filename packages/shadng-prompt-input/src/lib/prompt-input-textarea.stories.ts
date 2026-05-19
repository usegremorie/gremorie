import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { PromptInput } from './prompt-input';
import { PromptInputTextarea } from './prompt-input-textarea';

const meta: Meta<PromptInputTextarea> = {
  title: 'PromptInput/Textarea',
  component: PromptInputTextarea,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [PromptInput] })],
  argTypes: {
    placeholder: { control: 'text' },
    rows: { control: { type: 'number', min: 1, max: 10 } },
    maxHeightPx: { control: { type: 'number', min: 80, max: 600 } },
  },
  args: {
    placeholder: 'Ask anything…',
    rows: 1,
    maxHeightPx: 192,
  },
  render: (args) => ({
    props: args,
    template: `
      <prompt-input style="max-width: 32rem;">
        <prompt-input-textarea
          [placeholder]="placeholder"
          [rows]="rows"
          [maxHeightPx]="maxHeightPx"
        />
      </prompt-input>
    `,
  }),
};

export default meta;
type Story = StoryObj<PromptInputTextarea>;

export const Default: Story = {};
export const ShortMaxHeight: Story = {
  name: 'Short max height (80px)',
  args: { maxHeightPx: 80 },
};
export const TallStartingRows: Story = {
  name: '4 rows initial',
  args: { rows: 4 },
};
