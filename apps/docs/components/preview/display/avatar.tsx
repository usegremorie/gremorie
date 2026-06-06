'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@gremorie/rx-display';

export function AvatarPreview() {
  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage
          src="https://avatars.githubusercontent.com/u/41934312?v=4"
          alt="@kalvner"
        />
        <AvatarFallback>KA</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>KA</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>NG</AvatarFallback>
      </Avatar>
    </div>
  );
}
