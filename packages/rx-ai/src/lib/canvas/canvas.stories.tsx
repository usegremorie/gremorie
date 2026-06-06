import type { Meta, StoryObj } from '@storybook/react';
import {
  Background,
  type Edge as FlowEdge,
  type Node as FlowNode,
  ReactFlowProvider,
} from '@xyflow/react';

import { Canvas } from './canvas';
import { Controls } from '../controls';
import { Panel } from '../panel';

/**
 * # Canvas
 *
 * A faithful port of the Vercel AI Elements **Canvas** primitive. It wraps
 * `@xyflow/react`'s `ReactFlow` with opinionated defaults (pan on scroll,
 * fit-to-view, themed background) so AI agent graphs, workflow builders and
 * node editors render consistently with the rest of the design system.
 *
 * Because React Flow measures its container, the canvas **must** live inside an
 * element with an explicit width and height. Every story below wraps it in a
 * fixed-size `div`.
 *
 * ## Anatomy
 *
 * - **Canvas** — the `ReactFlow` wrapper. Renders a themed `Background` and
 *   forwards `nodes`, `edges`, `nodeTypes`, `edgeTypes` and every other
 *   `ReactFlowProps`.
 * - **children** — overlays such as `Controls`, `Panel` or a `MiniMap` placed
 *   inside the flow viewport.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `nodes` | `Node[]` | — | The graph nodes (React Flow). |
 * | `edges` | `Edge[]` | — | The graph edges (React Flow). |
 * | `nodeTypes` | `NodeTypes` | — | Map of custom node renderers. |
 * | `edgeTypes` | `EdgeTypes` | — | Map of custom edge renderers. |
 * | `fitView` | `boolean` | `true` | Auto-fit the graph on mount. |
 * | `panOnDrag` | `boolean` | `false` | Pan the viewport by dragging the canvas. |
 * | `panOnScroll` | `boolean` | `true` | Pan the viewport by scrolling. |
 * | `zoomOnDoubleClick` | `boolean` | `false` | Zoom in on double-click. |
 * | `children` | `ReactNode` | — | Overlays rendered inside the viewport. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--sidebar` | Canvas background fill (`bgColor` on `Background`). |
 */
const meta = {
  title: 'AI/Workflow/Canvas',
  component: Canvas,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Canvas>;

export default meta;
type Story = StoryObj<typeof meta>;

const nodes: FlowNode[] = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { label: 'Prompt' },
    type: 'input',
  },
  {
    id: '2',
    position: { x: 220, y: -40 },
    data: { label: 'Retrieve context' },
  },
  {
    id: '3',
    position: { x: 220, y: 80 },
    data: { label: 'Generate answer' },
    type: 'output',
  },
];

const edges: FlowEdge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

/** A small three-node agent graph inside a fixed-size container. */
export const Default: Story = {
  render: () => (
    <div style={{ width: 600, height: 360 }}>
      <ReactFlowProvider>
        <Canvas nodes={nodes} edges={edges} />
      </ReactFlowProvider>
    </div>
  ),
};

/** With `Controls` and a `Panel` overlay docked inside the viewport. */
export const WithOverlays: Story = {
  render: () => (
    <div style={{ width: 600, height: 360 }}>
      <ReactFlowProvider>
        <Canvas nodes={nodes} edges={edges}>
          <Controls />
          <Panel position="top-right">
            <span className="px-2 text-muted-foreground text-xs">
              3 nodes · 2 edges
            </span>
          </Panel>
        </Canvas>
      </ReactFlowProvider>
    </div>
  ),
};

/** A denser background grid via an extra `Background` child. */
export const CustomBackground: Story = {
  render: () => (
    <div style={{ width: 600, height: 360 }}>
      <ReactFlowProvider>
        <Canvas nodes={nodes} edges={edges}>
          <Background gap={16} size={2} />
        </Canvas>
      </ReactFlowProvider>
    </div>
  ),
};
