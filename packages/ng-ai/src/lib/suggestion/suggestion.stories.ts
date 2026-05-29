import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Suggestion } from './suggestion';
import { Suggestions } from './suggestions';

/**
 * Suggestion — clickable chip. Stories exercise the 4 variants + the
 * 3 sizes + the `<suggestions>` row container.
 */
const meta: Meta<Suggestion> = {
  title: 'AI/Suggestion',
  component: Suggestion,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Suggestion, Suggestions],
    }),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'secondary'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<Suggestion>;

export const Default: Story = {
  args: { variant: 'outline', size: 'sm' },
  render: (args) => ({
    props: args,
    template: `
      <suggestion value="Tell me a joke" [variant]="variant" [size]="size">
        Tell me a joke
      </suggestion>
    `,
  }),
};

export const Outline: Story = {
  args: { variant: 'outline', size: 'sm' },
  render: (args) => ({
    props: args,
    template: `<suggestion value="Outline" [variant]="variant" [size]="size">Outline</suggestion>`,
  }),
};

export const Secondary: Story = {
  args: { variant: 'secondary', size: 'sm' },
  render: (args) => ({
    props: args,
    template: `<suggestion value="Secondary" [variant]="variant" [size]="size">Secondary</suggestion>`,
  }),
};

export const Ghost: Story = {
  args: { variant: 'ghost', size: 'sm' },
  render: (args) => ({
    props: args,
    template: `<suggestion value="Ghost" [variant]="variant" [size]="size">Ghost</suggestion>`,
  }),
};

export const Filled: Story = {
  name: 'Filled (default)',
  args: { variant: 'default', size: 'sm' },
  render: (args) => ({
    props: args,
    template: `<suggestion value="Default" [variant]="variant" [size]="size">Default</suggestion>`,
  }),
};

/**
 * Row — multiple suggestions inside `<suggestions>`. The wrapper hides its
 * scrollbar so long lists scroll horizontally without visual noise.
 */
export const Row: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <suggestions>
        <suggestion value="Tell me a joke">Tell me a joke</suggestion>
        <suggestion value="Summarize this">Summarize this</suggestion>
        <suggestion value="Translate to French">Translate to French</suggestion>
        <suggestion value="Explain like I'm 5">Explain like I'm 5</suggestion>
        <suggestion value="What's next?">What's next?</suggestion>
      </suggestions>
    `,
  }),
};

export const WithIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <suggestion value="Generate a report">
        <span class="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6"/>
          </svg>
          Generate a report
        </span>
      </suggestion>
    `,
  }),
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="flex flex-wrap items-center gap-2">
        <suggestion value="sm" size="sm">Small</suggestion>
        <suggestion value="md" size="md">Medium</suggestion>
        <suggestion value="lg" size="lg">Large</suggestion>
      </div>
    `,
  }),
};
