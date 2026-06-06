'use client';

import { Image } from '@gremorie/rx-ai';

// A small solid PNG (indigo), base64-encoded — stands in for an AI-generated
// image returned by the SDK as an Experimental_GeneratedImage.
const SAMPLE_IMAGE_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAKklEQVR4nGNITvtIU8QwasGoBaMWjFowasGoBaMWjFowasGoBaMWjFowasGoBaMWDBULAMgi6FsP9QbPAAAAAElFTkSuQmCC';

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
