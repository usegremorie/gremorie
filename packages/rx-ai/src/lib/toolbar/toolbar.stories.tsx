import type { Meta, StoryObj } from '@storybook/react';
import {
  type NodeProps,
  type NodeTypes,
  Position,
  ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from 'lucide-react';
import type { ReactNode } from 'react';

import { Toolbar } from './toolbar';

/**
 * Toolbar - node action row (React edition).
 *
 * IMPORTANT - API divergence from ng-ai: the React `Toolbar` wraps
 * `@xyflow/react`'s `NodeToolbar`, so it only renders attached to a node
 * inside a `ReactFlow` host (the ng-ai `Toolbar` is a standalone action
 * row). There are no `ToolbarButton` / `ToolbarGroup` exports in React, so
 * the stories project plain buttons into `Toolbar` while mirroring the same
 * anatomy the Angular stories cover (plain row, group, pressed, disabled,
 * vertical). Each story renders the toolbar pinned to a single node with
 * `isVisible` forced on.
 */

const iconBtn =
  'inline-flex size-7 items-center justify-center rounded-sm text-sm hover:bg-accent hover:text-accent-foreground';

/** Custom node whose body is supplied per-story; the Toolbar pins to it. */
type ToolbarNodeData = { toolbar: ReactNode };

const ToolbarNode = ({ id, data }: NodeProps) => (
  <>
    <Toolbar nodeId={id} isVisible position={Position.Bottom}>
      {(data as ToolbarNodeData).toolbar}
    </Toolbar>
    <div className="rounded-md border bg-background px-6 py-3 text-sm">
      Node
    </div>
  </>
);

const nodeTypes: NodeTypes = { toolbarNode: ToolbarNode };

/** Host the toolbar node in a fixed-size, non-interactive ReactFlow canvas. */
const FlowHost = ({ toolbar }: { toolbar: ReactNode }) => (
  <div style={{ width: 360, height: 220 }}>
    <ReactFlow
      nodeTypes={nodeTypes}
      nodes={[
        {
          id: '1',
          type: 'toolbarNode',
          position: { x: 110, y: 70 },
          data: { toolbar },
        },
      ]}
      edges={[]}
      fitView
      nodesDraggable={false}
      nodesConnectable={false}
      panOnDrag={false}
      zoomOnScroll={false}
      proOptions={{ hideAttribution: true }}
    />
  </div>
);

const meta = {
  title: 'AI/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: { layout: 'centered', controls: { disable: true } },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FlowHost
      toolbar={
        <>
          <button type="button" className={iconBtn} aria-label="Bold">
            <Bold className="size-4" aria-hidden="true" />
          </button>
          <button type="button" className={iconBtn} aria-label="Italic">
            <Italic className="size-4" aria-hidden="true" />
          </button>
          <button type="button" className={iconBtn} aria-label="Underline">
            <Underline className="size-4" aria-hidden="true" />
          </button>
        </>
      }
    />
  ),
};

export const WithGroup: Story = {
  name: 'With group',
  render: () => (
    <FlowHost
      toolbar={
        <div
          className="flex items-center gap-1"
          role="group"
          aria-label="Formatting"
        >
          <button type="button" className={iconBtn} aria-label="Bold">
            <span className="font-bold">B</span>
          </button>
          <button type="button" className={iconBtn} aria-label="Italic">
            <span className="italic">I</span>
          </button>
          <button type="button" className={iconBtn} aria-label="Underline">
            <span className="underline">U</span>
          </button>
        </div>
      }
    />
  ),
};

export const Pressed: Story = {
  name: 'With pressed state',
  render: () => (
    <FlowHost
      toolbar={
        <>
          <button
            type="button"
            aria-pressed={true}
            aria-label="Bold (on)"
            className={`${iconBtn} bg-accent text-accent-foreground`}
          >
            <span className="font-bold">B</span>
          </button>
          <button
            type="button"
            aria-pressed={false}
            className={iconBtn}
            aria-label="Italic"
          >
            <span className="italic">I</span>
          </button>
          <button
            type="button"
            aria-pressed={false}
            className={iconBtn}
            aria-label="Underline"
          >
            <span className="underline">U</span>
          </button>
        </>
      }
    />
  ),
};

export const Disabled: Story = {
  render: () => (
    <FlowHost
      toolbar={
        <>
          <button type="button" className={iconBtn} aria-label="Bold">
            <span className="font-bold">B</span>
          </button>
          <button
            type="button"
            disabled
            aria-label="Italic (disabled)"
            className={`${iconBtn} opacity-50`}
          >
            <span className="italic">I</span>
          </button>
          <button type="button" className={iconBtn} aria-label="Underline">
            <span className="underline">U</span>
          </button>
        </>
      }
    />
  ),
};

export const VerticalGroup: Story = {
  name: 'Vertical group',
  render: () => (
    <FlowHost
      toolbar={
        <div
          className="flex flex-col items-start gap-1"
          role="group"
          aria-label="Alignment"
        >
          <button type="button" className={iconBtn} aria-label="Align left">
            <AlignLeft className="size-4" aria-hidden="true" />
          </button>
          <button type="button" className={iconBtn} aria-label="Align center">
            <AlignCenter className="size-4" aria-hidden="true" />
          </button>
          <button type="button" className={iconBtn} aria-label="Align right">
            <AlignRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      }
    />
  ),
};
