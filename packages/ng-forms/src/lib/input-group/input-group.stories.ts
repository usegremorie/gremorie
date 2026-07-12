import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './input-group';

/**
 * InputGroup — layout primitive composing an Input or Textarea with inline
 * addons (icons, buttons, kbd hints). Angular parity port of React `InputGroup`
 * from `@gremorie/rx-forms`. Pure layout — focus / invalid / disabled styling
 * is driven from the inner control via Tailwind `has-[…]` selectors, so addons
 * style themselves automatically.
 */
const meta: Meta<InputGroup> = {
  title: 'Inputs/Text/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        InputGroup,
        InputGroupAddon,
        InputGroupButton,
        InputGroupInput,
        InputGroupText,
        InputGroupTextarea,
      ],
    }),
  ],
};

export default meta;
type Story = StoryObj<InputGroup>;

/** Interactive workbench — an input with a leading text addon and trailing button. */
export const Workbench: Story = {
  parameters: { layout: 'padded' },
  render: () => ({
    template: `
      <gr-input-group class="w-80">
        <gr-input-group-addon>
          <gr-input-group-text>https://</gr-input-group-text>
        </gr-input-group-addon>
        <gr-input-group-input placeholder="example.com" />
        <gr-input-group-addon align="inline-end">
          <gr-input-group-button>Save</gr-input-group-button>
        </gr-input-group-addon>
      </gr-input-group>
    `,
  }),
};

/** Search field with a leading icon addon. */
export const WithIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gr-input-group class="w-80">
        <gr-input-group-addon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
        </gr-input-group-addon>
        <gr-input-group-input placeholder="Search…" />
      </gr-input-group>
    `,
  }),
};

/** Textarea with a block-end addon row. */
export const WithTextarea: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gr-input-group class="w-96">
        <gr-input-group-textarea placeholder="Write a message…" />
        <gr-input-group-addon align="block-end" class="border-t">
          <gr-input-group-button size="sm" variant="default">Send</gr-input-group-button>
        </gr-input-group-addon>
      </gr-input-group>
    `,
  }),
};

/** Disabled control dims the whole group. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gr-input-group class="w-80">
        <gr-input-group-addon>
          <gr-input-group-text>@</gr-input-group-text>
        </gr-input-group-addon>
        <gr-input-group-input placeholder="username" [disabled]="true" />
      </gr-input-group>
    `,
  }),
};
