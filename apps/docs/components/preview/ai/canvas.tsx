'use client';

import '@xyflow/react/dist/style.css';

import { Canvas, Controls, Panel } from '@gremorie/rx-ai';
import {
  type Edge as FlowEdge,
  type Node as FlowNode,
  ReactFlowProvider,
} from '@xyflow/react';

const canvasNodes: FlowNode[] = [
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

const canvasEdges: FlowEdge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

export function CanvasPreview() {
  return (
    <div className="h-[360px] w-full">
      <ReactFlowProvider>
        <Canvas edges={canvasEdges} nodes={canvasNodes}>
          <Controls />
          <Panel position="top-right">
            <span className="px-2 text-muted-foreground text-xs">
              3 nodes · 2 edges
            </span>
          </Panel>
        </Canvas>
      </ReactFlowProvider>
    </div>
  );
}
