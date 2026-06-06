'use client';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@gremorie/rx-forms';
import { Search } from 'lucide-react';

export function InputGroupPreview() {
  return (
    <div className="max-w-md">
      <InputGroup>
        <InputGroupAddon>
          <Search className="size-4" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search the registry..." />
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="sm">Go</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
