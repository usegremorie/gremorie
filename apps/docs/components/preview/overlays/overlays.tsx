"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  DatePicker,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  toast,
} from "@gremorie/rx-overlays";
import { Button } from "@gremorie/rx-forms";
import { useState } from "react";

// ---------- AlertDialog ----------

export function AlertDialogPreview() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The project and its data will be
            permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ---------- Dialog ----------

export function DialogPreview() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm">Form fields would go here.</p>
        <DialogFooter>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------- Drawer ----------

export function DrawerPreview() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move to archive</DrawerTitle>
          <DrawerDescription>
            Archived items can be restored within 30 days.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Archive</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// ---------- Sheet ----------

export function SheetPreview() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Narrow down the registry by category and edition.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

// ---------- Popover ----------

export function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <h4 className="text-sm font-medium">Quick settings</h4>
          <p className="text-xs text-muted-foreground">
            Toggle preferences for this session.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ---------- HoverCard ----------

export function HoverCardPreview() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@gremorie</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="text-sm">
          <strong>Gremorie</strong>
          <p className="mt-1 text-muted-foreground">
            AI-native design system. Registry + MCP first.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

// ---------- Tooltip ----------

export function TooltipPreview() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Adds an item to the registry</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ---------- DropdownMenu ----------

export function DropdownMenuPreview() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Open in chat</DropdownMenuItem>
        <DropdownMenuItem>Copy URL</DropdownMenuItem>
        <DropdownMenuItem>Export</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ---------- ContextMenu ----------

export function ContextMenuPreview() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex h-32 w-full items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
          Right-click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Copy</ContextMenuItem>
        <ContextMenuItem>Paste</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

// ---------- Command ----------

export function CommandPreview() {
  return (
    <Command className="rounded-lg border max-w-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>Profile</CommandItem>
          <CommandItem>Billing</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

// ---------- Sonner (toast) ----------

export function SonnerPreview() {
  return (
    <>
      <Button
        variant="outline"
        onClick={() =>
          toast("Primitive added", {
            description: "rx-message is now available in your project.",
          })
        }
      >
        Show toast
      </Button>
      <Toaster />
    </>
  );
}

// ---------- DatePicker ----------

export function DatePickerPreview() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return (
    <DatePicker
      value={date}
      onValueChange={setDate}
      placeholder="Pick a date"
    />
  );
}
