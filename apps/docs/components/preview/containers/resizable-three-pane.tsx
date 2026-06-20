'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@gremorie/rx-containers';

export function ResizableThreePanePreview() {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-[200px] max-w-xl rounded-lg border"
    >
      <ResizablePanel defaultSize={20} minSize={10}>
        <div className="flex h-full items-center justify-center p-4 text-sm">
          Sidebar
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-4 text-sm">
          List
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30}>
        <div className="flex h-full items-center justify-center p-4 text-sm">
          Detail
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
