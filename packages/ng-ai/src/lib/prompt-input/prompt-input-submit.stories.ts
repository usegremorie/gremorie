import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { PromptInput } from './prompt-input';
import { PromptInputSubmit } from './prompt-input-submit';
import { PromptInputState } from './prompt-input.types';

const STATES: PromptInputState[] = ['ready', 'submitted', 'streaming', 'error'];

const meta: Meta<PromptInputSubmit> = {
  title: 'AI/Chatbot/PromptInput/Submit',
  component: PromptInputSubmit,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [PromptInput] })],
  argTypes: {
    disabled: { control: 'boolean' },
  },
  args: {
    disabled: false,
  },
  render: (args) => ({
    props: { ...args, states: STATES },
    template: `
      <div style="display:flex; gap:1rem; flex-wrap:wrap;">
        @for (state of states; track state) {
          <div style="display:flex; flex-direction:column; gap:.25rem; align-items:flex-start;">
            <span style="font-size:11px; color:var(--muted-foreground); text-transform:uppercase; letter-spacing:.05em;">{{ state }}</span>
            <prompt-input [state]="state" [value]="'hello'" style="padding: 0; border: 0;">
              <prompt-input-submit [disabled]="disabled" />
            </prompt-input>
          </div>
        }
      </div>
    `,
  }),
};

export default meta;
type Story = StoryObj<PromptInputSubmit>;

export const AllStates: Story = { name: 'All 4 states side-by-side' };
export const Disabled: Story = { args: { disabled: true } };
