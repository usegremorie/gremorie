import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './resizable';

/**
 * Resizable — split panes with draggable handles. Mirrors React
 * `Resizable*` from `@gremorie/rx-containers`.
 *
 * Three parts compose: `ResizablePanelGroup` is the frame
 * (`<gr-resizable-panel-group>`), `ResizablePanel`
 * (`<gr-resizable-panel>`) claims a flex region, and `ResizableHandle`
 * (`<gr-resizable-handle>`) is the divider. Built on `@spartan-ng/brain`'s
 * headless resizable primitives. Reach for it in dev tools and pro apps
 * (editors, mail clients, file managers).
 */
const meta: Meta<ResizablePanelGroup> = {
  title: 'Layout & display/Containers/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    moduleMetadata({
      imports: [ResizablePanelGroup, ResizablePanel, ResizableHandle],
    }),
  ],
};

export default meta;
type Story = StoryObj<ResizablePanelGroup>;

const CELL = 'flex h-full items-center justify-center p-6 text-sm font-medium';

/** Two side-by-side panels with a visible handle — drag the grip to resize. */
export const Workbench: Story = {
  render: () => ({
    template: `
      <gr-resizable-panel-group direction="horizontal" class="h-48 w-96 rounded-lg border">
        <gr-resizable-panel [defaultSize]="40" [minSize]="20">
          <div class="${CELL}">Sidebar</div>
        </gr-resizable-panel>
        <gr-resizable-handle withHandle />
        <gr-resizable-panel [defaultSize]="60">
          <div class="${CELL}">Content</div>
        </gr-resizable-panel>
      </gr-resizable-panel-group>
    `,
  }),
};

/** Stacked panels along the vertical axis. */
export const Vertical: Story = {
  render: () => ({
    template: `
      <gr-resizable-panel-group direction="vertical" class="h-64 w-80 rounded-lg border">
        <gr-resizable-panel [defaultSize]="35">
          <div class="${CELL}">Header</div>
        </gr-resizable-panel>
        <gr-resizable-handle withHandle />
        <gr-resizable-panel [defaultSize]="65">
          <div class="${CELL}">Body</div>
        </gr-resizable-panel>
      </gr-resizable-panel-group>
    `,
  }),
};

/** Nested groups — a three-pane editor layout. */
export const Nested: Story = {
  render: () => ({
    template: `
      <gr-resizable-panel-group direction="horizontal" class="h-64 w-[28rem] rounded-lg border">
        <gr-resizable-panel [defaultSize]="30" [minSize]="15">
          <div class="${CELL}">Files</div>
        </gr-resizable-panel>
        <gr-resizable-handle withHandle />
        <gr-resizable-panel [defaultSize]="70">
          <gr-resizable-panel-group direction="vertical">
            <gr-resizable-panel [defaultSize]="70">
              <div class="${CELL}">Editor</div>
            </gr-resizable-panel>
            <gr-resizable-handle withHandle />
            <gr-resizable-panel [defaultSize]="30">
              <div class="${CELL}">Terminal</div>
            </gr-resizable-panel>
          </gr-resizable-panel-group>
        </gr-resizable-panel>
      </gr-resizable-panel-group>
    `,
  }),
};
