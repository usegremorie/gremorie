"use client";

import {
  AspectRatio,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  Stack,
} from "@gremorie/rx-containers";

// ---------- AspectRatio ----------

export function AspectRatioPreview() {
  return (
    <div className="max-w-md">
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          16 : 9
        </div>
      </AspectRatio>
    </div>
  );
}

// ---------- ScrollArea ----------

const TAGS = Array.from({ length: 40 }).map((_, i) => `Tag ${i + 1}`);

export function ScrollAreaPreview() {
  return (
    <ScrollArea className="h-48 w-full max-w-sm rounded-md border p-4">
      <div className="flex flex-col gap-2">
        {TAGS.map((t) => (
          <div key={t} className="text-sm">
            {t}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

// ---------- Resizable ----------

export function ResizablePreview() {
  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="min-h-[200px] max-w-md rounded-lg border"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6 text-sm">
          Panel A
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex h-full items-center justify-center p-6 text-sm">
          Panel B
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

// ---------- Stack ----------

export function StackPreview() {
  return (
    <Stack gap="md" className="max-w-sm">
      <div className="rounded-md border p-3 text-sm">Item one</div>
      <div className="rounded-md border p-3 text-sm">Item two</div>
      <div className="rounded-md border p-3 text-sm">Item three</div>
    </Stack>
  );
}
