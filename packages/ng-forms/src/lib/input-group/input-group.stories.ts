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
      <gn-input-group class="w-80">
        <gn-input-group-addon>
          <gn-input-group-text>https://</gn-input-group-text>
        </gn-input-group-addon>
        <gn-input-group-input placeholder="example.com" />
        <gn-input-group-addon align="inline-end">
          <gn-input-group-button>Save</gn-input-group-button>
        </gn-input-group-addon>
      </gn-input-group>
    `,
  }),
};

/** Search field with a leading icon addon. */
export const WithIcon: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-input-group class="w-80">
        <gn-input-group-addon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
        </gn-input-group-addon>
        <gn-input-group-input placeholder="Search…" />
      </gn-input-group>
    `,
  }),
};

/** Textarea with a block-end addon row. */
export const WithTextarea: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-input-group class="w-96">
        <gn-input-group-textarea placeholder="Write a message…" />
        <gn-input-group-addon align="block-end" class="border-t">
          <gn-input-group-button size="sm" variant="default">Send</gn-input-group-button>
        </gn-input-group-addon>
      </gn-input-group>
    `,
  }),
};

/** Disabled control dims the whole group. */
export const Disabled: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <gn-input-group class="w-80">
        <gn-input-group-addon>
          <gn-input-group-text>@</gn-input-group-text>
        </gn-input-group-addon>
        <gn-input-group-input placeholder="username" [disabled]="true" />
      </gn-input-group>
    `,
  }),
};
