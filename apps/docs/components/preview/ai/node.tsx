'use client';

import '@xyflow/react/dist/style.css';

import {
  Canvas,
  Controls,
  Node,
  NodeAction,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
} from '@gremorie/rx-ai';
import { Button } from '@gremorie/rx-forms';
import {
  type Edge as FlowEdge,
  type Node as FlowNode,
  type NodeProps,
  type NodeTypes,
  ReactFlowProvider,
} from '@xyflow/react';
import { MoreHorizontalIcon } from 'lucide-react';

type AgentNodeData = {
  title: string;
  description: string;
  body: string;
  source: boolean;
  target: boolean;
};

const AgentNode = ({ data }: NodeProps) => {
  const { title, description, body, source, target } = data as AgentNodeData;
  return (
    <Node handles={{ source, target }}>
      <NodeHeader>
        <NodeTitle>{title}</NodeTitle>
        <NodeDescription>{description}</NodeDescription>
        <NodeAction>
          <Button aria-label="Node actions" size="icon" variant="ghost">
            <MoreHorizontalIcon className="size-4" />
          </Button>
        </NodeAction>
      </NodeHeader>
      <NodeContent>
        <p className="text-muted-foreground text-sm">{body}</p>
      </NodeContent>
      <NodeFooter>
        <span className="text-muted-foreground text-xs">Ready</span>
      </NodeFooter>
    </Node>
  );
};

const agentNodeTypes: NodeTypes = { agent: AgentNode };

const agentNodes: FlowNode[] = [
  {
    id: '1',
    type: 'agent',
    position: { x: 0, y: 0 },
    data: {
      title: 'Plan',
      description: 'Break the task into steps',
      body: 'Decompose the request and outline the actions to take.',
      source: true,
      target: false,
    },
  },
  {
    id: '2',
    type: 'agent',
    position: { x: 360, y: 0 },
    data: {
      title: 'Execute',
      description: 'Run the planned tools',
      body: 'Call each tool in order and collect the results.',
      source: false,
      target: true,
    },
  },
];

const agentEdges: FlowEdge[] = [{ id: 'e1-2', source: '1', target: '2' }];

export function NodePreview() {
  return (
    <div className="h-[360px] w-full">
      <ReactFlowProvider>
        <Canvas
          edges={agentEdges}
          nodeTypes={agentNodeTypes}
          nodes={agentNodes}
        >
          <Controls />
        </Canvas>
      </ReactFlowProvider>
    </div>
  );
}
