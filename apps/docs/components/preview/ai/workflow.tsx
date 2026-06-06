'use client';

// The Canvas component imports this internally, but the Toolbar preview below
// renders a bare ReactFlow without Canvas, so pull the flow styles in here too
// to guarantee they load on every workflow doc page.
import '@xyflow/react/dist/style.css';

import {
  Canvas,
  Connection,
  Controls,
  Edge,
  Node,
  NodeAction,
  NodeContent,
  NodeDescription,
  NodeFooter,
  NodeHeader,
  NodeTitle,
  Panel,
  Toolbar,
} from '@gremorie/rx-ai';
import { Button } from '@gremorie/rx-forms';
import {
  type Edge as FlowEdge,
  type EdgeTypes,
  type Node as FlowNode,
  type NodeProps,
  type NodeTypes,
  Position,
  ReactFlow,
  ReactFlowProvider,
} from '@xyflow/react';
import {
  Bold,
  Italic,
  MoreHorizontalIcon,
  PlusIcon,
  SparklesIcon,
  Underline,
} from 'lucide-react';
import type { ReactNode } from 'react';

// A small two-node grid reused by the Controls and Panel previews.
const gridNodes: FlowNode[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'A' } },
  { id: '2', position: { x: 200, y: 80 }, data: { label: 'B' } },
];
const gridEdges: FlowEdge[] = [{ id: 'e1-2', source: '1', target: '2' }];

// ---------- Node ----------

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

// ---------- Edge ----------

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

// ---------- Canvas ----------

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

// ---------- Connection ----------

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

// ---------- Controls ----------

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

// ---------- Panel ----------

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

// ---------- Toolbar ----------

const ToolbarNode = ({ id, data }: NodeProps) => (
  <>
    <Toolbar isVisible nodeId={id} position={Position.Bottom}>
      {(data as { toolbar: ReactNode }).toolbar}
    </Toolbar>
    <div className="rounded-md border bg-background px-6 py-3 text-sm">
      Node
    </div>
  </>
);

const toolbarNodeTypes: NodeTypes = { toolbarNode: ToolbarNode };

export function ToolbarPreview() {
  return (
    <div className="h-[220px] w-full">
      <ReactFlow
        edges={[]}
        fitView
        nodeTypes={toolbarNodeTypes}
        nodes={[
          {
            id: '1',
            type: 'toolbarNode',
            position: { x: 110, y: 70 },
            data: {
              toolbar: (
                <div
                  aria-label="Formatting"
                  className="flex items-center gap-1"
                  role="group"
                >
                  <Button aria-label="Bold" size="icon-sm" variant="ghost">
                    <Bold aria-hidden="true" className="size-4" />
                  </Button>
                  <Button aria-label="Italic" size="icon-sm" variant="ghost">
                    <Italic aria-hidden="true" className="size-4" />
                  </Button>
                  <Button aria-label="Underline" size="icon-sm" variant="ghost">
                    <Underline aria-hidden="true" className="size-4" />
                  </Button>
                </div>
              ),
            },
          },
        ]}
        nodesConnectable={false}
        nodesDraggable={false}
        panOnDrag={false}
        proOptions={{ hideAttribution: true }}
        zoomOnScroll={false}
      />
    </div>
  );
}
