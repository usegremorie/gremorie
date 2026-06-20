'use client';

import { Badge } from '@gremorie/rx-display';

export function BadgeLinkPreview() {
  return (
    <Badge asChild variant="outline">
      <a href="#docs">Read the docs</a>
    </Badge>
  );
}
