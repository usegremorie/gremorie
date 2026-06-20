'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@gremorie/rx-display';

export function AvatarSizesPreview() {
  return (
    <div className="flex items-center gap-3">
      <Avatar size="sm">
        <AvatarImage
          src="https://avatars.githubusercontent.com/u/41934312?v=4"
          alt="@kalvner"
        />
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage
          src="https://avatars.githubusercontent.com/u/41934312?v=4"
          alt="@kalvner"
        />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarImage
          src="https://avatars.githubusercontent.com/u/41934312?v=4"
          alt="@kalvner"
        />
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    </div>
  );
}
