import type { Meta, StoryObj } from '@storybook/react';

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtImage,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from './chain-of-thought';

/**
 * ChainOfThought - reasoning step list with header, optional images and
 * search-result chips (React edition).
 *
 * Mirrors the ng-ai ChainOfThought stories: header only, simple steps, with
 * search results, with image preview, and the step status palette.
 */
const meta = {
  title: 'AI/Chatbot/ChainOfThought',
  component: ChainOfThought,
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: {
      control: 'boolean',
      description: 'Whether the reasoning list starts expanded.',
    },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ChainOfThought>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Simple: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <ChainOfThought {...args}>
      <ChainOfThoughtHeader>Searching the docs</ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep
          label="Identifying relevant sources"
          status="complete"
        />
        <ChainOfThoughtStep
          label="Reading the API reference"
          status="complete"
        />
        <ChainOfThoughtStep label="Composing the answer" status="active" />
        <ChainOfThoughtStep label="Verifying citations" status="pending" />
      </ChainOfThoughtContent>
    </ChainOfThought>
  ),
};

export const HeaderOnly: Story = {
  name: 'Header only (collapsed)',
  args: { defaultOpen: false },
  render: (args) => (
    <ChainOfThought {...args}>
      <ChainOfThoughtHeader>Thinking through the steps</ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep label="Step hidden until expanded" />
      </ChainOfThoughtContent>
    </ChainOfThought>
  ),
};

export const WithSearchResults: Story = {
  name: 'With search results',
  args: { defaultOpen: true },
  render: (args) => (
    <ChainOfThought {...args}>
      <ChainOfThoughtHeader>Searching for examples</ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep
          description="Searched for 'compound components'"
          label="Query the documentation"
          status="complete"
        >
          <ChainOfThoughtSearchResults>
            <ChainOfThoughtSearchResult>
              radix-ui · primitives
            </ChainOfThoughtSearchResult>
            <ChainOfThoughtSearchResult>
              React docs · forwardRef
            </ChainOfThoughtSearchResult>
            <ChainOfThoughtSearchResult>
              shadcn · slot pattern
            </ChainOfThoughtSearchResult>
          </ChainOfThoughtSearchResults>
        </ChainOfThoughtStep>
        <ChainOfThoughtStep label="Synthesize the response" status="active" />
      </ChainOfThoughtContent>
    </ChainOfThought>
  ),
};

/**
 * With image - illustrates how `ChainOfThoughtImage` nests inside a step and
 * supports an optional caption.
 */
export const WithImage: Story = {
  name: 'With image preview',
  args: { defaultOpen: true },
  render: (args) => (
    <ChainOfThought {...args}>
      <ChainOfThoughtHeader>Analyzing the screenshot</ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep
          description="Comparing the wiring to the spec"
          label="Inspecting the diagram"
          status="complete"
        >
          <ChainOfThoughtImage caption="System diagram (annotated)">
            <div className="flex h-32 w-full items-center justify-center bg-gradient-to-br from-brand-400 to-brand-700 text-white text-xs">
              [placeholder image]
            </div>
          </ChainOfThoughtImage>
        </ChainOfThoughtStep>
      </ChainOfThoughtContent>
    </ChainOfThought>
  ),
};

export const StatusVariants: Story = {
  name: 'Step status variants',
  parameters: { controls: { disable: true } },
  render: () => (
    <ChainOfThought defaultOpen={true}>
      <ChainOfThoughtHeader>Step status palette</ChainOfThoughtHeader>
      <ChainOfThoughtContent>
        <ChainOfThoughtStep
          label="Complete step (muted text)"
          status="complete"
        />
        <ChainOfThoughtStep label="Active step (foreground)" status="active" />
        <ChainOfThoughtStep label="Pending step (dimmed)" status="pending" />
      </ChainOfThoughtContent>
    </ChainOfThought>
  ),
};
