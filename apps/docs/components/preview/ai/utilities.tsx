'use client';

import {
  Image,
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

// ---------- Image ----------

// A small solid PNG (indigo), base64-encoded — stands in for an AI-generated
// image returned by the SDK as an Experimental_GeneratedImage.
const SAMPLE_IMAGE_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAKklEQVR4nGNITvtIU8QwasGoBaMWjFowasGoBaMWjFowasGoBaMWDBULAMgi6FsP9QbPAAAAAElFTkSuQmCC';

export function ImagePreview() {
  return (
    <div className="flex justify-center">
      <Image
        alt="AI-generated swatch"
        base64={SAMPLE_IMAGE_BASE64}
        className="w-48"
        mediaType="image/png"
        uint8Array={new Uint8Array()}
      />
    </div>
  );
}

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
