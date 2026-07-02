'use client';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@gremorie/rx-containers';

export function ResizableVerticalPreview() {
  return (
    <ResizablePanelGroup
      orientation="vertical"
      className="min-h-[220px] max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={70}>
        <div className="flex h-full items-center justify-center p-4 text-sm">
          Editor
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={30} minSize={10}>
        <div className="flex h-full items-center justify-center p-4 text-sm">
          Terminal
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
