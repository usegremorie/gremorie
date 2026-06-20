'use client';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@gremorie/rx-navigation';

export function MenubarShortcutsPreview() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New tab <MenubarShortcut>CtrlT</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New window <MenubarShortcut>CtrlN</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Print...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>CtrlZ</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>CtrlShiftZ</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Reload</MenubarItem>
          <MenubarItem>Fullscreen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
