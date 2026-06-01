import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@gremorie/rx-forms';
import {
  type Edge as FlowEdge,
  type Node as FlowNode,
  type NodeProps as FlowNodeProps,
  type NodeTypes,
  ReactFlowProvider,
} from '@xyflow/react';
import { MoreHorizontalIcon } from 'lucide-react';

import { Canvas } from '../canvas';
import {
  Node,
  NodeAction,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from './node';

/**
 * # Node
 *
 * A faithful port of the Vercel AI Elements **Node** primitive — a styled
 * card used as a custom React Flow node. It composes the design system `Card`
 * with target/source handles and ergonomic sub-slots for a header, body and
 * footer, so agent steps and workflow blocks share one consistent look.
 *
 * Custom nodes are registered through React Flow's `nodeTypes` map and rendered
 * by the `Canvas`. The stories wrap everything in a fixed-size container.
 *
 * ## Anatomy
 *
 * - **Node** — the card shell. `handles` toggles the left/right connection
 *   handles (`target` / `source`).
 * - **NodeHeader** — top band (secondary background, bottom border).
 * - **NodeTitle** / **NodeDescription** — heading text inside the header.
 * - **NodeAction** — top-right action slot (e.g. a menu button).
 * - **NodeContent** — the body region.
 * - **NodeFooter** — bottom band (secondary background, top border).
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `handles` | `{ target: boolean; source: boolean }` | — | Which connection handles to render. |
 * | `className` | `string` | — | Extra classes merged onto the card. |
 * | `...CardProps` | `ComponentProps<typeof Card>` | — | Forwarded to the underlying `Card`. |
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `NodeHeader` | Header band with secondary background. |
 * | `NodeTitle` | Heading text. |
 * | `NodeDescription` | Muted sub-heading text. |
 * | `NodeAction` | Top-right action slot. |
 * | `NodeContent` | Body region. |
 * | `NodeFooter` | Footer band with secondary background. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--secondary` | Header / footer band background. |
 * | `--border` | Header bottom / footer top divider. |
 * | `--sidebar` | Canvas background behind the node. |
 */
const meta = {
  title: 'AI/Node',
  component: Node,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { handles: { source: false, target: false } },
} satisfies Meta<typeof Node>;

export default meta;
type Story = StoryObj<typeof meta>;

const AgentNode = ({ data }: FlowNodeProps) => {
  const { title, description, body, source, target } = data as {
    title: string;
    description: string;
    body: string;
    source: boolean;
    target: boolean;
  };

  return (
    <Node handles={{ source, target }}>
      <NodeHeader>
        <NodeTitle>{title}</NodeTitle>
        <NodeDescription>{description}</NodeDescription>
        <NodeAction>
          <Button size="icon" variant="ghost">
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </NodeAction>
      </NodeHeader>
      <NodeContent>
        <p className="text-muted-foreground text-sm">{body}</p>
      </NodeContent>
      <NodeFooter>
        <span className="text-muted-foreground text-xs">Ready</span>
      </NodeFooter>
    </Node>
  );
};

const nodeTypes: NodeTypes = { agent: AgentNode };

const nodes: FlowNode[] = [
  {
    id: '1',
    type: 'agent',
    position: { x: 0, y: 0 },
    data: {
      title: 'Plan',
      description: 'Break the task into steps',
      body: 'Decompose the request and outline the actions to take.',
      source: true,
      target: false,
    },
  },
  {
    id: '2',
    type: 'agent',
    position: { x: 360, y: 0 },
    data: {
      title: 'Execute',
      description: 'Run the planned tools',
      body: 'Call each tool in order and collect the results.',
      source: false,
      target: true,
    },
  },
];

const edges: FlowEdge[] = [{ id: 'e1-2', source: '1', target: '2' }];

/** Two custom `agent` nodes connected by an edge inside a canvas. */
export const Default: Story = {
  render: () => (
    <div style={{ width: 760, height: 360 }}>
      <ReactFlowProvider>
        <Canvas edges={edges} nodes={nodes} nodeTypes={nodeTypes} />
      </ReactFlowProvider>
    </div>
  ),
};

/** A single node rendered standalone to inspect the full anatomy. */
export const Anatomy: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <div className="w-sm">
      <Node handles={{ source: false, target: false }}>
        <NodeHeader>
          <NodeTitle>Summarize document</NodeTitle>
          <NodeDescription>gpt-4o · 1.2k tokens</NodeDescription>
          <NodeAction>
            <Button size="icon" variant="ghost">
              <MoreHorizontalIcon className="size-4" />
            </Button>
          </NodeAction>
        </NodeHeader>
        <NodeContent>
          <p className="text-muted-foreground text-sm">
            Produce a three-sentence summary of the attached PDF and extract any
            action items.
          </p>
        </NodeContent>
        <NodeFooter>
          <span className="text-muted-foreground text-xs">Completed in 4s</span>
        </NodeFooter>
      </Node>
    </div>
  ),
};
