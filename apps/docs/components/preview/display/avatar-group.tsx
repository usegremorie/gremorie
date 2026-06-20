'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from '@gremorie/rx-display';

export function AvatarGroupPreview() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarFallback>KA</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>NG</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>SP</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  );
}
