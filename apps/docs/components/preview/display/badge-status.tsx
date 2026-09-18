'use client';

import { Badge } from '@gremorie/rx-display';
import { AlertCircleIcon, AlertTriangleIcon, CheckIcon } from 'lucide-react';

export function BadgeStatusPreview() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="success">
        <CheckIcon />
        Active
      </Badge>
      <Badge variant="warning">
        <AlertTriangleIcon />
        Expiring
      </Badge>
      <Badge variant="destructive">
        <AlertCircleIcon />
        Failed
      </Badge>
      <Badge variant="outline">Draft</Badge>
    </div>
  );
}
