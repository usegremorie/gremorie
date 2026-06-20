'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@gremorie/rx-containers';

export function ResizableTwoPanePreview() {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-[180px] max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={30} minSize={15}>
        <div className="flex h-full items-center justify-center p-4 text-sm">
          Files
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center p-4 text-sm">
          Editor
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
