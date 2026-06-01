import type { Meta, StoryObj } from '@storybook/react';
import { FileText } from 'lucide-react';

import { Suggestion, Suggestions } from './suggestion';

/**
 * Suggestion - clickable chip (React edition).
 *
 * Mirrors the ng-ai Suggestion stories: the 4 variants + the sizes + the
 * `Suggestions` row container. Note the React API takes the chip label via
 * the `suggestion` prop (the Angular edition used `value`), and the React
 * `Button` exposes `sm | default | lg` sizes (no `md`).
 */
const meta = {
  title: 'AI/Suggestion',
  component: Suggestion,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'secondary'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'default', 'lg'],
    },
  },
} satisfies Meta<typeof Suggestion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { suggestion: 'Tell me a joke', variant: 'outline', size: 'sm' },
};

export const Outline: Story = {
  args: { suggestion: 'Outline', variant: 'outline', size: 'sm' },
};

export const Secondary: Story = {
  args: { suggestion: 'Secondary', variant: 'secondary', size: 'sm' },
};

export const Ghost: Story = {
  args: { suggestion: 'Ghost', variant: 'ghost', size: 'sm' },
};

export const Filled: Story = {
  name: 'Filled (default)',
  args: { suggestion: 'Default', variant: 'default', size: 'sm' },
};

/**
 * Row - multiple suggestions inside `Suggestions`. The wrapper hides its
 * scrollbar so long lists scroll horizontally without visual noise.
 */
export const Row: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Suggestions>
      <Suggestion suggestion="Tell me a joke" />
      <Suggestion suggestion="Summarize this" />
      <Suggestion suggestion="Translate to French" />
      <Suggestion suggestion="Explain like I'm 5" />
      <Suggestion suggestion="What's next?" />
    </Suggestions>
  ),
};

export const WithIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <Suggestion suggestion="Generate a report">
      <span className="flex items-center gap-1.5">
        <FileText className="size-3.5" aria-hidden="true" />
        Generate a report
      </span>
    </Suggestion>
  ),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Suggestion suggestion="Small" size="sm" />
      <Suggestion suggestion="Medium" size="default" />
      <Suggestion suggestion="Large" size="lg" />
    </div>
  ),
};
