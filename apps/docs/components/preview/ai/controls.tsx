'use client';

import '@xyflow/react/dist/style.css';

import { Canvas, Controls } from '@gremorie/rx-ai';
import {
  type Edge as FlowEdge,
  type Node as FlowNode,
  ReactFlowProvider,
} from '@xyflow/react';

const gridNodes: FlowNode[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'A' } },
  { id: '2', position: { x: 200, y: 80 }, data: { label: 'B' } },
];
const gridEdges: FlowEdge[] = [{ id: 'e1-2', source: '1', target: '2' }];

export function ControlsPreview() {
  return (
    <div className="h-[360px] w-full">
      <ReactFlowProvider>
        <Canvas edges={gridEdges} nodes={gridNodes}>
          <Controls />
        </Canvas>
      </ReactFlowProvider>
    </div>
  );
}
