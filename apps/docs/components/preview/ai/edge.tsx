'use client';

import '@xyflow/react/dist/style.css';

import { Canvas, Edge } from '@gremorie/rx-ai';
import {
  type Edge as FlowEdge,
  type EdgeTypes,
  type Node as FlowNode,
  ReactFlowProvider,
} from '@xyflow/react';

const edgeTypes: EdgeTypes = {
  temporary: Edge.Temporary,
  animated: Edge.Animated,
};

const edgeNodes: FlowNode[] = [
  { id: 'a', position: { x: 0, y: 60 }, data: { label: 'Source' } },
  { id: 'b', position: { x: 280, y: 0 }, data: { label: 'Target A' } },
  { id: 'c', position: { x: 280, y: 140 }, data: { label: 'Target B' } },
];

const edgeEdges: FlowEdge[] = [
  { id: 'a-b', source: 'a', target: 'b', type: 'animated' },
  { id: 'a-c', source: 'a', target: 'c', type: 'temporary' },
];

export function EdgePreview() {
  return (
    <div className="h-[360px] w-full">
      <ReactFlowProvider>
        <Canvas edgeTypes={edgeTypes} edges={edgeEdges} nodes={edgeNodes} />
      </ReactFlowProvider>
    </div>
  );
}
