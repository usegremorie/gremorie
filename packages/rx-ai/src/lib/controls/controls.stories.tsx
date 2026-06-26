import type { Meta, StoryObj } from '@storybook/react';
import {
  type Edge as FlowEdge,
  type Node as FlowNode,
  ReactFlowProvider,
} from '@xyflow/react';

import { Canvas } from '../canvas';
import { Controls } from './controls';

/**
 * # Controls
 *
 * A faithful port of the Vercel AI Elements **Controls** — a restyled wrapper
 * around React Flow's `Controls` (zoom in / out, fit-view, interactivity lock).
 * It applies the design system card surface, rounded buttons and a subtle
 * hover state so the control cluster matches the rest of the canvas chrome.
 *
 * Render it as a child of `Canvas`; it docks itself inside the flow viewport.
 *
 * ## Anatomy
 *
 * - **Controls** — the floating button group: zoom-in, zoom-out, fit-view and a
 *   lock toggle, wrapped in a bordered card surface.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `showZoom` | `boolean` | `true` | Show the zoom in/out buttons. |
 * | `showFitView` | `boolean` | `true` | Show the fit-view button. |
 * | `showInteractive` | `boolean` | `true` | Show the interactivity lock. |
 * | `position` | `PanelPosition` | `"bottom-left"` | Docking corner. |
 * | `className` | `string` | — | Extra classes merged onto the cluster. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--card` | Control cluster background. |
 * | `--border` | Cluster border. |
 * | `--secondary` | Button hover background. |
 *
 * ## Anatomy
 *
 * ```text
 * Controls   zoom · fit-view · interactivity cluster — leaf (inside Canvas)
 * ```
 */
const meta = {
  title: 'AI/Workflow/Controls',
  component: Controls,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Controls>;

export default meta;
type Story = StoryObj<typeof meta>;

const nodes: FlowNode[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'A' } },
  { id: '2', position: { x: 200, y: 80 }, data: { label: 'B' } },
];

const edges: FlowEdge[] = [{ id: 'e1-2', source: '1', target: '2' }];

/** Controls docked in the canvas — use the buttons to zoom and fit. */
export const Default: Story = {
  render: () => (
    <div style={{ width: 600, height: 360 }}>
      <ReactFlowProvider>
        <Canvas edges={edges} nodes={nodes}>
          <Controls />
        </Canvas>
      </ReactFlowProvider>
    </div>
  ),
};

/** Zoom-only — fit-view and interactivity lock hidden. */
export const ZoomOnly: Story = {
  render: () => (
    <div style={{ width: 600, height: 360 }}>
      <ReactFlowProvider>
        <Canvas edges={edges} nodes={nodes}>
          <Controls showFitView={false} showInteractive={false} />
        </Canvas>
      </ReactFlowProvider>
    </div>
  ),
};
