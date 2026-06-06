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
        <Source href="#" title="Phase 5 release notes">
          Phase 5 release notes
        </Source>
      </SourcesContent>
    </Sources>
  );
}
