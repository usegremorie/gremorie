'use client';

import {
  Artifact,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from '@gremorie/rx-artifacts';

export function ArtifactPreview() {
  return (
    <Artifact className="max-w-2xl">
      <ArtifactHeader>
        <ArtifactTitle>Landing page hero</ArtifactTitle>
        <ArtifactDescription>
          Generated from your prompt - 3 sections.
        </ArtifactDescription>
        <ArtifactActions>
          <ArtifactClose />
        </ArtifactActions>
      </ArtifactHeader>
      <ArtifactContent>
        <p className="text-sm text-muted-foreground">
          Body content of the artifact - usually a CodeBlock, preview iframe, or
          composed view.
        </p>
      </ArtifactContent>
    </Artifact>
  );
}
