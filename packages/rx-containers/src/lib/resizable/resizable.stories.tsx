import type { Meta, StoryObj } from '@storybook/react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './resizable';

/**
 * # Resizable
 *
 * Split panes with draggable handles, built on `react-resizable-panels`. Three
 * parts compose: `ResizablePanelGroup` is the frame, `ResizablePanel` claims a
 * flex region, and `ResizableHandle` is the divider. Reach for it in dev tools
 * and pro apps (editors, mail clients, file managers) — consumer surfaces
 * usually read better with fixed proportions.
 *
 * ## Anatomy
 *
 * ```text
 * ResizablePanelGroup        the frame; orientation sets horizontal vs. vertical
 * ├─ ResizablePanel          a region sized by defaultSize / minSize / maxSize (percentages)
 * └─ ResizableHandle         the drag divider; pass withHandle for a visible grip
 * ```
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `direction` (group) | `"horizontal" \| "vertical"` | — | Layout axis. |
 * | `defaultSize` (panel) | `number` | — | Initial size as a percentage. |
 * | `minSize` / `maxSize` (panel) | `number` | — | Clamp the panel size. |
 * | `withHandle` (handle) | `boolean` | `false` | Show the grip affordance. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `ResizablePanel` | A resizable region. |
 * | `ResizableHandle` | The drag divider. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--border` | the handle line + grip background |
 * | `--ring` | focus-visible ring on the handle |
 */
const meta = {
  title: 'Layout & display/Containers/Resizable',
  component: ResizablePanelGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ResizablePanelGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Two side-by-side panels with a visible handle — drag the grip to resize. */
export const Workbench: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-48 w-96 rounded-lg border"
    >
      <ResizablePanel defaultSize={40} minSize={20}>
        <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
          Sidebar
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60}>
        <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
          Content
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

/** Stacked panels along the vertical axis. */
export const Vertical: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="vertical"
      className="h-64 w-80 rounded-lg border"
    >
      <ResizablePanel defaultSize={35}>
        <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
          Header
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={65}>
        <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
          Body
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};

/** Nested groups — a three-pane editor layout. */
export const Nested: Story = {
  render: () => (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-64 w-[28rem] rounded-lg border"
    >
      <ResizablePanel defaultSize={30} minSize={15}>
        <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
          Files
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70}>
            <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
              Editor
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={30}>
            <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
              Terminal
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
};
