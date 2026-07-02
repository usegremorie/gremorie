import { Button } from '@gremorie/rx-forms';
import type { Meta, StoryObj } from '@storybook/react';
import {
  type NodeProps,
  type NodeTypes,
  Position,
  ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Bold, Italic, Underline } from 'lucide-react';
import type { ReactNode } from 'react';

import { Toolbar } from './toolbar';

/**
 * Toolbar - a floating node action row (React edition). It wraps
 * `@xyflow/react`'s `NodeToolbar`, so it only renders attached to a node inside
 * a `ReactFlow` host. Project the action buttons as children; here they compose
 * from the Gremorie `Button` (ghost, icon-sm) from `@gremorie/rx-forms`.
 */

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

/**
 * Toolbar - floating action toolbar for a workflow node (React edition).
 *
 * ## Anatomy
 *
 * ```text
 * Toolbar   node action toolbar — leaf primitive (rendered on a Canvas node)
 * ```
 */
const meta = {
  title: 'AI/Workflow/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: { layout: 'padded', controls: { disable: true } },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default - the toolbar pinned to a node, holding a group of formatting
 * actions composed from the Gremorie Button.
 */
export const Default: Story = {
  render: () => (
    <FlowHost
      toolbar={
        <div
          className="flex items-center gap-1"
          role="group"
          aria-label="Formatting"
        >
          <Button aria-label="Bold" size="icon-sm" variant="ghost">
            <Bold className="size-4" aria-hidden="true" />
          </Button>
          <Button aria-label="Italic" size="icon-sm" variant="ghost">
            <Italic className="size-4" aria-hidden="true" />
          </Button>
          <Button aria-label="Underline" size="icon-sm" variant="ghost">
            <Underline className="size-4" aria-hidden="true" />
          </Button>
        </div>
      }
    />
  ),
};
