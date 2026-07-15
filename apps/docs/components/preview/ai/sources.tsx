'use client';

import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from '@gremorie/rx-ai';

export function SourcesPreview() {
  return (
    <Sources>
      <SourcesTrigger count={3} />
      <SourcesContent>
        <Source href="#" title="Registry README">
          Registry README
        </Source>
        <Source href="#" title="Migration guide">
          Migration guide
        </Source>
        <Source href="#" title="v2.0 release notes">
          v2.0 release notes
        </Source>
      </SourcesContent>
    </Sources>
  );
}
