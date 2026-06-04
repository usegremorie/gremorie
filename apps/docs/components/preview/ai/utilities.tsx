'use client';

import {
  OpenIn,
  OpenInChatGPT,
  OpenInClaude,
  OpenInContent,
  OpenInCursor,
  OpenInLabel,
  OpenInScira,
  OpenInSeparator,
  OpenInT3,
  OpenInTrigger,
  OpenInv0,
} from '@gremorie/rx-ai';

// ---------- OpenIn ----------

export function OpenInPreview() {
  return (
    <div className="flex justify-center">
      <OpenIn query="Explain how React Server Components stream HTML to the client.">
        <OpenInTrigger />
        <OpenInContent>
          <OpenInLabel>Open this prompt in…</OpenInLabel>
          <OpenInSeparator />
          <OpenInChatGPT />
          <OpenInClaude />
          <OpenInT3 />
          <OpenInScira />
          <OpenInv0 />
          <OpenInCursor />
        </OpenInContent>
      </OpenIn>
    </div>
  );
}
