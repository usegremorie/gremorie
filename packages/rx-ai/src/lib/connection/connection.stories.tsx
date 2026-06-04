import type { Meta, StoryObj } from '@storybook/react';
import {
  type Edge as FlowEdge,
  type Node as FlowNode,
  ReactFlowProvider,
} from '@xyflow/react';

import { Canvas } from '../canvas';
import { Connection } from './connection';

/**
 * # Connection
 *
 * A faithful port of the Vercel AI Elements **Connection** line — the bezier
 * curve React Flow draws while the user is dragging a new edge between two
 * handles. It renders a ring-colored animated path ending in a small white
 * dot at the cursor.
 *
 * It is a `ConnectionLineComponent`: pass it to a `Canvas` via the
 * `connectionLineComponent` prop. To see it live, drag from a node's source
 * handle in the story below. (Nodes here are draggable/connectable so the
 * provisional line appears mid-drag.)
 *
 * ## Anatomy
 *
 * - **Connection** — an SVG `<g>` containing the animated bezier `<path>` and a
 *   terminating `<circle>` at the drag target.
 *
 * ## Props
 *
 * Receives React Flow's `ConnectionLineComponentProps`
 * (`fromX`, `fromY`, `toX`, `toY`, plus connection metadata). You do not render
 * it directly — supply it as `Canvas`'s `connectionLineComponent`.
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--color-ring` | Stroke of the provisional connection line and dot. |
 */
const meta = {
  title: 'AI/Workflow/Connection',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const nodes: FlowNode[] = [
  { id: '1', position: { x: 0, y: 80 }, data: { label: 'Drag from me' } },
  { id: '2', position: { x: 300, y: 0 }, data: { label: 'Drop here' } },
];

const edges: FlowEdge[] = [];

/**
 * Drag from a node handle to draw a new edge — the custom `Connection` line
 * follows the cursor while dragging.
 */
export const Default: Story = {
  render: () => (
    <div style={{ width: 600, height: 360 }}>
      <ReactFlowProvider>
        <Canvas
          connectionLineComponent={Connection}
          edges={edges}
          nodes={nodes}
        />
      </ReactFlowProvider>
    </div>
  ),
};
