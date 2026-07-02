'use client';

import { useState } from 'react';

import { Button } from '@gremorie/rx-forms';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@gremorie/rx-overlays';

export function DropdownMenuCheckboxesPreview() {
  const [columns, setColumns] = useState({
    name: true,
    email: true,
    role: false,
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Toggle columns</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Visible columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={columns.name}
          onCheckedChange={(checked) =>
            setColumns((prev) => ({ ...prev, name: checked === true }))
          }
        >
          Name
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columns.email}
          onCheckedChange={(checked) =>
            setColumns((prev) => ({ ...prev, email: checked === true }))
          }
        >
          Email
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={columns.role}
          onCheckedChange={(checked) =>
            setColumns((prev) => ({ ...prev, role: checked === true }))
          }
        >
          Role
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
