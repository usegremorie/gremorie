import type { Meta, StoryObj } from '@storybook/react';
import {
  type Edge as FlowEdge,
  type EdgeTypes,
  type Node as FlowNode,
  MarkerType,
  ReactFlowProvider,
} from '@xyflow/react';

import { Canvas } from '../canvas';
import { Edge } from './edge';

/**
 * # Edge
 *
 * A faithful port of the Vercel AI Elements **Edge** primitives — custom React
 * Flow edge renderers. Two variants ship:
 *
 * - **`Edge.Temporary`** — a dashed, ring-colored simple bezier, used for edges
 *   being drawn or in a provisional state.
 * - **`Edge.Animated`** — a solid bezier with a primary-colored dot that travels
 *   along the path, used to signal an active / streaming connection.
 *
 * Custom edges are registered through React Flow's `edgeTypes` map; an edge in
 * the `edges` array selects a renderer via its `type`.
 *
 * ## Anatomy
 *
 * - **Edge.Temporary** — `BaseEdge` with `strokeDasharray="5, 5"` along a
 *   `getSimpleBezierPath`.
 * - **Edge.Animated** — `BaseEdge` along a `getBezierPath` plus an
 *   `animateMotion` circle traversing the same path.
 *
 * ## Props
 *
 * Both renderers receive React Flow's standard `EdgeProps`
 * (`id`, `source`, `target`, `sourceX/Y`, `targetX/Y`, `markerEnd`, `style`, …).
 * You do not call them directly — register them in `edgeTypes` and set each
 * edge's `type`.
 *
 * ## Subcomponents
 *
 * | Component | Description |
 * | --- | --- |
 * | `Edge.Temporary` | Dashed provisional edge (simple bezier). |
 * | `Edge.Animated` | Solid edge with a primary dot animating along it. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--ring` | Stroke color of the temporary edge. |
 * | `--primary` | Fill of the animated traveling dot. |
 */
const meta = {
  title: 'AI/Edge',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const edgeTypes: EdgeTypes = {
  temporary: Edge.Temporary,
  animated: Edge.Animated,
};

const nodes: FlowNode[] = [
  { id: 'a', position: { x: 0, y: 60 }, data: { label: 'Source' } },
  { id: 'b', position: { x: 280, y: 0 }, data: { label: 'Target A' } },
  { id: 'c', position: { x: 280, y: 140 }, data: { label: 'Target B' } },
];

const edges: FlowEdge[] = [
  { id: 'a-b', source: 'a', target: 'b', type: 'animated' },
  { id: 'a-c', source: 'a', target: 'c', type: 'temporary' },
];

/** Both edge variants in one graph: animated to the top, temporary to the bottom. */
export const Default: Story = {
  render: () => (
    <div style={{ width: 600, height: 360 }}>
      <ReactFlowProvider>
        <Canvas edges={edges} nodes={nodes} edgeTypes={edgeTypes} />
      </ReactFlowProvider>
    </div>
  ),
};

/** Only the animated edge — watch the primary dot travel along the path. */
export const Animated: Story = {
  render: () => (
    <div style={{ width: 600, height: 360 }}>
      <ReactFlowProvider>
        <Canvas
          edgeTypes={edgeTypes}
          edges={[
            {
              id: 'a-b',
              source: 'a',
              target: 'b',
              type: 'animated',
              markerEnd: { type: MarkerType.ArrowClosed },
            },
          ]}
          nodes={nodes.slice(0, 2)}
        />
      </ReactFlowProvider>
    </div>
  ),
};

/** Only the temporary (dashed) edge. */
export const Temporary: Story = {
  render: () => (
    <div style={{ width: 600, height: 360 }}>
      <ReactFlowProvider>
        <Canvas
          edgeTypes={edgeTypes}
          edges={[{ id: 'a-c', source: 'a', target: 'c', type: 'temporary' }]}
          nodes={[nodes[0], nodes[2]]}
        />
      </ReactFlowProvider>
    </div>
  ),
};
