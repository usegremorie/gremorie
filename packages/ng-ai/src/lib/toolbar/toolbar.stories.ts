import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import { Toolbar } from './toolbar';
import { ToolbarButton } from './toolbar-button';
import { ToolbarGroup } from './toolbar-group';

/**
 * Toolbar — generic action row. Stories cover: plain row of buttons, a
 * grouped subset, pressed-state (toggle), and a vertical orientation.
 */
const meta: Meta<Toolbar> = {
  title: 'AI/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [Toolbar, ToolbarGroup, ToolbarButton],
    }),
  ],
};

export default meta;
type Story = StoryObj<Toolbar>;

export const Default: Story = {
  render: () => ({
    template: `
      <toolbar>
        <toolbar-button ariaLabel="Bold">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
          </svg>
        </toolbar-button>
        <toolbar-button ariaLabel="Italic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
            <line x1="19" y1="4" x2="10" y2="4"/>
            <line x1="14" y1="20" x2="5" y2="20"/>
            <line x1="15" y1="4" x2="9" y2="20"/>
          </svg>
        </toolbar-button>
        <toolbar-button ariaLabel="Underline">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
            <path d="M6 4v6a6 6 0 0 0 12 0V4"/>
            <line x1="4" y1="20" x2="20" y2="20"/>
          </svg>
        </toolbar-button>
      </toolbar>
    `,
  }),
};

export const WithGroup: Story = {
  name: 'With group',
  render: () => ({
    template: `
      <toolbar>
        <toolbar-group ariaLabel="Formatting">
          <toolbar-button ariaLabel="Bold"><span class="font-bold">B</span></toolbar-button>
          <toolbar-button ariaLabel="Italic"><span class="italic">I</span></toolbar-button>
          <toolbar-button ariaLabel="Underline"><span class="underline">U</span></toolbar-button>
        </toolbar-group>
      </toolbar>
    `,
  }),
};

export const Pressed: Story = {
  name: 'With pressed state',
  render: () => ({
    template: `
      <toolbar>
        <toolbar-button [pressed]="true" ariaLabel="Bold (on)">
          <span class="font-bold">B</span>
        </toolbar-button>
        <toolbar-button [pressed]="false" ariaLabel="Italic">
          <span class="italic">I</span>
        </toolbar-button>
        <toolbar-button [pressed]="false" ariaLabel="Underline">
          <span class="underline">U</span>
        </toolbar-button>
      </toolbar>
    `,
  }),
};

export const Disabled: Story = {
  render: () => ({
    template: `
      <toolbar>
        <toolbar-button ariaLabel="Bold"><span class="font-bold">B</span></toolbar-button>
        <toolbar-button [disabled]="true" ariaLabel="Italic (disabled)">
          <span class="italic">I</span>
        </toolbar-button>
        <toolbar-button ariaLabel="Underline"><span class="underline">U</span></toolbar-button>
      </toolbar>
    `,
  }),
};

export const VerticalGroup: Story = {
  name: 'Vertical group',
  render: () => ({
    template: `
      <toolbar class="flex-col items-start">
        <toolbar-group orientation="vertical" ariaLabel="Alignment">
          <toolbar-button ariaLabel="Align left">L</toolbar-button>
          <toolbar-button ariaLabel="Align center">C</toolbar-button>
          <toolbar-button ariaLabel="Align right">R</toolbar-button>
        </toolbar-group>
      </toolbar>
    `,
  }),
};
