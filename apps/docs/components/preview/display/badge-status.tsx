'use client';

import { Badge } from '@gremorie/rx-display';
import { AlertCircleIcon, CheckIcon } from 'lucide-react';

export function BadgeStatusPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="secondary">
        <CheckIcon />
        Active
      </Badge>
      <Badge variant="destructive">
        <AlertCircleIcon />
        Failed
      </Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  );
}
