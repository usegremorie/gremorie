'use client';

import '@xyflow/react/dist/style.css';

import { Canvas, Panel } from '@gremorie/rx-ai';
import { Button } from '@gremorie/rx-forms';
import {
  type Edge as FlowEdge,
  type Node as FlowNode,
  ReactFlowProvider,
} from '@xyflow/react';
import { PlusIcon, SparklesIcon } from 'lucide-react';

const gridNodes: FlowNode[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'A' } },
  { id: '2', position: { x: 200, y: 80 }, data: { label: 'B' } },
];
const gridEdges: FlowEdge[] = [{ id: 'e1-2', source: '1', target: '2' }];

export function PanelPreview() {
  return (
    <div className="h-[360px] w-full">
      <ReactFlowProvider>
        <Canvas edges={gridEdges} nodes={gridNodes}>
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
  );
}
