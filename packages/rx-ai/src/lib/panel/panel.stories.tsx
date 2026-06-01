import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@gremorie/rx-forms';
import {
  type Edge as FlowEdge,
  type Node as FlowNode,
  ReactFlowProvider,
} from '@xyflow/react';
import { PlusIcon, SparklesIcon } from 'lucide-react';

import { Canvas } from '../canvas';
import { Panel } from './panel';

/**
 * # Panel
 *
 * A faithful port of the Vercel AI Elements **Panel** — a restyled wrapper
 * around React Flow's `Panel` for floating toolbars, legends or action clusters
 * pinned to a corner of the canvas viewport. It applies the design system card
 * surface with a border, rounded corners and a small inset.
 *
 * Render it as a child of `Canvas` and choose a corner with `position`.
 *
 * ## Anatomy
 *
 * - **Panel** — a bordered card container docked in the viewport; fill it with
 *   any toolbar / legend content.
 *
 * ## Props
 *
 * | Prop | Type | Default | Description |
 * | --- | --- | --- | --- |
 * | `position` | `PanelPosition` | `"top-left"` | Docking corner (e.g. `"top-right"`, `"bottom-center"`). |
 * | `className` | `string` | — | Extra classes merged onto the container. |
 * | `children` | `ReactNode` | — | Panel contents. |
 *
 * ## Variables (design tokens)
 *
 * | Token | Used for |
 * | --- | --- |
 * | `--card` | Panel background. |
 * | `--border` | Panel border. |
 */
const meta = {
  title: 'AI/Panel',
  component: Panel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

const nodes: FlowNode[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'A' } },
  { id: '2', position: { x: 200, y: 80 }, data: { label: 'B' } },
];

const edges: FlowEdge[] = [{ id: 'e1-2', source: '1', target: '2' }];

/** A top-right toolbar panel with two actions. */
export const Default: Story = {
  render: () => (
    <div style={{ width: 600, height: 360 }}>
      <ReactFlowProvider>
        <Canvas edges={edges} nodes={nodes}>
          <Panel position="top-right">
            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost">
                <PlusIcon className="size-4" />
                Add node
              </Button>
              <Button size="sm" variant="ghost">
                <SparklesIcon className="size-4" />
                Auto-layout
              </Button>
            </div>
          </Panel>
        </Canvas>
      </ReactFlowProvider>
    </div>
  ),
};

/** A bottom-center legend panel. */
export const Legend: Story = {
  render: () => (
    <div style={{ width: 600, height: 360 }}>
      <ReactFlowProvider>
        <Canvas edges={edges} nodes={nodes}>
          <Panel position="bottom-center">
            <span className="px-2 text-muted-foreground text-xs">
              Scroll to pan · pinch to zoom
            </span>
          </Panel>
        </Canvas>
      </ReactFlowProvider>
    </div>
  ),
};
