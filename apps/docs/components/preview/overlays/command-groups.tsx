'use client';

import {
  ArchiveIcon,
  FileTextIcon,
  InboxIcon,
  SettingsIcon,
  UserIcon,
} from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@gremorie/rx-overlays';

export function CommandGroupsPreview() {
  return (
    <Command className="max-w-md rounded-lg border">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem>
            <InboxIcon />
            Inbox
            <CommandShortcut>G I</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <FileTextIcon />
            Documents
            <CommandShortcut>G D</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <ArchiveIcon />
            Archive
            <CommandShortcut>G A</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Account">
          <CommandItem>
            <UserIcon />
            Profile
          </CommandItem>
          <CommandItem>
            <SettingsIcon />
            Settings
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
