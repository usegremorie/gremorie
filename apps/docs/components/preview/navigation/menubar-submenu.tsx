'use client';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@gremorie/rx-navigation';

export function MenubarSubmenuPreview() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New file</MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Open recent</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Project alpha</MenubarItem>
              <MenubarItem>Project beta</MenubarItem>
              <MenubarItem>Project gamma</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem variant="destructive">Close window</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
