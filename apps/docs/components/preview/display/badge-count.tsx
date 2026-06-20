'use client';

import { Badge } from '@gremorie/rx-display';

export function BadgeCountPreview() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Inbox</span>
      <Badge>12</Badge>
      <span className="text-sm">Notifications</span>
      <Badge variant="destructive">99+</Badge>
    </div>
  );
}
