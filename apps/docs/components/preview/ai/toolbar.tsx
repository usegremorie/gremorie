'use client';

import '@xyflow/react/dist/style.css';

import { Toolbar } from '@gremorie/rx-ai';
import { Button } from '@gremorie/rx-forms';
import {
  type NodeProps,
  type NodeTypes,
  Position,
  ReactFlow,
} from '@xyflow/react';
import { Bold, Italic, Underline } from 'lucide-react';
import type { ReactNode } from 'react';

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
