'use client';

import '@xyflow/react/dist/style.css';

import { Canvas, Connection } from '@gremorie/rx-ai';
import { type Node as FlowNode, ReactFlowProvider } from '@xyflow/react';

const connectionNodes: FlowNode[] = [
  { id: '1', position: { x: 0, y: 80 }, data: { label: 'Drag from me' } },
  { id: '2', position: { x: 300, y: 0 }, data: { label: 'Drop here' } },
];

export function ConnectionPreview() {
  return (
    <div className="h-[360px] w-full">
      <ReactFlowProvider>
        <Canvas
          connectionLineComponent={Connection}
          edges={[]}
          nodes={connectionNodes}
        />
      </ReactFlowProvider>
    </div>
  );
}
