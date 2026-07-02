'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@gremorie/rx-display';

export function AvatarFallbackPreview() {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src="/broken-image.png" alt="@kalvner" />
        <AvatarFallback>KA</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>NG</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>SP</AvatarFallback>
      </Avatar>
    </div>
  );
}
