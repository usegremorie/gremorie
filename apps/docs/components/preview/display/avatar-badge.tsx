'use client';

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@gremorie/rx-display';

export function AvatarBadgePreview() {
  return (
    <Avatar size="lg">
      <AvatarImage
        src="https://avatars.githubusercontent.com/u/41934312?v=4"
        alt="@kalvner"
      />
      <AvatarFallback>KA</AvatarFallback>
      <AvatarBadge className="bg-emerald-500" />
    </Avatar>
  );
}
