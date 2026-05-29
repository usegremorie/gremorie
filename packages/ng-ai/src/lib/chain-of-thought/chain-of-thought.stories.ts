import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtImage,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from './';

/**
 * ChainOfThought — reasoning step list with header, optional images and
 * search-result chips. Stories cover: header only, simple steps, with
 * search results, and with image preview.
 */
const meta: Meta<ChainOfThought> = {
  title: 'AI/ChainOfThought',
  component: ChainOfThought,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        ChainOfThought,
        ChainOfThoughtHeader,
        ChainOfThoughtContent,
        ChainOfThoughtStep,
        ChainOfThoughtSearchResults,
        ChainOfThoughtSearchResult,
        ChainOfThoughtImage,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<ChainOfThought>;

export const Simple: Story = {
  render: () => ({
    template: `
      <chain-of-thought [open]="true">
        <chain-of-thought-header>Searching the docs</chain-of-thought-header>
        <chain-of-thought-content>
          <chain-of-thought-step label="Identifying relevant sources" status="complete" />
          <chain-of-thought-step label="Reading the API reference" status="complete" />
          <chain-of-thought-step label="Composing the answer" status="active" />
          <chain-of-thought-step label="Verifying citations" status="pending" />
        </chain-of-thought-content>
      </chain-of-thought>
    `,
  }),
};

export const HeaderOnly: Story = {
  name: 'Header only (collapsed)',
  render: () => ({
    template: `
      <chain-of-thought [open]="false">
        <chain-of-thought-header>Thinking through the steps</chain-of-thought-header>
        <chain-of-thought-content>
          <chain-of-thought-step label="Step hidden until expanded" />
        </chain-of-thought-content>
      </chain-of-thought>
    `,
  }),
};

export const WithSearchResults: Story = {
  name: 'With search results',
  render: () => ({
    template: `
      <chain-of-thought [open]="true">
        <chain-of-thought-header>Searching for examples</chain-of-thought-header>
        <chain-of-thought-content>
          <chain-of-thought-step
            label="Query the documentation"
            description="Searched for 'compound components'"
            status="complete"
          >
            <chain-of-thought-search-results>
              <chain-of-thought-search-result>radix-ui · primitives</chain-of-thought-search-result>
              <chain-of-thought-search-result>React docs · forwardRef</chain-of-thought-search-result>
              <chain-of-thought-search-result>shadcn · slot pattern</chain-of-thought-search-result>
            </chain-of-thought-search-results>
          </chain-of-thought-step>
          <chain-of-thought-step label="Synthesize the response" status="active" />
        </chain-of-thought-content>
      </chain-of-thought>
    `,
  }),
};

/**
 * With image — illustrates how `<chain-of-thought-image>` nests inside a
 * step and supports an optional caption.
 */
export const WithImage: Story = {
  name: 'With image preview',
  render: () => ({
    template: `
      <chain-of-thought [open]="true">
        <chain-of-thought-header>Analyzing the screenshot</chain-of-thought-header>
        <chain-of-thought-content>
          <chain-of-thought-step
            label="Inspecting the diagram"
            description="Comparing the wiring to the spec"
            status="complete"
          >
            <chain-of-thought-image caption="System diagram (annotated)">
              <div class="flex h-32 w-full items-center justify-center bg-gradient-to-br from-brand-400 to-brand-700 text-xs text-white">
                [placeholder image]
              </div>
            </chain-of-thought-image>
          </chain-of-thought-step>
        </chain-of-thought-content>
      </chain-of-thought>
    `,
  }),
};

export const StatusVariants: Story = {
  name: 'Step status variants',
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <chain-of-thought [open]="true">
        <chain-of-thought-header>Step status palette</chain-of-thought-header>
        <chain-of-thought-content>
          <chain-of-thought-step label="Complete step (muted text)" status="complete" />
          <chain-of-thought-step label="Active step (foreground)" status="active" />
          <chain-of-thought-step label="Pending step (dimmed)" status="pending" />
        </chain-of-thought-content>
      </chain-of-thought>
    `,
  }),
};
